import argparse
import json
import numpy as np
import pymc as pm
import pytensor.tensor as pt
from pytensor.scan.basic import scan
import os

def fit_subject(subject_id, subject_data, n_states=2, n_samples=100, n_tune=500, outdir="HMM_modeling/results"):
    subj = subject_data[subject_id]
    obs = np.column_stack((subj['epoch_accuracy'], subj['post_epoch_post_cue_rest_duration']))
    game = np.array([0 if g == 'digit_span' else 1 for g in subj['game_type']])
    time = np.array(subj['overall_epoch'])

    with pm.Model() as model:
        base_mu = pm.Normal('base_mu', mu=0, sigma=1, shape=(n_states, 2))
        beta_game = pm.Normal('beta_game', mu=0, sigma=1, shape=(n_states, 2))
        beta_time = pm.Normal('beta_time', mu=0, sigma=1, shape=(n_states, 2))
        sigma = pm.HalfNormal('sigma', sigma=1, shape=(n_states, 2))
        pi = pm.Dirichlet('pi', a=np.ones(n_states))
        A = pm.Dirichlet('A', a=np.ones((n_states, n_states)), shape=(n_states, n_states))

        class HMMCustomDist(pm.CustomDist):
            @staticmethod
            def dist(size, value, game, time, base_mu, beta_game, beta_time, sigma, pi, A):
                return pt.zeros_like(value)
            @staticmethod
            def logp(size, value, game, time, base_mu, beta_game, beta_time, sigma, pi, A):
                mu = (base_mu[None, :, :] +
                      beta_game[None, :, :] * game[:, None, None] +
                      beta_time[None, :, :] * time[:, None, None])
                logp_states = []
                for k in range(n_states):
                    logp_acc = pm.logp(pm.Normal.dist(mu=mu[:, k, 0], sigma=sigma[k, 0]), value[:, 0])
                    logp_rest = pm.logp(pm.Normal.dist(mu=mu[:, k, 1], sigma=sigma[k, 1]), value[:, 1])
                    logp_states.append(logp_acc + logp_rest)
                logp_states = pt.stack(logp_states, axis=1)
                def scan_fn(logp_t, prev_alpha):
                    alpha = pt.logsumexp(prev_alpha + pt.log(A), axis=1) + logp_t
                    return alpha
                alpha_0 = pt.log(pi) + logp_states[0]
                alphas, _ = scan(fn=scan_fn, sequences=logp_states[1:], outputs_info=alpha_0)
                logp = pt.logsumexp(alphas[-1])
                return logp

        obs_i = pm.CustomDist(
            f'obs_{subject_id}',
            obs,
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
            ndim_supp=0,
            shape=()
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
    fit_subject(args.subject_id, subject_data)
