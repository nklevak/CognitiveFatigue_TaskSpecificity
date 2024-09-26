//---------------------------------------//
// Define parameters.
//---------------------------------------//

// Define response parameters.
const valid_responses = ['1', '2', '3'];

// Define block length.
const block_length = 30000;
const rest_chunk_length = 10000;
//---------------------------------------//
// Define images for preloading.
//---------------------------------------//

// Initialize images for preloading.
var img_files = jsPsych.randomization.shuffle([
  './img/circle.png',
  './img/diamond.png',
  './img/square.png'
]);

// Randomize image arrays.
const arrays = jsPsych.randomization.shuffle([
  jsPsych.randomization.shuffle(['./img/circle.png','./img/diamond.png','./img/square.png']),
  jsPsych.randomization.shuffle(['./img/circle.png','./img/diamond.png','./img/square.png']),
  jsPsych.randomization.shuffle(['./img/circle.png','./img/diamond.png','./img/square.png']),
]);

// Concatenate image arrays.
img_files = [].concat.apply(img_files, arrays);

//---------------------------------------//
// Define instructions.
//---------------------------------------//

var rt_instructions_01 = {
  type: jsPsychDsstInstructions,
  pages: [
    "<p>In this task, you will see a series of symbols.<br>Each symbol is paired with a number (top row).</p>",
    "<p>When you see a symbol pop up, your task is to enter its<br>number using the 1,2,3 keys on your keyboard.</p>",
    `<p>Now let's practice a couple of trials.<br>Press the "Next" button when you're ready to start.</p>`
  ],
  stimuli: img_files.slice(0,3),
  target: 0,
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next"
}

var rt_practice = {
  timeline: [{
    type: jsPsychDsst,
    stimuli: img_files.slice(0,3),
    target: jsPsych.timelineVariable('target'),
    valid_responses: jsPsych.timelineVariable('valid_responses')
  }],
  timeline_variables: [
    {target: 0, valid_responses: valid_responses[0]},
    {target: 0, valid_responses: valid_responses[0]},
    {target: 0, valid_responses: valid_responses[0]},
    {target: 0, valid_responses: valid_responses[0]},
    {target: 1, valid_responses: valid_responses[1]},
    {target: 1, valid_responses: valid_responses[1]},
    {target: 1, valid_responses: valid_responses[1]},
    {target: 1, valid_responses: valid_responses[1]},
    {target: 2, valid_responses: valid_responses[2]},
    {target: 2, valid_responses: valid_responses[2]},
    {target: 2, valid_responses: valid_responses[2]},
    {target: 2, valid_responses: valid_responses[2]}
  ],
  randomize_order: true
}

var rt_instructions = {
  type: jsPsychInstructions,
  pages: [
    `<p>Great job! Now we will get stared with the rest period.</p><p>Please continually complete the trials in order for your rest to count.</p><p>The first 10 seconds of rest are free; after that, you will be asked every 10 seconds if you would like to continue your rest block. When you are ready to stop resting, say "no" to continuing.</p>`
  ],
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
  on_finish: function(data) {
    // Define block 1 start time.
    // Note: if this is deleted, the entire task will break.
    rest_start = data.time_elapsed;
  }
}

//---------------------------------------//
// Define DSST blocks.
//---------------------------------------//

// make a rest block that can last from 10 seconds, up to 1 minute
var rest_start = null;
// var rest_2_start = null;
// var rest_3_start = null;
// var rest_4_start = null;
// var rest_5_start = null;
// var rest_6_start = null;

var rt_1 = [];

repeatShuffles([0,0,0,1,1,1,2,2,2], 25).forEach(k => {

    // Define single trial.
    const trial = {
      type: jsPsychDsst,
      stimuli: img_files.slice(3,6),
      target: k,
      valid_responses: valid_responses[k],
      data: {block: 1,
        rest_start_time: rest_start,
      }
    }
  
    // Define trial node.
    const trial_node = {
      timeline: [trial],
      conditional_function: function() {
  
        // Get data from most recent trial.
        [data] = jsPsych.data.get().last(1).values();
  
        // Check if time limit has been exceeded.
        if (data.time_elapsed - rest_start >= rest_chunk_length) {
          return false;
        } else {
          return true;
        }
  
      }
    }
  
    // Append trial.
    rt_1.push(trial_node)
  });


// Define Block 1.
var rt_2 = [];
repeatShuffles([0,0,0,1,1,1,2,2,2], 25).forEach(k => {

  // Define single trial.
  const trial = {
    type: jsPsychDsst,
    stimuli: img_files.slice(6,9),
    target: k,
    valid_responses: valid_responses[k],
    data: {block: 2,
        rest_start_time: rest_start,
    }
  }

  // Define trial node.
  const trial_node = {
    timeline: [trial],
    conditional_function: function() {

      // Get data from most recent trial.
      [data] = jsPsych.data.get().last(1).values();

      // Check if time limit has been exceeded.
      if (data.time_elapsed - rest_start >= rest_chunk_length) {
        return false;
      } else {
        return true;
      }

    }
  }

  // Append trial.
  rt_2.push(trial_node)
});

