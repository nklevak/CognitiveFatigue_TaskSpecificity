#!/bin/bash
#SBATCH --output=HMM_modeling/logs/HMM-%A_%a.out
#SBATCH --job-name=HMM_fit
#SBATCH -t 90
#SBATCH --mem=12G
#SBATCH -N 1
#SBATCH -n 1
#SBATCH --array=0-$(($(wc -l < HMM_modeling/subject_ids.txt)-1))

# Activate your environment
source ~/.bashrc
eval "$(pdm venv activate)"

# Get the subject ID for this task
SUBJECT_ID=$(sed -n "$((SLURM_ARRAY_TASK_ID+1))p" HMM_modeling/subject_ids.txt)

# Run the script for the current subject ID
python HMM_modeling/fit_nonhierarchical_HMM.py --subject_id $SUBJECT_ID