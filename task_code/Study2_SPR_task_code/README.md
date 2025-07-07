This is the January 2025 iteration of this experiment, with self-paced rest periods. SPR = self-paced rest
The rest task is based off of the dsst task in the niv lab demos site, and the spatial recall task is using the spatial recall code from that same site.
The digit span task was inspired by experiment factory digit span.

*credit to Sam Zorowitz from jspsych-demos for most of the spatial recall code, and Experiment Factory from the Poldrack Lab for inspiration on the digit span task*

This is run with JSPsych v 7.3, and hosted on cognition.run: link https://j597u0nuzh.cognition.run

## Current Design
Game A and Game B are counterbalanced to be either spatial recall or digit span.
Current ordering: ABABBABAAB (5 As and 5 Bs)

# Experiment Timing and Parameters Documentation

## Quick Summary
- **Total Duration**: 56 minutes maximum
- **Structure**: ABABBABAAB pattern (10 groups, 3 blocks per group)
- **Trials per Block**: 10 trials (both games)
- **Rest Periods**: Up to 20 trials (30 seconds) between blocks
- **Bonus Structure**: $1 base + up to $2 additional based on rest usage

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
- Maximum Response Time: 4.2 seconds (both games)
- Transition Cue Duration: 3 seconds

### Main Task Trial Numbers (per block)
- Digit Span Trials: 10
- Spatial Recall Trials: 10
- Rest Trials: Up to 20 (self-paced)

### Practice Parameters
- Digit Span Practice Trials: 4
- Spatial Recall Practice Trials: 4
- Rest Practice Trials: 4

## Detailed Task Timings

### 1. Digit Span Task

#### Main Block (10 trials)
- Sequence Presentation: 1.9 seconds
  - 4 digits × (275ms display + 200ms gap)
- Response Window: 4.2 seconds maximum
- **Total per Block**: 61 seconds maximum
  - Calculation: 10 × (1.9s + 4.2s)

#### Practice Block (4 trials)
- Same timing as main block plus 1s feedback
- **Total**: 28.4 seconds maximum
  - Calculation: 4 × (1.9s + 4.2s + 1s)

### 2. Spatial Recall Task

#### Main Block (10 trials)
- Initial Stimulus: 100ms
- Sequence Presentation: 1.9 seconds
  - 4 squares × (275ms display + 200ms gap)
- Response Window: 4.2 seconds maximum
- **Total per Block**: 62 seconds maximum
  - Calculation: 10 × (2.0s + 4.2s)

#### Practice Block (4 trials)
- Same timing as main block plus 1s feedback
- **Total**: 28.8 seconds maximum
  - Calculation: 4 × (2.0s + 4.2s + 1s)

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
   - Spatial Recall: 930 seconds (15 blocks × 62s)
   - Digit Span: 915 seconds (15 blocks × 61s)

2. Practice Blocks
   - Spatial Recall: 28.8 seconds
   - Digit Span: 28.4 seconds
   - Rest Task: 10 seconds

### Additional Components
- Rest Periods: 900 seconds maximum
- Transition Cues: 90 seconds (30 cues × 3s)
- Instructions/Debrief: 240 seconds

### Final Calculation
900s (rests) +
90s (cues) +
10s (rest practice) +
28.8s (SR practice) +
28.4s (DS practice) +
930s (SR blocks) +
915s (DS blocks) +
240s (instructions)
= 3142.2 seconds
= 52.37 minutes

(in case instructions/survey take a long time, round up to 56 minutes)

## Bonus Structure
- Base Bonus: $1
- Additional Bonus: Up to $2
  - Calculated as: (unused rest trials ÷ 600) × $2
- Endowment: 600 points (1 point = 1 rest trial)

## Data Analysis Notes
For spatial recall, rest, and digit span:
- The timed_out value = 0 when it hasn't timed out and 1 if it has
- When this happens, the rt is set to the max response time (4200ms)
  - Make sure to filter out whenever timed_out = 1
- For rest when time out happens the rt is null
  - Timeout for rest is always 1 for last row when they selected to end rest
  - Real time out = rt == null AND timeout = 1