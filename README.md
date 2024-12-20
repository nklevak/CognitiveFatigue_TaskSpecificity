# CognitiveFatigue_TaskSpecificity

#### DIGIT SPAN

**Digit span task block:**
- trials per block (*ds_trials_per_block*) = 12
- one trial = 
	- 4 digits (275 ms each + 200 empty flash each) = 1900 ms = 1.9 seconds
	- keyboard entry time = maximum 3000 ms = 0 to 3 seconds
- in total =
	- minimum: 12 * (1.9 + 0) = 22.8 seconds
	- maximum: 12 * (1.9 + 3) = **58.8 seconds**

**Digit span practice task block:**
- trials per block (*ds_practice_trial_num*) = 6
- one practice trial = 
	- 4 digits (275 ms each + 200 empty flash before each) = 1900 ms = 1.9 seconds
	-  keyboard entry time = maximum 3000 ms = 0 to 3 seconds
	- feedback = 1000 ms = 1s
- in total = 
	- minimum: 6 * (1.9 + 0 + 1) = 17.4 seconds
	- maximum: 6 * (1.9 + 3 + 1) = **35.4 seconds**

#### SPATIAL RECALL

Spatial recall task block:
- trials per block (*sr_trials_per_block*) = 12
- one trial = 
	- 4 squares (275 ms each + 200 empty flash each) = 1900 ms = 1.9 seconds
	- keyboard entry time = maximum 3000 ms = 0 to 3 seconds
	- initial stimulus duration = 100 ms = 0.1 s
- in total =
	- minimum: 12 * (1.9 + 0 + 0.1) = 24 seconds
	- maximum: 12 * (1.9 + 3 + 0.1) = **60 seconds**

Spatial recall practice task block:
- trials per block (*sr_practice_trial_num*) = 6
- one practice trial = 
	- 4 squares (275 ms each + 200 empty flash each) = 1900 ms = 1.9 seconds
	- keyboard entry time = maximum 3000 ms = 0 to 3 seconds
	- initial stimulus duration = 100 ms = 0.1 s
	- feedback = 1000 ms = 1 s
- in total = 
	- minimum: 6 * (1.9 + 0 + 0.1 + 1) = 18
	- maximum: 6 * (1.9 + 3 + 0.1 + 1) = 36

#### REST TASK

**Rest task block:** 
- trials per block (*max_num_rest_trials_per_block*) = 1 to 30
- one trial = 
	- show the two shapes and the prompt = 900 ms = 0.9 seconds
	- clear screen after each trial (*clear_duration*)= 100 ms = 0.1 seconds
	- total per trial: **1 second**
	- length of cue: 2000 ms = 2 second
	- minimum in a rest block: 1 second + 2 seconds = 3 seconds
	- maximum in a rest block: 40 seconds + 2 seconds = 42 seconds

**Total time of rest trials (since it is a fixed amount)**
- number rest trials = 
	- *num_groups * num_blocks_per_group * max_num_rest_trials_per_block* = 10 groups * 3 blocks * 30 rest trials = 900
- total time of all rest trials = 
	- number rest trials * length per trial = 900 * 1 second = **900 seconds**

**Rest practice task block:**
- trials per block (*rest_num_practice_trials*) = 6
- one trial = 
	- show the two shapes and the prompt = 900 ms = 0.9 seconds
	- clear screen after each trial (*clear_duration*)= 100 ms = 0.1 seconds
	- show feedback = 1000 ms = 1 s
	- total: **2 seconds**
- a whole practice block: 6 * 2 = 12 seconds

### Group timing

#### spatial recall group: 
- spatial recall block + rest + spatial recall block + rest + spatial recall block
	- maximum: 3 *  60 + 2 * max_rest_length = 3 * 60 + 2 * 32 = **244 seconds**
	
#### digit span group:
- digit span block + rest + digit span block + rest + digit span block 
	- maximum: 3 * 58.8 + 2 * max_rest_length =  3 * 58.8 + 2 * 32 = **240.4 seconds**


*****************

# Block numbers and organization

Order of groups: 
### ABABBABAAB
- 5 A, 5 B groups
	- each group is block + rest + block + rest + block, so 3 blocks and 2 rests
- 2 * 10 cues for the rest within groups, plus 5 cues for between groups = 25 cues = 50 seconds of cues


## total timing:
 - all of the rests: 900 seconds
 - all of the cues: 50 seconds
 - rest practice: 12 seconds
 - spatial recall practice: max 36 seconds
 - digit span practice: max 35.4 seconds
 - 3 * 5  = 15 blocks of spatial recall (not including rests) = 15 * 60 = max 900 seconds
 - 3 * 5  = 15 blocks of digit span (not including rests) = 15 * 58.8 = max 882 seconds
- instructions: approximately 5 minutes max = 300 seconds


**TOTAL**: 900 + 50 + 12 + 36 + 35.4 + 900 + 882 + 300 = **51.9 minutes maximum**




# credit to Sam Zorowitz from jspsych-demos for most of the spatial recall code, and Experiment Factory from the Poldrack Lab for inspiration on the digit span task