// Define Block 1.
var rt_3 = [];
repeatShuffles([0,0,0,1,1,1,2,2,2], 25).forEach(k => {

  // Define single trial.
  const trial = {
    type: jsPsychDsst,
    stimuli: img_files.slice(9,12),
    target: k,
    valid_responses: valid_responses[k],
    data: {block: 3,
        rest_start_time: rest_start,
    }
  }

  // Define trial node.
  const trial_node = {
    timeline: [trial],
    conditional_function: function() {

      // Get data from most recent trial.
      [data] = jsPsych.data.get().last(1).values();

      // Check if time limit has been exceeded.
      if (data.time_elapsed - rest_start >= block_length) {
        return false;
      } else {
        return true;
      }

    }
  }

  // Append trial.
  rt_3.push(trial_node)
});

// Define Block 1.
var rt_4 = [];
repeatShuffles([0,0,0,1,1,1,2,2,2], 25).forEach(k => {

  // Define single trial.
  const trial = {
    type: jsPsychDsst,
    stimuli: img_files.slice(6,9),
    target: k,
    valid_responses: valid_responses[k],
    data: {block: 2,
        rest_start_time: rest_start,
    }
  }

  // Define trial node.
  const trial_node = {
    timeline: [trial],
    conditional_function: function() {

      // Get data from most recent trial.
      [data] = jsPsych.data.get().last(1).values();

      // Check if time limit has been exceeded.
      if (data.time_elapsed - rest_start >= rest_chunk_length) {
        return false;
      } else {
        return true;
      }

    }
  }

  // Append trial.
  rt_4.push(trial_node)
});

// Define Block 1.
var rt_5 = [];
repeatShuffles([0,0,0,1,1,1,2,2,2], 25).forEach(k => {

  // Define single trial.
  const trial = {
    type: jsPsychDsst,
    stimuli: img_files.slice(6,9),
    target: k,
    valid_responses: valid_responses[k],
    data: {block: 2,
        rest_start_time: rest_start,
    }
  }

  // Define trial node.
  const trial_node = {
    timeline: [trial],
    conditional_function: function() {

      // Get data from most recent trial.
      [data] = jsPsych.data.get().last(1).values();

      // Check if time limit has been exceeded.
      if (data.time_elapsed - rest_start >= rest_chunk_length) {
        return false;
      } else {
        return true;
      }

    }
  }

  // Append trial.
  rt_5.push(trial_node)
});

// Define Block 1.
var rt_6 = [];
repeatShuffles([0,0,0,1,1,1,2,2,2], 25).forEach(k => {

  // Define single trial.
  const trial = {
    type: jsPsychDsst,
    stimuli: img_files.slice(6,9),
    target: k,
    valid_responses: valid_responses[k],
    data: {block: 2,
        rest_start_time: rest_start,
    }
  }

  // Define trial node.
  const trial_node = {
    timeline: [trial],
    conditional_function: function() {

      // Get data from most recent trial.
      [data] = jsPsych.data.get().last(1).values();

      // Check if time limit has been exceeded.
      if (data.time_elapsed - rest_start >= rest_chunk_length) {
        return false;
      } else {
        return true;
      }

    }
  }

  // Append trial.
  rt_6.push(trial_node)
});

//---------------------------------------//
// Define transition screens.
//---------------------------------------//

let response, rt;
var extend_rest = false;
var continue_to_task = false;
var num_rest_chunks = 1;
var PAUSE_01_04 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Press "Extend Rest" if you want to exchange points to extend rest. If not, press "continue to games".</p>',
    choices: ['Extend Rest', 'Continue to games'],
    prompt: "<p>What do you want to do? Choose fast or you will leave rest. </p>",
    trial_duration: 2000,// will record as null if no response by then
    on_load: function () {
        // Remove the default event listeners on the buttons
        let btn_group = document.querySelector('#jspsych-html-button-response-btngroup');
        btn_group.innerHTML = btn_group.innerHTML;

        response = [];
        rt = [];

        let start_time = performance.now();

        for (let button of document.querySelectorAll('button')) {
            button.addEventListener('click', function (e) {
                let val = e.target.innerHTML;
                response.push(val);

                if (val == 'Extend Rest') {
                    extend_rest = true
                    response.push("extended");
                    // (rt_liked = performance.now() - start_time), response;
                    rt.push(performance.now() - start_time);
                }

                if (val !== 'Extend Rest') {
                    extend_rest = false
                    response.push("ended")
                    // (rt_skip = performance.now() - start_time), response;
                    rt.push(performance.now() - start_time);
                    jsPsych.finishTrial({rt: rt, response: response});
                }
            });
        }
    },
    on_finish: function (data) {
        data.response = response;
        data.rt = rt;
        data.num_rest_chunks = num_rest_chunks;
        data.extend_rest = extend_rest;

        // this means they chose to extend
        if (extend_rest == true) {
            num_rest_chunks += 1;
            continue_to_task = false

            rest_start = data.time_elapsed
        } else {
            continue_to_task = true

            // reset other variables
            extend_rest = false
            num_rest_chunks = 1
            rest_start = null
        }
    }
  };
  var FINISHED = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p>You have now left rest! Back to the game.</p>',
    trial_duration: 500,
  }

//---------------------------------------//
// Define utility functions.
//---------------------------------------//

// Convenience function to generate concatenated array of arrays,
// where base array is iteratively shuffled.
function repeatShuffles(arr, n) {

  // Preallocate space
  var arrays = []

  // Iteratively append shuffled array.
  for (let i = 0; i < n; i++) {
    arrays.push(jsPsych.randomization.shuffle(arr));
  }

  // Return flattened array.
  return [].concat.apply([], arrays)
}