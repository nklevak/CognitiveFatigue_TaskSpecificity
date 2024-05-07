// EXPERIMENT SET UP VARIABLES
var sr_trials_per_block = 2
var sr_practice_trial_num = 2
var consistent_tile_duration = 300
var grid_size_constant = 4
var digits_to_mem = 5

///////////////////////////////////////////////////////////////
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
        sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], digits_to_mem),
        tile_duration: item
    });
  });
  return timeline_full_vals
}

// PRACTICE SESSION
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
      trial_duration: 400,
    },
    {
      type: jsPsychSpatialRecall,
      grid_size: grid_size_constant,
      sequence: jsPsych.timelineVariable('sequence'),
      tile_duration: jsPsych.timelineVariable('tile_duration'),
      backwards: false,
      on_finish: function(data){
        data.practice = "true"
        data.game_type = "spatial_recall"
      }
    },
    {
      type: jsPsychHtmlKeyboardResponse,
      trial_duration: 1000,
      stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].score_an;
        if(last_trial_correct){
          return "<p>Correct!</p>"; // the parameter value has to be returned from the function
        } else {
          return "<p>Incorrect! Please try to focus on the order in which the squares appear.</p>"; // the parameter value has to be returned from the function
        }
      }
    }
  ],
  timeline_variables: getGridParams(sr_practice_trial_num,consistent_tile_duration,false)
}

// MAIN EXPERIMENT GET BLOCK TRIALS FUNCTION
function sr_getBlock() {
  var timeline_sr_block = []

  for (i=0; i < sr_trials_per_block; i++){
    var screenCheck={
      type: jsPsychScreenCheck,
      min_width: 258,
      min_height: 364
    }
  
    var response_key = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size: 48px;">+</p>',
      choices: 'NO_KEYS',
      trial_duration: 400,
    }
  
    var recall_sr = {
      type: jsPsychSpatialRecall,
      grid_size: grid_size_constant,
      sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], digits_to_mem),
      tile_duration: consistent_tile_duration,
      backwards: false,
      on_start: function(recall_sr) {
        recall_sr.sequence = jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], digits_to_mem)
        console.log(recall_sr.sequence)
      },
      on_finish: function(data){
        data.practice = "false"
        data.game_type = "spatial_recall"
      }
    }

    timeline_sr_block.push(screenCheck,response_key,recall_sr)
  }

  return timeline_sr_block
}
