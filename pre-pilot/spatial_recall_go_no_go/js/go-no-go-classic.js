// Define instructions
// this function sets up the timing of each trial. It will start with the max duration for the first group of 5. Then for every subsequent group it will sample from prev_group - 100 +/- 50.
// function getGridParams(num_trials,max_tile_duration) {
//     // the number of trials i want to group together
//     var num_trial_per_group = 5;
//     // the difference in mean time I want per group
//     var mean_time_diff = 100;
//     // Initialize an array to hold the duration of each trial
//     var trialDurations = [];
//     // Calculate the number of full groups of 5 and the remainder
//     var fullGroups = Math.floor(num_trials / num_trial_per_group);
//     var remainder = num_trials % num_trial_per_group;
//     // Initialize the current duration to the max duration
//     var currentDuration = max_tile_duration;
//     // Process full groups
//     for (let i = 0; i < fullGroups; i++) {
//         // make first group anywhere in the range of (the max time - 50)
//         if (i == 0) {
//           for (let j = 0; j < num_trial_per_group; j++) {
//             trialDurations.push(Math.max(0, currentDuration - Math.floor(Math.random() * (mean_time_diff / 2))))
//           }
//           currentDuration = currentDuration - mean_time_diff
//           continue;
//         }
//         // make each following groups anywhere in +50 or -50 of the previous max time - 100
//         let min = 0
//         if (((currentDuration - (mean_time_diff / 2)) >= 0)) {
//           min = currentDuration - (mean_time_diff / 2)
//         }
//         // adding the +1 makes it inclusive
//         for (let j = 0; j < num_trial_per_group; j++) {
//           trialDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min))
//         }
//         // update the new current duration (mean duration) for the next group
//         currentDuration = currentDuration - mean_time_diff
//       }
//     // Process any remaining trials and give them all the final value
//     let min = 0
//     if (((currentDuration - (mean_time_diff / 2)) >= 0)) {
//       min = currentDuration - (mean_time_diff / 2)
//     }
//     for (let i = 0; i < remainder; i++) {
//         trialDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min));
//     }
  
//     // go through the trial durations and return the timeline vals
//     let timeline_full_vals = []
//     trialDurations.forEach((item, _) => {
//       timeline_full_vals.push({
//           sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], 4),
//           tile_duration: item
//       });
//     });
//     return timeline_full_vals
//   }

// preload the stimuli for the go no go
var preload = {
    type: jsPsychPreload,
    images: ['img/blue.png', 'img/orange.png'],
    auto_preload: true
};

var gng_transition = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "You will now do a new task. Press any key to begin."
  };

var gng_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>In this task, a circle will appear in the center
        of the screen.</p><p>If the circle is <strong>blue</strong>,
        press the letter F on the keyboard as fast as you can.</p>
        <p>If the circle is <strong>orange</strong>, do not press a key.</p>
        <div style='width: 700px;'>
        <div style='float: left;'><img src='img/blue.png'></img>
        <p class='small'><strong>Press the F key</strong></p></div>
        <div style='float: right;'><img src='img/orange.png'></img>
        <p class='small'><strong>Do not press a key</strong></p></div>
        </div>
        <p>Press any key to begin.</p>
    `,
    post_trial_gap: 2000
};

 /* define trial stimuli array for timeline variables */
 var gng_test_stimuli = [
    { stimulus: "img/blue.png",  correct_response: 'f'},
    { stimulus: "img/orange.png",  correct_response: null}
  ];

   /* define fixation and test trials */
 var gng_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: function(){
      return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
    },
    data: {
      task: 'fixation'
    }
  };

  var gng_single_trial = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['f'],
    data: {
      task: 'response',
      correct_response: jsPsych.timelineVariable('correct_response')
    },
    trial_duration: function(){
      return jsPsych.randomization.sampleWithoutReplacement([3000, 2000], 1)[0];
    },
    on_finish: function(data){
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
  };
  
  /* define test procedure */
  var gng_trials = {
    timeline: [gng_fixation, gng_single_trial],
    timeline_variables: gng_test_stimuli,
    repetitions: 3,
    randomize_order: true
  };

  /* define debrief */
var gng_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
  
      var trials = jsPsych.data.get().filter({task: 'response'});
      var correct_trials = trials.filter({correct: true});
      var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
      var rt = Math.round(correct_trials.select('rt').mean());
  
      return `<p>You responded correctly on ${accuracy}% of the trials.</p>
        <p>Your average response time was ${rt}ms.</p>
        <p>Press any key to complete the experiment. Thank you!</p>`;
  
    }
  };

//   // Define forwards recall
//   var recall_forwards = {
//     timeline: [
//       {
//         type: jsPsychScreenCheck,
//         min_width: 258,
//         min_height: 364
//       },
//       {
//         type: jsPsychHtmlKeyboardResponse,
//         stimulus: '<p style="font-size: 48px;">+</p>',
//         choices: 'NO_KEYS',
//         trial_duration: 1200,
//       },
//       {
//         type: jsPsychSpatialRecall,
//         grid_size: 4,
//         sequence: jsPsych.timelineVariable('sequence'),
//         tile_duration: jsPsych.timelineVariable('tile_duration'),
//         backwards: false
//       }
//     ],
//     timeline_variables: getGridParams(4,600)
//   }