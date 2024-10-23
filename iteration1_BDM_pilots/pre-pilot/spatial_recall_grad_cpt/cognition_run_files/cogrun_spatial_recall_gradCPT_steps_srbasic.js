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
    timeline_variables: getGridParams(2,750)//changed from 15 for now
  }
  
var timeline = [];

// GENERAL TASK INSTRUCTIONS
timeline.push(gen_instructions);

// SPATIAL RECALL TASK (forward span only)
timeline.push(sr_instructions_01);
timeline.push(sr_recall_forwards);

// gradCPT code:
var all_stim = ["city_1.jpg","city_2.jpg","city_3.jpg","city_4.jpg", "city_5.jpg","city_6.jpg","mountain_1.jpg",
"c1_c2.gif","c1_c3.gif","c1_c4.gif","c1_c5.gif","c1_c6.gif","c1_m1.gif","c2_c1.gif","c2_c3.gif","c2_c4.gif","c2_c5.gif","c2_c6.gif",
"c2_m1.gif","c3_c1.gif","c3_c2.gif","c3_c4.gif","c3_c5.gif","c3_c6.gif",
"c3_m1.gif","c4_c1.gif","c4_c2.gif","c4_c3.gif","c4_c5.gif","c4_c6.gif",
"c4_m1.gif","c5_c1.gif","c5_c2.gif","c5_c3.gif","c5_c4.gif","c5_c6.gif",
"c5_m1.gif","c6_c1.gif","c6_c2.gif","c6_c3.gif","c6_c4.gif","c6_c5.gif",
"c6_m1.gif","m1_c1.gif","m1_c2.gif","m1_c3.gif","m1_c4.gif","m1_c5.gif"]

let duration_levels_dict = {
    1: 700,2: 680,3: 660,4: 640,5: 620,6: 600,7: 580,8: 560,9: 540,10: 520,11: 500,
}

let stim_dict = {
    '1': 'city_1.jpg','2': 'city_2.jpg','3': 'city_3.jpg','4': 'city_4.jpg','5': 'city_5.jpg','6': 'city_6.jpg',
    '0': 'mountain_1.jpg', '1-0': 'c1_m1.gif','1-2': 'c1_c2.gif','1-3': 'c1_c3.gif','1-4': 'c1_c4.gif','1-5': 'c1_c5.gif',
    '1-6': 'c1_c6.gif','2-0': 'c2_m1.gif','2-1': 'c2_c1.gif','2-3': 'c2_c3.gif','2-4': 'c2_c4.gif','2-5': 'c2_c5.gif',
    '2-6': 'c2_c6.gif','3-0': 'c3_m1.gif','3-1': 'c3_c1.gif','3-2': 'c3_c2.gif','3-4': 'c3_c4.gif',
    '3-5': 'c3_c5.gif','3-6': 'c3_c6.gif','4-0': 'c4_m1.gif','4-1': 'c4_c1.gif','4-2': 'c4_c2.gif',
    '4-3': 'c4_c3.gif', '4-5': 'c4_c5.gif','4-6': 'c4_c6.gif','5-0': 'c5_m1.gif','5-1': 'c5_c1.gif',
    '5-2': 'c5_c2.gif','5-3': 'c5_c3.gif','5-4': 'c5_c4.gif','5-6': 'c5_c6.gif', '6-0': 'c2_m1.gif',
    '6-1': 'c6_c1.gif','6-2': 'c6_c2.gif', '6-3': 'c6_c3.gif','6-4': 'c6_c4.gif','6-5': 'c6_c5.gif',
    '0-1': 'm1_c1.gif','0-2': 'm1_c2.gif','0-3': 'm1_c3.gif','0-4': 'm1_c4.gif','0-5': 'm1_c5.gif',
    '0-6': 'm1_c6.gif'
};

var random_stimulus_list = function(num_trials) {
    var prev_trial_index = -1
    let key_stim_list = []
    let final_stim_list = []

    // get the keys with the fillers
    for (let i = 0; i < num_trials; i++) {
        let randomNumber = Math.floor(Math.random() * 10); // Generates a number between 0 and 9

        // prev_trial_index = -1 means this is the first round, so for i = 0, there is just the original picture
        if (prev_trial_index == -1) {
            if (randomNumber == 0) {
                key_stim_list.push(randomNumber.toString()) // starts with mountain
            }
            else { // starts with a city picture
                randomNumber = Math.floor(Math.random() * 6) + 1
                key_stim_list.push(randomNumber.toString()) // number between 1 and 6
            }
            prev_trial_index = randomNumber // update previous trial
            continue
        }

        // for all other rounds, we add the transition from the previous image first, then the new image
        if (randomNumber == 0 && prev_trial_index != 0) { // same trial can't happen in a row
            key_stim_list.push(prev_trial_index + '-' + randomNumber) // add transition to this image
            key_stim_list.push(randomNumber.toString()) // add this image
            prev_trial_index = randomNumber
        } else { 
            if (prev_trial_index == 0) { // if the prior trial was 0 and we get 0 again, we have to give it a num 1 to 6 instead
                randomNumber = Math.floor(Math.random() * 6) + 1 
            } else {
                randomNumber = Math.floor(Math.random() * 5) + 1 
                if (randomNumber >= prev_trial_index) { // random number is 1-6 now (but will not be = to prev trial)
                    randomNumber++;
                }
            }
            key_stim_list.push(prev_trial_index + "-" + randomNumber) // transition to this image
            key_stim_list.push(randomNumber.toString()) // number between 1 and 6 (excluding prev trial), add this image
            prev_trial_index = randomNumber
        }
    }

    // transform the keys into image files
    for (const key of key_stim_list) {
        final_stim_list.push("./img950/" + stim_dict[key])
    }
    return final_stim_list;
};

