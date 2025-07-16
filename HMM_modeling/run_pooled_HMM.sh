#!/bin/bash
#SBATCH --output=HMM_modeling/logs/HMM-pooled-%j.out
#SBATCH --error=HMM_modeling/logs/HMM-pooled-%j.err
#SBATCH --job-name=HMM_pooled_fit
#SBATCH -t 180
#SBATCH --mem=12G
#SBATCH -N 1
#SBATCH -n 1

# Default values (can be overridden)
N_STATES=${N_STATES:-2}
N_SAMPLES=${N_SAMPLES:-5000}
N_TUNE=${N_TUNE:-5000}

echo "Running HMM with:"
echo "  States: $N_STATES"
echo "  Samples: $N_SAMPLES" 
echo "  Tune: $N_TUNE"
echo "  Job ID: $SLURM_JOB_ID"

# Create logs directory
mkdir -p HMM_modeling/logs

# Force PyTensor to use Python-only mode (no C compilation)
export PYTENSOR_FLAGS="device=cpu,floatX=float64,optimizer=fast_compile,cxx="
export OMP_NUM_THREADS=1

# Use job-specific temp directory for any remaining cache
export PYTENSOR_COMPILEDIR="/tmp/pytensor_${SLURM_JOB_ID}"
mkdir -p $PYTENSOR_COMPILEDIR

# Install dependencies if needed  
/home/users/nklevak/miniconda3/bin/python -m pdm install -v

# Activate PDM environment
eval "$(/home/users/nklevak/miniconda3/bin/python -m pdm venv activate)"

echo "PyTensor flags: $PYTENSOR_FLAGS"
echo "Starting HMM fit at $(date)"

# Run the pooled HMM
python HMM_modeling/fit_pooled_HMM.py \
    --n_states $N_STATES \
    --n_samples $N_SAMPLES \
    --n_tune $N_TUNE

echo "HMM fit completed at $(date)"

# Clean up temp directory
rm -rf $PYTENSOR_COMPILEDIR

echo "Job finished successfully"