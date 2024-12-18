This is the December 2024 iteration of this experiment, with self-paced rest periods. SPR = self-paced rest
The rest task and spatial recall are based off of the dsst task in the niv lab demos site
The digit span task was inspired by experiment factory digit span

Currently: 

Game A and Game B are counterbalanced to be either spatial recall or digit span
Current ordering (18 blocks): ABABBABAABABAABABB (9 As and 9 Bs)

## OVERALL PARAMETERS CURRENTLY:

ds_trials_per_block = 10
ds_practice_trial_num = 4

sr_trials_per_block = 10
sr_practice_trial_num = 4

max_num_rest_trials_per_block = 20
rest_num_practice_trials = 4

length of 1 rest trial: 1.5 seconds
digits in digit span: 4
squares in spatial recall: 4
total number of rest trials: 10 groups * 3 blocks per group * 20 max rest per rest period = 600 rest trials 

GROUP ORDER: ABABBABAAB (where each group is block + rest + block + rest + block)

endowment: 600 points (1 point per one rest trial taken)
basic bonus: 2 dollars
additional bonus: up to 2 dollars (actual = prop of rest left unused * 2)

#### DIGIT SPAN

**Digit span task block:**
- trials per block (*ds_trials_per_block*) = 10
- one trial = 
	- 4 digits (275 ms each + 200 empty flash each) = 1900 ms = 1.9 seconds
	- keyboard entry time = maximum 4000 ms = 0 to 4 seconds
- in total =
	- minimum: 10 * (1.9 + 0) = 19 seconds
	- **maximum: 10 * (1.9 + 4) = 59 seconds**

**Digit span practice task block:**
- trials per block (*ds_practice_trial_num*) = 4
- one practice trial = 
	- 4 digits (275 ms each + 200 empty flash before each) = 1900 ms = 1.9 seconds
	-  keyboard entry time = maximum 4000 ms = 0 to 4 seconds
	- feedback = 1000 ms = 1s
- in total = 
	- minimum: 4 * (1.9 + 0 + 1) = 11.6 seconds
	- maximum: 4 * (1.9 + 4 + 1) = **27.6 seconds**

#### SPATIAL RECALL

Spatial recall task block:
- trials per block (*sr_trials_per_block*) = 10
- one trial = 
	- 4 squares (275 ms each + 200 empty flash each) = 1900 ms = 1.9 seconds
	- keyboard entry time = maximum 3000 ms = 0 to 4 seconds
	- initial stimulus duration = 100 ms = 0.1 s
- in total =
	- minimum: 10 * (1.9 + 0 + 0.1) = 20 seconds
	- maximum: 10 * (1.9 + 4 + 0.1) = **60 seconds**

Spatial recall practice task block:
- trials per block (*sr_practice_trial_num*) = 4
- one practice trial = 
	- 4 squares (275 ms each + 200 empty flash each) = 1900 ms = 1.9 seconds
	- keyboard entry time = maximum 3000 ms = 0 to 3 seconds
	- initial stimulus duration = 100 ms = 0.1 s
	- feedback = 1000 ms = 1 s
- in total = 
	- minimum: 4 * (1.9 + 0 + 0.1 + 1) = 12
	- maximum: 4 * (1.9 + 4 + 0.1 + 1) = 28

#### REST TASK

**Rest task block:** 
- trials per block (*max_num_rest_trials_per_block*) = 1 to 20
- one trial = 
	- show the two shapes and the prompt = 1400 ms = 1.35 seconds
	- clear screen after each trial (*clear_duration*)= 100 ms = 0.15 seconds
	- total per trial: **1.5 seconds**
	- length of cue: 1500 ms = 1.5 seconds
	- minimum in a rest block: 1.5 second + 1.5 seconds = 3 seconds
	- maximum in a rest block: 30 seconds + 1.5 seconds = 31.5 seconds

**Total time of rest trials (since it is a fixed amount)**
- number rest trials (there is a rest block after every task block) = 
	- *num_groups * num_blocks_per_group * max_num_rest_trials_per_block* = 10 groups * 3 blocks per group * 20 rest trials = 600
- total time of all rest trials = 
	- number rest trials * length per trial = 600 * 1.5 second = **900 seconds**

**Rest practice task block:**
- trials per block (*rest_num_practice_trials*) = 4
- one trial = 
	- show the two shapes and the prompt = 1350 ms = 1.35 seconds
	- clear screen after each trial (*clear_duration*)= 150 ms = 0.15 seconds
	- show feedback = 1000 ms = 1 s
	- total: **2.5 seconds**
- a whole practice block: 4 * 2.5 = 10 seconds

*****************

# Block numbers and organization

Order of groups: 
### ABABBABAAB
- 5 A, 5 B groups
	- each group is block + rest + block + rest + block, so 3 blocks and 2 rests
- A cue before every rest block so num_groups * num_blocks_per_group cues, so 10 * 3 = 30 cues, 30 * 1.5 seconds = 45 seconds of cues


## total timing:
 - all of the rests: 900 seconds
 - all of the cues: 45 seconds
 - rest practice: 10 seconds
 - spatial recall practice: max 28 seconds
 - digit span practice: max 27.6 seconds
 - 3 * 5  = 15 blocks of spatial recall (not including rests) = 15 * 60 = max 900 seconds
 - 3 * 5  = 15 blocks of digit span (not including rests) = 15 * 59 = max 885 seconds
- instructions and debrief: approximately 4 minutes max = 240 seconds


**TOTAL**: 900 + 45 + 10 + 28 + 27.6 + 900 + 885 + 240 = **50.59 minutes maximum**