// PRELOADING AND INSTRUCTIONS
var preload_stim = []
var path_to_img = "./img950/"
for (let i = 0; i < all_stim.length; i++) {
    preload_stim.push(path_to_img + all_stim[i]);
}

var preload_auto = {
    type: jsPsychPreload,
    show_detailed_errors: true,
    auto_preload: true,
    message: 'Please wait while the experiment loads. This may take a few minutes.',
};

var preload_manual = {
    type: jsPsychPreload,
    show_detailed_errors: true,
    images: preload_stim,
    message: 'Please wait while the experiment loads. This may take a few minutes.',
};

// welcome and instructions
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
    <div style='float: left;'><img src='./img950/city_1.jpg'></img>
    <p class='small'><strong>Press the q key</strong></p></div>
    <div style='float: right;'><img src='./img950/mountain_1.jpg'></img>
    <p class='small'><strong>Do not press a key</strong></p></div>
    </div>
    <p>Press any key to begin.</p>
`,
post_trial_gap: 2000
};

// post-task debrief
var overall_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 
      `<p>Great work! This experiment is over now. Please press any button.</p>`
}

// TRIAL SET UP
var totalTrials = 40
var final_list = []

var curr_trial_duration_level = 1
let max_dur = 11
let min_dur = 1

// each "trial round" is the image being shown, and the following transition
var getTrials = function(){
    final_list = random_stimulus_list(totalTrials)

    var trials = []
    for (let i = 0; i < final_list.length - 1; i = i + 2) {
        // get each stimuli
        var img_stim = final_list[i]
        var transition_stim = final_list[i + 1]

        // define correct values for give stimuli
        var img_stim_type = "go"
        var transition_stim_type = "go"
        var img_correct_key = "q"
        var transition_correct_key = "q"

        if (img_stim.includes("mountain")){
            img_stim_type = "no-go"
            img_correct_key = null
        }
        if (transition_stim.split('/')[2].split('_')[1].includes("m")){
            transition_stim_type = "no-go"
            transition_correct_key = null
        }

        // add image trials
        var trial_img = {
            type: jsPsychImageKeyboardResponse,
            stimulus: img_stim,
            choices: ['q'],
            data: {
                stimulus_type: img_stim_type,
                correct_key: img_correct_key,
                trial_number: i,
            },
            prompt: "<p>press q if it is a city</p>",
            // fix the step function so that if the transition was correct, it doesn't mean this specific image gets harder
            trial_duration: function(i){
                if (i == 0) { // this is the first round
                    return duration_levels_dict[curr_trial_duration_level]
                } else {
                    // change based on last full image, not based on transition
                    prev_correct = jsPsych.data.get().last(2).values()[0].correct;
                    if (prev_correct) {
                        curr_trial_duration_level = curr_trial_duration_level + 1
                        if (curr_trial_duration_level <= max_dur) {
                            return duration_levels_dict[curr_trial_duration_level]
                        } else {
                            curr_trial_duration_level = max_dur
                            return duration_levels_dict[curr_trial_duration_level]
                        }
                    } else {
                        curr_trial_duration_level = curr_trial_duration_level - 1
                        if (curr_trial_duration_level >= min_dur) {
                            return duration_levels_dict[curr_trial_duration_level]
                        } else {
                            curr_trial_duration_level = min_dur
                            return duration_levels_dict[curr_trial_duration_level]
                        }
                    }
                }
            },
            response_ends_trial:false,
            render_on_canvas: false,
            on_finish: function(data){
                // first check if they got it correct during the previous transition trial
                var prev_correct = false
                if (i != 0) {// if this is the first trial, then there is no previous transition trial
                    prev_correct = jsPsych.data.get().last(2).values()[0].correct
                }
                // Score the response as correct or incorrect.
                if(jsPsych.pluginAPI.compareKeys(data.response, data.correct_key)){
                  data.correct = true;
                } else {
                  if (prev_correct){// if the transition was correct then it seeps onto the image trial
                    // unless its a mountain trial, then if they're wrong in image trial they're wrong
                    if (data.stimulus_type == "no-go") {
                        data.correct = false;
                    } else {
                        data.correct = true;
                    }
                  } else {
                    data.correct = false; 
                  }
                }
                data.curr_level = curr_trial_duration_level
                data.curr_trial_duration = duration_levels_dict[curr_trial_duration_level]
            }
        };

        // add transition trials
        var trial_transition = {
            type: jsPsychImageKeyboardResponse,
            stimulus: transition_stim,
            choices: ['q'],
            data: {
                stimulus_type: transition_stim_type,
                correct_key: transition_correct_key,
                curr_level: 1,
                curr_trial_duration: duration_levels_dict[1],
                trial_number: i+1,
            },
            prompt: "<p>press q if it is a city</p>",
            trial_duration:duration_levels_dict[1],
            response_ends_trial:false,
            render_on_canvas: false,
            on_finish: function(data){
                // Score the response as correct or incorrect.
                if(jsPsych.pluginAPI.compareKeys(data.response, data.correct_key)){
                  data.correct = true;
                } else {
                  data.correct = false; 
                }
            }
        };

        trials.push(trial_img)
        trials.push(trial_transition)
    }
    return trials
}

var gradcpt_trials = {
    timeline: getTrials()
}

timeline.push(preload_auto,preload_manual,welcome_cpt,instructions_cpt);
timeline.push(gradcpt_trials)
timeline.push(overall_debrief_block)

jsPsych.run(timeline);