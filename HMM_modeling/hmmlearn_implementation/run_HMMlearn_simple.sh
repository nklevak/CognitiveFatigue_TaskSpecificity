#!/bin/bash
#SBATCH --output=HMM_modeling/logs/hmm-test-%j.out
#SBATCH --error=HMM_modeling/logs/hmm-test-%j.err
#SBATCH --job-name=hmm_test
#SBATCH -t 60
#SBATCH --mem=4G
#SBATCH -N 1
#SBATCH -n 1

echo "HMM Test Job ID: $SLURM_JOB_ID"
echo "Starting at $(date)"

# Create logs directory
mkdir -p HMM_modeling/logss
# Install dependencies with PDM (includes hmmlearn if you added it)
echo "Installing dependencies..."
/home/users/nklevak/miniconda3/bin/python -m pdm install -v

# Activate PDM environment
eval "$(/home/users/nklevak/miniconda3/bin/python -m pdm venv activate)"

echo "Running hmmlearn test..."

# Run the test
python HMM_modeling/fit_nonheirarchical_HMM_HMMlearn.py

echo "Test completed at $(date)"
echo "Check hmm_test_results.png for plots"