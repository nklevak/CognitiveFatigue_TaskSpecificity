# THIS CODE: runs a nonhierarchical HMM fit to all subjects using their pooled data
import argparse
import json
import numpy as np
import pymc as pm
import pytensor.tensor as pt
from pytensor.scan.basic import scan
import os

# this model assumes rest and acc are independent (might need to change that later)
def fit_pooled_model(subject_data, n_samples=100, n_tune=500, n_states=2, outdir="HMM_modeling/results"):
    """Fit a fully pooled HMM model across all subjects"""

    # Combine data
    all_obs = []
    all_game = []
    all_time = []
    subject_starts = []  # Track where each subject's data starts
    subject_lengths = []  # Track length of each subject's data
    
    current_idx = 0
    subject_ids = list(subject_data.keys())
    
    for subject_id in subject_ids:
        subj = subject_data[subject_id]
        obs = np.column_stack((subj['epoch_accuracy'], subj['post_epoch_post_cue_rest_duration']))
        game = np.array([0 if g == 'digit_span' else 1 for g in subj['game_type']])
        time = np.array(subj['overall_epoch'])
        
        all_obs.append(obs)
        all_game.append(game)
        all_time.append(time)
        subject_starts.append(current_idx)
        subject_lengths.append(len(obs))
        current_idx += len(obs)
    
    # Concatenate
    obs_pooled = np.vstack(all_obs)
    game_pooled = np.concatenate(all_game)
    time_pooled = np.concatenate(all_time)
    subject_starts = np.array(subject_starts)
    subject_lengths = np.array(subject_lengths)
    n_subjects = len(subject_ids)

    print(f"Pooled data shape: {obs_pooled.shape}")
    print(f"Number of subjects: {n_subjects}")
    print(f"Total observations: {len(obs_pooled)}")
    print(f"Observations per subject: {subject_lengths}")
    
    # Standardize the data to help with numerical stability
    obs_mean = np.mean(obs_pooled, axis=0)
    obs_std = np.std(obs_pooled, axis=0)
    obs_pooled_std = (obs_pooled - obs_mean) / obs_std
    
    # Standardize time as well
    time_mean = np.mean(time_pooled)
    time_std = np.std(time_pooled)
    time_pooled_std = (time_pooled - time_mean) / time_std
    
    print(f"Data standardized: obs_mean={obs_mean}, obs_std={obs_std}")
    print(f"Time standardized: time_mean={time_mean}, time_std={time_std}")

    with pm.Model() as model:
        # these parameters are shared across all subjects
        # Use smaller prior variances for better numerical stability

        # base_mu = pm.Normal('base_mu',
        #                     mu=[[0.2, 0.9], [-0.2, -0.1]],# based off of simple HMMlearn model
        #                     sigma=0.3,
        #                     shape=(n_states, 2))        
        
        base_mu = pm.Normal('base_mu', mu=0, sigma=0.5, shape=(n_states, 2))
        beta_game = pm.Normal('beta_game', mu=0, sigma=0.5, shape=(n_states, 2))
        beta_time = pm.Normal('beta_time', mu=0, sigma=0.5, shape=(n_states, 2))
        sigma = pm.HalfNormal('sigma', sigma=0.5, shape=(n_states, 2))
        
        # Shared transition and initial state probabilities
        pi_logits = pm.Normal('pi_logits', mu=0, sigma=1, shape=n_states)
        pi = pm.math.softmax(pi_logits)
        
        A_logits = pm.Normal('A_logits', mu=0, sigma=1, shape=(n_states, n_states))
        A = pm.math.softmax(A_logits, axis=1)

        class PooledHMMCustomDist(pm.CustomDist):
            @staticmethod
            def dist(game, time, subject_starts, subject_lengths, base_mu, beta_game, beta_time, sigma, pi, A, n_states,
                     n_subjects, size=None):
                return pt.zeros((game.shape[0], 2))
                
            @staticmethod
            def logp(value, game, time, subject_starts, subject_lengths, base_mu, beta_game, beta_time, sigma, pi, A, n_states,
                     n_subjects):
                n_states = n_states.eval()
                n_subjects = n_subjects.eval()
                
                mu = (base_mu[None, :, :] +
                      beta_game[None, :, :] * game[:, None, None] +
                      beta_time[None, :, :] * time[:, None, None])
                
                # Compute emission probabilities for all observations
                logp_states = []
                for k in range(n_states):
                    # Add small epsilon to sigma to prevent numerical issues
                    sigma_safe = pt.maximum(sigma[k, 0], 1e-3)
                    logp_acc = pm.logp(pm.Normal.dist(mu=mu[:, k, 0], sigma=sigma_safe), value[:, 0])
                    
                    sigma_safe = pt.maximum(sigma[k, 1], 1e-3)
                    logp_rest = pm.logp(pm.Normal.dist(mu=mu[:, k, 1], sigma=sigma_safe), value[:, 1])
                    
                    # Clip very negative log probabilities to prevent -inf
                    logp_combined = pt.clip(logp_acc + logp_rest, -500, 50)
                    logp_states.append(logp_combined)
                
                logp_states = pt.stack(logp_states, axis=1)  # Shape: (n_obs, n_states)
                
                # Forward algorithm for each subject separately
                def subject_forward(subj_idx):
                    start_idx = subject_starts[subj_idx]
                    length = subject_lengths[subj_idx]
                    end_idx = start_idx + length
                    
                    subj_logp_states = logp_states[start_idx:end_idx]

                    # forward function; updates state probabilities based on what is known about previous time steps
                    def scan_fn(logp_t, prev_alpha):
                        # Ensure A has no zeros by adding small epsilon
                        A_safe = A + 1e-10
                        alpha = pt.logsumexp(prev_alpha[:, None] + pt.log(A_safe), axis=0) + logp_t
                        # Clip alpha to prevent overflow
                        alpha = pt.clip(alpha, -500, 50)
                        return alpha
                    
                    # Ensure pi has no zeros
                    pi_safe = pi + 1e-10
                    alpha_0 = pt.log(pi_safe) + subj_logp_states[0]
                    alpha_0 = pt.clip(alpha_0, -500, 50)
                    
                    # Handle single observation case
                    final_logp = pt.switch(
                        pt.gt(length, 1),
                        pt.logsumexp(
                            scan(fn=scan_fn, 
                                sequences=subj_logp_states[1:], 
                                outputs_info=alpha_0)[0][-1]
                        ),
                        pt.logsumexp(alpha_0)
                    )
                    
                    # Final clipping
                    final_logp = pt.clip(final_logp, -500, 50)
                    return final_logp
                
                # Compute log probability for each subject and sum
                subject_logps = []
                for i in range(n_subjects):
                    subj_logp = subject_forward(i)
                    subject_logps.append(subj_logp)
                
                total_logp = pt.sum(pt.stack(subject_logps))
                
                # Final check for reasonable values
                total_logp = pt.switch(pt.isnan(total_logp), -1e6, total_logp)
                total_logp = pt.switch(pt.isinf(total_logp), -1e6, total_logp)
                
                return total_logp

        obs_pooled_tensor = pm.CustomDist(
            'obs_pooled',
            game_pooled,
            time_pooled_std,  # Use standardized time
            subject_starts,
            subject_lengths,
            base_mu,
            beta_game,
            beta_time,
            sigma,
            pi,
            A,
            n_states,
            n_subjects,
            dist=PooledHMMCustomDist.dist,
            logp=PooledHMMCustomDist.logp,
            observed=obs_pooled_std,  # Use standardized observations
            ndim_supp=2,
            shape=obs_pooled_std.shape
        )

        # Try different initialization strategies
        try:
            print("Attempting to sample...")
            trace = pm.sample(n_samples, tune=n_tune, init='jitter+adapt_diag', 
                 target_accept=0.90, nuts={"max_treedepth": 10}, 
                 progressbar=True, return_inferencedata=True)
            print("Sampling completed successfully!")
        except Exception as e:
            print(f"Sampling failed with error: {e}")
            print("This is likely due to numerical issues in the model.")
            return None
        
        # Save trace
        os.makedirs(outdir, exist_ok=True)
        trace.to_netcdf(os.path.join(outdir, "trace_pooled_model.nc"))
        
        # Save subject mapping; this will record which of the pooled observations belong to which subject
        subject_mapping = {i: subject_id for i, subject_id in enumerate(subject_ids)}
        pooled_info = {
            'subject_mapping': subject_mapping,
            'subject_starts': subject_starts.tolist(),
            'subject_lengths': subject_lengths.tolist(),
            'n_subjects': n_subjects,
            'total_observations': len(obs_pooled),
            'standardization': {
                'obs_mean': obs_mean.tolist(),
                'obs_std': obs_std.tolist(),
                'time_mean': float(time_mean),
                'time_std': float(time_std)
            }
        }
        
        with open(os.path.join(outdir, "pooled_model_info.json"), "w") as f:
            json.dump(pooled_info, f, indent=2)
        
        print(f"Pooled model saved to: {outdir}")
        print(f"Subject mapping saved to: {os.path.join(outdir, 'pooled_model_info.json')}")
        
        return trace
        
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, default="HMM_modeling/subject_data_for_HMM.json")
    parser.add_argument("--n_samples", type=int, default=5000)
    parser.add_argument("--n_tune", type=int, default=5000) 
    parser.add_argument("--n_states", type=int, default=2)
    args = parser.parse_args()

    with open(args.data, "r") as f:
        subject_data = json.load(f)

    print("Fitting pooled model across all subjects...")
    print(f"Available subjects: {list(subject_data.keys())}")
    outdir = f"HMM_modeling/results_pooled_{args.n_states}state_n{args.n_samples}_t{args.n_tune}"
    
    try:
        trace = fit_pooled_model(subject_data, 
                            n_samples=args.n_samples,
                            n_tune=args.n_tune,
                            n_states=args.n_states,
                            outdir=outdir)
        if trace is None:
            print("Model fitting failed!")
            exit(1)
        else:
            print("Model fitting completed successfully!")
    except Exception as e:
        print(f"Error in model fitting: {e}")
        exit(1)