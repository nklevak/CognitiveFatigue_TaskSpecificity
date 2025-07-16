# THIS CODE: runs a nonheirarchical HMM fit to all subjects using their pooled data
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

    with pm.Model() as model:
        # these parameters are shared across all subjects
        base_mu = pm.Normal('base_mu', mu=0, sigma=1, shape=(n_states, 2))
        beta_game = pm.Normal('beta_game', mu=0, sigma=1, shape=(n_states, 2))
        beta_time = pm.Normal('beta_time', mu=0, sigma=1, shape=(n_states, 2))
        sigma = pm.HalfNormal('sigma', sigma=1, shape=(n_states, 2))
        
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
                    logp_acc = pm.logp(pm.Normal.dist(mu=mu[:, k, 0], sigma=sigma[k, 0]), value[:, 0])
                    logp_rest = pm.logp(pm.Normal.dist(mu=mu[:, k, 1], sigma=sigma[k, 1]), value[:, 1])
                    logp_states.append(logp_acc + logp_rest)
                
                logp_states = pt.stack(logp_states, axis=1)  # Shape: (n_obs, n_states)
                
                # Forward algorithm for each subject separately
                def subject_forward(subj_idx):
                    start_idx = subject_starts[subj_idx]
                    length = subject_lengths[subj_idx]
                    end_idx = start_idx + length
                    
                    subj_logp_states = logp_states[start_idx:end_idx]

                    # forward function; updates state probabilities based on what is known about previous time steps
                    def scan_fn(logp_t, prev_alpha):
                        alpha = pt.logsumexp(prev_alpha[:, None] + pt.log(A + 1e-8), axis=0) + logp_t
                        return alpha
                    
                    alpha_0 = pt.log(pi + 1e-8) + subj_logp_states[0]
                    
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
                    return final_logp
                
                # Compute log probability for each subject and sum
                subject_logps = []
                for i in range(n_subjects):
                    subj_logp = subject_forward(i)
                    subject_logps.append(subj_logp)
                
                total_logp = pt.sum(pt.stack(subject_logps))
                return total_logp

        obs_pooled_tensor = pm.CustomDist(
            'obs_pooled',
            game_pooled,
            time_pooled,
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
            observed=obs_pooled,
            ndim_supp=2,
            shape=obs_pooled.shape
        )

        trace = pm.sample(n_samples, tune=n_tune, init='adapt_diag', target_accept=0.95, progressbar=True)
        
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
            'total_observations': len(obs_pooled)
        }
        
        with open(os.path.join(outdir, "pooled_model_info.json"), "w") as f:
            json.dump(pooled_info, f, indent=2)
        
        print(f"Pooled model saved to: {outdir}")
        print(f"Subject mapping saved to: {os.path.join(outdir, 'pooled_model_info.json')}")
        
        return trace
        
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    # parser.add_argument("--subject_id", type=str, help="Subject ID (for individual fitting)")
    # parser.add_argument("--pooled", action="store_true", help="Fit pooled model across all subjects") # can add this if later add more functions to this script
    parser.add_argument("--data", type=str, default="HMM_modeling/subject_data_for_HMM.json")
    parser.add_argument("--n_samples", type=int, default=5000)
    parser.add_argument("--n_tune", type=int, default=5000) 
    parser.add_argument("--n_states", type=int, default=2)
    args = parser.parse_args()

    with open(args.data, "r") as f:
        subject_data = json.load(f)

    print("Fitting pooled model across all subjects...")
    print(f"Available subjects: {list(subject_data.keys())}")
    outdir = f"HMM_modeling/results_pooled_{args.n_states}states_n{args.n_samples}_t{args.n_tune}"
    fit_pooled_model(subject_data, 
                    n_samples=args.n_samples,
                    n_tune=args.n_tune,
                    n_states=args.n_states,
                    outdir=outdir)