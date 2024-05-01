// BLOCK VARIABLES
var sr_trials_per_block = 2

////// SET UP GRID DIFFICULTY TO BE MAX_TILE_DURATION & CREATE num_trials TRIALS
// this function sets up the timing of each trial. 
// IF CHANGE_DIFFICULTY = TRUE: It will start with the max duration for the first group of 5. Then for every subsequent group it will sample from prev_group - 100 +/- 50.
// IF CHANGE_DIFFICULTY = FALSE (default): it will give every trial the given max_tile_duration
function getGridParams(num_trials,max_tile_duration,change_difficulty=false) {
  // the number of trials i want to group together
  var num_trial_per_group = 5;
  // the difference in mean time I want per group
  var mean_time_diff = 100;
  // Initialize an array to hold the duration of each trial
  var trialDurations = [];
  // Calculate the number of full groups of 5 and the remainder
  var fullGroups = Math.floor(num_trials / num_trial_per_group);
  var remainder = num_trials % num_trial_per_group;
  // Initialize the current duration to the max duration
  var currentDuration = max_tile_duration;

  if (change_difficulty) {
    // Process full groups
    for (let i = 0; i < fullGroups; i++) {
      // make first group anywhere in the range of (the max time - 50)
      if (i == 0) {
        for (let j = 0; j < num_trial_per_group; j++) {
          trialDurations.push(Math.max(0, currentDuration - Math.floor(Math.random() * (mean_time_diff / 2))))
        }
        currentDuration = currentDuration - mean_time_diff
        continue;
      }
      // make each following groups anywhere in +50 or -50 of the previous max time - 100
      let min = 0
      if (((currentDuration - (mean_time_diff / 2)) >= 0)) {
        min = currentDuration - (mean_time_diff / 2)
      }
      // adding the +1 makes it inclusive
      for (let j = 0; j < num_trial_per_group; j++) {
        trialDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min))
      }
      // update the new current duration (mean duration) for the next group
      currentDuration = currentDuration - mean_time_diff
    }
    // Process any remaining trials and give them all the final value
    let min = 0
    if (((currentDuration - (mean_time_diff / 2)) >= 0)) {
    min = currentDuration - (mean_time_diff / 2)
    }
    for (let i = 0; i < remainder; i++) {
      trialDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min));
    }
  } else {
    for (i=0;i < num_trials;i++) {
      trialDurations.push(max_tile_duration)
    }
  }

  // go through the trial durations and return the timeline vals
  let timeline_full_vals = []
  trialDurations.forEach((item, _) => {
    timeline_full_vals.push({
        sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], 4),
        tile_duration: item
    });
  });
  return timeline_full_vals
}

var consistent_tile_duration = 300
// Define forwards recall for the practice session
var sr_recall_forwards_practice = {
  timeline: [
    {
      type: jsPsychScreenCheck,
      min_width: 258,
      min_height: 364
    },
    {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size: 48px;">+</p>',
      choices: 'NO_KEYS',
      trial_duration: 1200,
    },
    {
      type: jsPsychSpatialRecall,
      grid_size: 4,
      sequence: jsPsych.timelineVariable('sequence'),
      tile_duration: jsPsych.timelineVariable('tile_duration'),
      backwards: false
    }
  ],
  timeline_variables: getGridParams(4,consistent_tile_duration,false)
}

function sr_getBlock() {
  var timeline_sr_block = []

  var screenCheck={
    type: jsPsychScreenCheck,
    min_width: 258,
    min_height: 364
  }

  var response_key = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p style="font-size: 48px;">+</p>',
    choices: 'NO_KEYS',
    trial_duration: 1200,
  }

  var recall_sr = {
    type: jsPsychSpatialRecall,
    grid_size: 4,
    sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], 4),
    tile_duration: consistent_tile_duration,
    backwards: false
  }

  for (i=0; i < sr_trials_per_block; i++){
    timeline_sr_block.push(screenCheck,response_key,recall_sr)
  }

  return timeline_sr_block
}
