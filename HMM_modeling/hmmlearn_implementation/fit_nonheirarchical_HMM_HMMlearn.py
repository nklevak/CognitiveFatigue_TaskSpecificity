#!/usr/bin/env python3
# OLD: was used as an initial test run

# THIS CODE: uses HMMlearn to run a nonheirarchical HMM fit to each subject individually (seeing if my pymc interpretation was just wrong so far, or if the data structure has issues). Also using this to get better estimates for the initial params (to then feed into my pymc model).

import numpy as np
import json
from hmmlearn import hmm
import matplotlib.pyplot as plt

def simple_hmm_test():
    """Simple test of hmmlearn with your data"""
    
    print("Loading data...")
    with open("HMM_modeling/subject_data_for_HMM.json", "r") as f:
        subject_data = json.load(f)
    
    print(f"Loaded {len(subject_data)} subjects")
    
    # Test with first few subjects
    test_subjects = list(subject_data.keys())[:5]
    print(f"Testing with subjects: {test_subjects}")
    
    for subject_id in test_subjects:
        print(f"\n--- Subject {subject_id} ---")
        
        subj = subject_data[subject_id]
        
        # Prepare observations
        accuracy = np.array(subj['epoch_accuracy'])
        rest_duration = np.array(subj['post_epoch_post_cue_rest_duration'])
        
        # potentially normalize rest duration (for now keep it)
        rest_scaled = rest_duration
        
        obs = np.column_stack([accuracy, rest_scaled])
        
        print(f"Data shape: {obs.shape}")
        print(f"Accuracy range: {accuracy.min():.3f} to {accuracy.max():.3f}")
        print(f"Rest range: {rest_scaled.min():.3f} to {rest_scaled.max():.3f} trials")
        
        # Fit 2-state HMM
        try:
            model = hmm.GaussianHMM(n_components=2, covariance_type="full", 
                                   n_iter=50, random_state=42)
            model.fit(obs)
            
            # Get results
            log_prob = model.score(obs)
            states = model.predict(obs)
            
            print(f"✓ Model fitted successfully!")
            print(f"  Log probability: {log_prob:.2f}")
            print(f"  Converged: {model.monitor_.converged}")
            
            # Show state characteristics
            print("\nState characteristics:")
            for i in range(2):
                mean_acc = model.means_[i, 0]
                mean_rest = model.means_[i, 1]
                state_count = np.sum(states == i)
                print(f"  State {i}: accuracy={mean_acc:.3f}, rest={mean_rest:.3f}s, count={state_count}")
            
            print(f"\nTransition matrix:")
            for i, row in enumerate(model.transmat_):
                print(f"  From state {i}: {row}")
                
        except Exception as e:
            print(f"✗ Model failed: {e}")
    
    # Test pooled approach
    print(f"\n{'='*50}")
    print("POOLED MODEL TEST")
    print('='*50)
    
    # Combine all subjects
    all_obs = []
    lengths = []
    
    for subject_id in test_subjects:
        subj = subject_data[subject_id]
        accuracy = np.array(subj['epoch_accuracy'])
        rest_scaled = np.array(subj['post_epoch_post_cue_rest_duration']) / 1000.0
        obs = np.column_stack([accuracy, rest_scaled])
        all_obs.append(obs)
        lengths.append(len(obs))
    
    pooled_obs = np.vstack(all_obs)
    print(f"Pooled data shape: {pooled_obs.shape}")
    print(f"Subject lengths: {lengths}")
    
    try:
        pooled_model = hmm.GaussianHMM(n_components=2, covariance_type="full",
                                      n_iter=50, random_state=42)
        pooled_model.fit(pooled_obs, lengths=lengths)
        
        pooled_log_prob = pooled_model.score(pooled_obs, lengths=lengths)
        
        print(f"✓ Pooled model fitted successfully!")
        print(f"  Log probability: {pooled_log_prob:.2f}")
        print(f"  Converged: {pooled_model.monitor_.converged}")
        
        print(f"\nPooled state characteristics:")
        for i in range(2):
            mean_acc = pooled_model.means_[i, 0]
            mean_rest = pooled_model.means_[i, 1]
            print(f"  State {i}: accuracy={mean_acc:.3f}, rest={mean_rest:.3f}s")
        
        print(f"\nPooled transition matrix:")
        for i, row in enumerate(pooled_model.transmat_):
            print(f"  From state {i}: {row}")
        
        # Quick visualization
        try:
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
            
            # Plot state means
            ax1.scatter(pooled_model.means_[:, 0], pooled_model.means_[:, 1], 
                       s=200, alpha=0.7, c=['red', 'blue'])
            for i, mean in enumerate(pooled_model.means_):
                ax1.annotate(f'State {i}', (mean[0], mean[1]), 
                           xytext=(5, 5), textcoords='offset points')
            ax1.set_xlabel('Accuracy')
            ax1.set_ylabel('Rest Duration (s)')
            ax1.set_title('State Means')
            ax1.grid(True, alpha=0.3)
            
            # Plot transition matrix
            im = ax2.imshow(pooled_model.transmat_, cmap='Blues', vmin=0, vmax=1)
            ax2.set_title('Transition Matrix')
            ax2.set_xlabel('To State')
            ax2.set_ylabel('From State')
            for i in range(2):
                for j in range(2):
                    ax2.text(j, i, f'{pooled_model.transmat_[i,j]:.2f}', 
                           ha='center', va='center')
            
            plt.tight_layout()
            plt.savefig('hmm_test_results.png', dpi=150, bbox_inches='tight')
            print(f"\n Plot saved as 'hmm_test_results.png'")
            
        except Exception as e:
            print(f"Plotting failed: {e}")
        
        return True
        
    except Exception as e:
        print(f"✗ Pooled model failed: {e}")
        return False

if __name__ == "__main__":
    print("Simple HMM with hmmlearn (does not include time or game_type as covariates; non-bayesian.")
    print("="*40)
    
    try:
        success = simple_hmm_test()
        if success:
            print(f"\n HMM models work with your data.")
        else:
            print(f"\n  Issues found.")
    except Exception as e:
        print(f"\n Failed: {e}")
