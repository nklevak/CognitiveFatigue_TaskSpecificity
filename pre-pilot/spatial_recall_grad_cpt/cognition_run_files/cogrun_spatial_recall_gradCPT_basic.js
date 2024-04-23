var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }, 
});

// spatial recall file
// Define instructions
// this function sets up the timing of each trial. It will start with the max duration for the first group of 5. Then for every subsequent group it will sample from prev_group - 100 +/- 50.
function getGridParams(num_trials,max_tile_duration) {
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

var gen_instructions = {
  type: jsPsychInstructions,
  pages: [
    "<p>In this task you will be presented with two tasks. When you're ready, click \"Next\" to get started.</p>`"
  ],
  key_forward: 'ArrowRight',
  key_backward: 'ArrowLeft',
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: 'Prev',
  button_label_next: 'Next'
};

// spatial recall instructions
var sr_instructions_01 = {
  type: jsPsychInstructions,
  pages: [
    "<p>Welcome to the first task! Click next for the instructions.</p>",
    "<p>In this game you will see a grid of squares that will flash blue one at a time.</p><p>Your goal is to remember the order in which the squares flashed blue.</p><p>At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>",
    `<p>Do your best to memorize the order, but do not write them down<br>or use any other external tool to help you remember.</p><p>If you make a mistake, click the "Clear" button to erase your entries.</p><p>When you're ready, click "Next" to get started.</p>`
  ],
  key_forward: 'ArrowRight',
  key_backward: 'ArrowLeft',
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: 'Prev',
  button_label_next: 'Next'
}

// Define forwards recall
var sr_recall_forwards = {
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
      trial_duration: 500,
    },
    {
      type: jsPsychSpatialRecall,
      grid_size: 4,
      sequence: jsPsych.timelineVariable('sequence'),
      tile_duration: jsPsych.timelineVariable('tile_duration'),
      backwards: false
    }
  ],
  timeline_variables: getGridParams(5,750)//changed from 15 for now
}

var timeline = [];

// GENERAL TASK INSTRUCTIONS
timeline.push(gen_instructions);

// SPATIAL RECALL TASK (forward span only)
timeline.push(sr_instructions_01);
timeline.push(sr_recall_forwards);

// gradCPT code:
var list_stim = ["city_1.jpg","c1_c2.gif","city_2.jpg","c2_c3.gif","city_3.jpg",
"c3_c4.gif","city_4.jpg","c4_c5.gif","city_5.jpg","c5_c6.gif","city_6.jpg","c6_m1.gif",
"mountain_1.jpg","m1_c2.gif","city_2.jpg","c2_c3.gif","city_3.jpg","c3_c4.gif","city_4.jpg",
"c4_c5.gif","city_5.jpg","c5_m1.gif","mountain_1.jpg","m1_c6.gif","city_6.jpg"]

var preload_auto = {
  type: jsPsychPreload,
  show_detailed_errors: true,
  auto_preload: true,
  message: 'Please wait while the experiment loads. This may take a few minutes.',
};

var preload_manual = {
  type: jsPsychPreload,
  show_detailed_errors: true,
  images: list_stim,
  message: 'Please wait while the experiment loads. This may take a few minutes.',
};

var welcome_cpt = {
type: jsPsychHtmlKeyboardResponse,
stimulus: "Welcome to this task. Press any key to begin."
};

var instructions_cpt = {
type: jsPsychHtmlKeyboardResponse,
stimulus: `
    <p>In this task, an image will appear in the center
    of the screen.</p><p>If the image is a <strong>city</strong>,
    press the letter q on the keyboard as fast as you can.</p>
    <p>If the image is a <strong>mountain</strong>, do not press a key.</p>
    <div style='width: 700px;'>
    <div style='float: left;'><img src='city_1.jpg'></img>
    <p class='small'><strong>Press the q key</strong></p></div>
    <div style='float: right;'><img src='mountain_1.jpg'></img>
    <p class='small'><strong>Do not press a key</strong></p></div>
    </div>
    <p>Press any key to begin.</p>
`,
post_trial_gap: 2000
};

timeline.push(preload_auto,preload_manual,welcome_cpt,instructions_cpt);

// var trials=[]
for (const fn of list_stim) {
var trial = {
  type: jsPsychImageKeyboardResponse,
  stimulus: fn,
  choices: ['q'],
  prompt: "<p>press q if it is a city</p>",
  trial_duration:700,
  response_ends_trial:false,
  render_on_canvas: false,
}
timeline.push(trial)
}

// overall task debrief
var overall_debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 
    `<p>Great work! This experiment is over now. Please press any button.</p>`
}

timeline.push(overall_debrief_block)

jsPsych.run(timeline);