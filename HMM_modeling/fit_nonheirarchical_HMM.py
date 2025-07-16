import argparse
import json
import numpy as np
import pymc as pm
import pytensor.tensor as pt
from pytensor.scan.basic import scan
import os

def fit_subject(subject_id, subject_data, n_samples=100, n_tune=500, outdir="HMM_modeling/results"):
    subj = subject_data[subject_id]
    obs = np.column_stack((subj['epoch_accuracy'], subj['post_epoch_post_cue_rest_duration']))
    game = np.array([0 if g == 'digit_span' else 1 for g in subj['game_type']])
    time = np.array(subj['overall_epoch'])

    with pm.Model() as model:
        n_states = 2
        
        base_mu = pm.Normal('base_mu', mu=0, sigma=1, shape=(n_states, 2))
        beta_game = pm.Normal('beta_game', mu=0, sigma=1, shape=(n_states, 2))
        beta_time = pm.Normal('beta_time', mu=0, sigma=1, shape=(n_states, 2))
        sigma = pm.HalfNormal('sigma', sigma=1, shape=(n_states, 2))
        
        # Use Normal + softmax
        pi_logits = pm.Normal('pi_logits', mu=0, sigma=1, shape=n_states)
        pi = pm.math.softmax(pi_logits)
        
        A_logits = pm.Normal('A_logits', mu=0, sigma=1, shape=(n_states, n_states))
        A = pm.math.softmax(A_logits, axis=1)

        class HMMCustomDist(pm.CustomDist):
            @staticmethod
            def dist(game, time, base_mu, beta_game, beta_time, sigma, pi, A, size=None):
                return pt.zeros((game.shape[0], 2))
                
            @staticmethod
            def logp(value, game, time, base_mu, beta_game, beta_time, sigma, pi, A):
                
                n_states = 2
                
                mu = (base_mu[None, :, :] +
                      beta_game[None, :, :] * game[:, None, None] +
                      beta_time[None, :, :] * time[:, None, None])
                
                # Compute emission probabilities
                logp_states = []
                for k in range(n_states):  # Now this works since n_states = 2
                    logp_acc = pm.logp(pm.Normal.dist(mu=mu[:, k, 0], sigma=sigma[k, 0]), value[:, 0])
                    logp_rest = pm.logp(pm.Normal.dist(mu=mu[:, k, 1], sigma=sigma[k, 1]), value[:, 1])
                    logp_states.append(logp_acc + logp_rest)
                
                logp_states = pt.stack(logp_states, axis=1)
                
                # Forward algorithm
                # def scan_fn(logp_t, prev_alpha):
                #     alpha = pt.logsumexp(prev_alpha[:, None] + pt.log(A), axis=0) + logp_t
                #     return alpha
                # alpha_0 = pt.log(pi) + logp_states[0]

                def scan_fn(logp_t, prev_alpha):
                    alpha = pt.logsumexp(prev_alpha[:, None] + pt.log(A + 1e-8), axis=0) + logp_t
                    return alpha
                alpha_0 = pt.log(pi + 1e-8) + logp_states[0]


                
                alphas, _ = scan(fn=scan_fn, sequences=logp_states[1:], outputs_info=alpha_0)
                
                final_logp = pt.switch(
                    pt.gt(logp_states.shape[0], 1),
                    pt.logsumexp(alphas[-1]),
                    pt.logsumexp(alpha_0)
                )
                
                return final_logp

        obs_i = pm.CustomDist(
            f'obs_{subject_id}',
            game,
            time,
            base_mu,
            beta_game,
            beta_time,
            sigma,
            pi,
            A,
            dist=HMMCustomDist.dist,
            logp=HMMCustomDist.logp,
            observed=obs,
            ndim_supp=2,
            shape=obs.shape
        )

        trace = pm.sample(n_samples, tune=n_tune, target_accept=0.95, progressbar=False)
        # Save trace
        os.makedirs(outdir, exist_ok=True)
        trace.to_netcdf(os.path.join(outdir, f"trace_subject_{subject_id}.nc"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject_id", type=str, required=True, help="Subject ID (as in the JSON keys)")
    parser.add_argument("--data", type=str, default="HMM_modeling/subject_data_for_HMM.json")
    args = parser.parse_args()

    with open(args.data, "r") as f:
        subject_data = json.load(f)

    # logging info to make sure data is all there
    print(f"Available subjects: {list(subject_data.keys())}")
    print(f"Requested subject: {args.subject_id}")
    if args.subject_id not in subject_data:
        raise ValueError(f"Subject {args.subject_id} not found in data!")

    # altering num samples and num tuning
    fit_subject(args.subject_id, subject_data,n_samples=2000, n_tune=2000, outdir="HMM_modeling/results_n2000_t2000")
