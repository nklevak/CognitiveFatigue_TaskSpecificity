This folder has the pymc package implementation attempts; if re-running, have to change the filepaths in all of them because this got re-rorged.

Status:
- 
- Attempted pooling and subject-specific models; subject-specific ones had poor convergence, pooling ones continually got stuck on a pytensor compilation issue during sampling.
- Pymc would allow to include covariates (time, game type, and task switching) in the model explicitly, but using simpler methods we can get results and then add analysis for the impact of the covariates.