This is the January 2025 iteration of this experiment, with self-paced rest periods. SPR = self-paced rest
The rest task and spatial recall are based off of the dsst task in the niv lab demos site
The digit span task was inspired by experiment factory digit span

This is run with JSPsych v 7.3, and hosted on cognition.run: link *here* (will insert once data is collected)

Currently: 

Game A and Game B are counterbalanced to be either spatial recall or digit span
Current ordering (18 blocks): ABABBABAABABAABABB (9 As and 9 Bs)

# Experiment Timing and Parameters Documentation
## Quick Summary
- **Total Duration**: 50.59 minutes maximum
- **Structure**: ABABBABAAB pattern (10 groups, 3 blocks per group)
- **Trials per Block**: 10 trials (both games)
- **Rest Periods**: Up to 20 trials (30 seconds) between blocks
- **Bonus Structure**: $2 base + up to $2 additional based on rest usage

## Core Parameters

### General Setup
- Group Order: ABABBABAAB
- Each Group: 3 blocks with 2 rest periods between them
- Total Groups: 10 (5 of A, 5 of B)
- Total Blocks: 30 (15 of each game)

### Task Parameters
- Digits in Digit Span: 4
- Squares in Spatial Recall: 4
- Rest Trial Length: 1.5 seconds
- Maximum Response Time: 4 seconds (both games)

### Practice Parameters
- Digit Span Practice Trials: 4
- Spatial Recall Practice Trials: 4
- Rest Practice Trials: 4

## Detailed Task Timings

### 1. Digit Span Task

#### Main Block (10 trials)
- Sequence Presentation: 1.9 seconds
  - 4 digits × (275ms display + 200ms gap)
- Response Window: 4 seconds maximum
- **Total per Block**: 59 seconds maximum
  - Calculation: 10 × (1.9s + 4s)

#### Practice Block (4 trials)
- Same timing as main block plus 1s feedback
- **Total**: 27.6 seconds maximum
  - Calculation: 4 × (1.9s + 4s + 1s)

### 2. Spatial Recall Task

#### Main Block (10 trials)
- Initial Stimulus: 100ms
- Sequence Presentation: 1.9 seconds
  - 4 squares × (275ms display + 200ms gap)
- Response Window: 4 seconds maximum
- **Total per Block**: 60 seconds maximum
  - Calculation: 10 × (2.0s + 4s)

#### Practice Block (4 trials)
- Same timing as main block plus 1s feedback
- **Total**: 28 seconds maximum
  - Calculation: 4 × (2.0s + 4s + 1s)

### 3. Rest Task

#### Main Rest Periods
- Single Trial: 1.5 seconds
  - Display: 1350ms
  - Clear Screen: 150ms
- Trials per Rest Period: 1-20 trials
- Maximum Rest Duration: 30 seconds
- Total Possible Rest Trials: 600
  - Calculation: 10 groups × 3 blocks × 20 trials

#### Practice Block
- 4 trials × 2.5 seconds (including feedback)
- **Total**: 10 seconds

## Total Time Breakdown

### Active Task Time
1. Main Experimental Blocks
   - Spatial Recall: 900 seconds (15 blocks × 60s)
   - Digit Span: 885 seconds (15 blocks × 59s)

2. Practice Blocks
   - Spatial Recall: 28 seconds
   - Digit Span: 27.6 seconds
   - Rest Task: 10 seconds

### Additional Components
- Rest Periods: 900 seconds maximum
- Transition Cues: 45 seconds (30 cues × 1.5s)
- Instructions/Debrief: 240 seconds

### Final Calculation
```
900s (rests) + 
45s (cues) + 
10s (rest practice) + 
28s (SR practice) + 
27.6s (DS practice) + 
900s (SR blocks) + 
885s (DS blocks) + 
240s (instructions) 
= 3035.6 seconds 
= 50.59 minutes
```

## Bonus Structure
- Base Bonus: $1
- Additional Bonus: Up to $2
  - Calculated as: (unused rest trials ÷ 600) × $2
- Endowment: 600 points (1 point = 1 rest trial)

# other notes:
For spatial recall, rest, and digit span:
- the timed_out value = 0 when it hasn't timed out and 1 if it has
- when this happens, the rt is set to the max response time
	- make sure to filter out whenever timed_out = 1
- for rest when time out happens the rt is null
	- timeout for rest is always 1 for last row when they selected to end rest
		- real time out = rt == null AND timeout = 1