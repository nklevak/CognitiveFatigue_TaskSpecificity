#!/bin/bash
#SBATCH --output=HMM_modeling/logs/HMM-%A_%a.out
#SBATCH --error=HMM_modeling/logs/HMM-%A_%a.err
#SBATCH --job-name=HMM_fit
#SBATCH -t 90
#SBATCH --mem=12G
#SBATCH -N 1
#SBATCH -n 1
#SBATCH --array=0-2

# Create logs directory
mkdir -p HMM_modeling/logs

# Force PyTensor to use Python-only mode (no C compilation)
export PYTENSOR_FLAGS="device=cpu,floatX=float64,optimizer=fast_compile,cxx="
export OMP_NUM_THREADS=1

# Use job-specific temp directory for any remaining cache
export PYTENSOR_COMPILEDIR="/tmp/pytensor_${SLURM_JOB_ID}_${SLURM_ARRAY_TASK_ID}"
mkdir -p $PYTENSOR_COMPILEDIR

# Install dependencies if needed  
/home/users/nklevak/miniconda3/bin/python -m pdm install -v

# Activate PDM environment
eval "$(/home/users/nklevak/miniconda3/bin/python -m pdm venv activate)"

# Get subject ID and run
SUBJECT_ID=$(sed -n "$((SLURM_ARRAY_TASK_ID+1))p" HMM_modeling/subject_ids.txt)

echo "Processing subject: $SUBJECT_ID"
echo "PyTensor flags: $PYTENSOR_FLAGS"

python HMM_modeling/fit_nonheirarchical_HMM.py --subject_id $SUBJECT_ID

# Clean up temp directory
rm -rf $PYTENSOR_COMPILEDIR