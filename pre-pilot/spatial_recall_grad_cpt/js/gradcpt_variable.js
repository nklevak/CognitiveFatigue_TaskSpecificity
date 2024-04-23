// EVERYTHING THAT WE WANT TO PRE-LOAD
var all_stim = ["city_1.jpg","city_2.jpg","city_3.jpg","city_4.jpg", "city_5.jpg","city_6.jpg","mountain_1.jpg",
"c1_c2.gif","c1_c3.gif","c1_c4.gif","c1_c5.gif","c1_c6.gif","c1_m1.gif","c2_c1.gif","c2_c3.gif","c2_c4.gif","c2_c5.gif","c2_c6.gif",
"c2_m1.gif","c3_c1.gif","c3_c2.gif","c3_c4.gif","c3_c5.gif","c3_c6.gif",
"c3_m1.gif","c4_c1.gif","c4_c2.gif","c4_c3.gif","c4_c5.gif","c4_c6.gif",
"c4_m1.gif","c5_c1.gif","c5_c2.gif","c5_c3.gif","c5_c4.gif","c5_c6.gif",
"c5_m1.gif","c6_c1.gif","c6_c2.gif","c6_c3.gif","c6_c4.gif","c6_c5.gif",
"c6_m1.gif","m1_c1.gif","m1_c2.gif","m1_c3.gif","m1_c4.gif","m1_c5.gif"]

var list_stim_temp = ["city_1.jpg","c1_c2.gif","city_2.jpg","c2_c3.gif","city_3.jpg",
"c3_c4.gif","city_4.jpg","c4_c5.gif","city_5.jpg","c5_c6.gif","city_6.jpg","c6_m1.gif",
"mountain_1.jpg","m1_c2.gif","city_2.jpg","c2_c3.gif","city_3.jpg","c3_c4.gif","city_4.jpg",
"c4_c5.gif","city_5.jpg","c5_m1.gif","mountain_1.jpg","m1_c6.gif","city_6.jpg"]

// preloading 
var preload_stim = []
var path_to_img = "./img/"
for (let i = 0; i < all_stim.length; i++) {
    preload_stim.push(path_to_img + all_stim[i]);
}
var list_stim = []
for (let i = 0; i < list_stim_temp.length; i++) {
    list_stim.push(path_to_img + list_stim_temp[i]);
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
    <div style='float: left;'><img src='./img/city_1.jpg'></img>
    <p class='small'><strong>Press the q key</strong></p></div>
    <div style='float: right;'><img src='./img/mountain_1.jpg'></img>
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
var currentTrial = 0
var final_list = []
var prev_trial_duration_level = 1
let max_dur = 11
let min_dur = 1

let duration_levels_dict = {
    1: 700,
    2: 680,
    3: 660,
    4: 640,
    5: 620,
    6: 600,
    7: 580,
    8: 560,
    9: 540,
    10: 520,
    11: 500,
}

// 1. function that randomly generates stimuli (should be 40 rounds for now, where mountain has a 0.1 chance and a city has a 0.9 chance)
// this function should, for each round, get an image stimuli and then its corresponding transition gif
// so, it should randomly generate 40 of the images and then insert each transition gif into the final list

let stim_dict = {
    '1': 'city_1.jpg',
    '2': 'city_2.jpg',
    '3': 'city_3.jpg',
    '4': 'city_4.jpg',
    '5': 'city_5.jpg',
    '6': 'city_6.jpg',
    '0': 'mountain_1.jpg',
    '1-0': 'c1_m1.gif',
    '1-2': 'c1_c2.gif',
    '1-3': 'c1_c3.gif',
    '1-4': 'c1_c4.gif',
    '1-5': 'c1_c5.gif',
    '1-6': 'c1_c6.gif',
    '2-0': 'c2_m1.gif',
    '2-1': 'c2_c1.gif',
    '2-3': 'c2_c3.gif',
    '2-4': 'c2_c4.gif',
    '2-5': 'c2_c5.gif',
    '2-6': 'c2_c6.gif',
    '3-0': 'c3_m1.gif',
    '3-1': 'c3_c1.gif',
    '3-2': 'c3_c2.gif',
    '3-4': 'c3_c4.gif',
    '3-5': 'c3_c5.gif',
    '3-6': 'c3_c6.gif',
    '4-0': 'c4_m1.gif',
    '4-1': 'c4_c1.gif',
    '4-2': 'c4_c2.gif',
    '4-3': 'c4_c3.gif',
    '4-5': 'c4_c5.gif',
    '4-6': 'c4_c6.gif',
    '5-0': 'c5_m1.gif',
    '5-1': 'c5_c1.gif',
    '5-2': 'c5_c2.gif',
    '5-3': 'c5_c3.gif',
    '5-4': 'c5_c4.gif',
    '5-6': 'c5_c6.gif',
    '6-0': 'c2_m1.gif',
    '6-1': 'c6_c1.gif',
    '6-2': 'c6_c2.gif',
    '6-3': 'c6_c3.gif',
    '6-4': 'c6_c4.gif',
    '6-5': 'c6_c5.gif',
    '0-1': 'm1_c1.gif',
    '0-2': 'm1_c2.gif',
    '0-3': 'm1_c3.gif',
    '0-4': 'm1_c4.gif',
    '0-5': 'm1_c5.gif',
    '0-6': 'm1_c6.gif'
};

var random_stimulus_list = function(num_trials) {
    var prev_trial_index = -1
    let key_stim_list = []
    let final_stim_list = []

    // get the keys with the fillers
    for (let i = 0; i < num_trials; i++) {
        let randomNumber = Math.floor(Math.random() * 10); // Generates a number between 0 and 9

        // that means this is the first round, so for i = 0, there is just the original picture
        if (prev_trial_index == -1) {
            if (randomNumber == 0) {
                key_stim_list.push(randomNumber.toString())
            }
            else {
                randomNumber = Math.floor(Math.random() * 6) + 1
                key_stim_list.push(randomNumber.toString()) // number between 1 and 6
            }
            prev_trial_index = randomNumber
            continue
        }

        // for all other rounds, we add the transition from the previous image first, then the new image
        if (randomNumber == 0 && prev_trial_index != 0) {
            key_stim_list.push(prev_trial_index + '-0')
            key_stim_list.push('0')
            prev_trial_index = 0
        } else { // if the prior trial was 0 and we get 0 again, we have to give it a num 1 to 6 instead
            if (prev_trial_index == 0) {
                randomNumber = Math.floor(Math.random() * 6) + 1 
            } else {
                randomNumber = Math.floor(Math.random() * 5) + 1 
                if (randomNumber >= prev_trial_index) { // random number is 1-6 now (but will not be = to prev trial)
                    randomNumber++;
                }
            }
            key_stim_list.push(prev_trial_index + "-" + randomNumber)
            key_stim_list.push(randomNumber.toString()) // number between 1 and 6 (excluding prev trial)
            prev_trial_index = randomNumber
        }
    }

    // transform the keys into image files
    for (const key of key_stim_list) {
        final_stim_list.push("./img/" + stim_dict[key])
    }

    return final_stim_list;
}

// 2. function that checks average accuracy of last 10 trials
// or should it just look at accuracy of previous trial?
// and then changes the trial_duration (this will change how long the image appears and how long the gif appears)
// should I keep the gif consistent but only change duration of image flash?
var get_duration = function(data){
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct
    if (last_trial_correct) {
        prev_trial_duration_level = prev_trial_duration_level + 1
        if (prev_trial_duration_level <= max_dur) {
            return duration_levels_dict[prev_trial_duration_level]
        }
        prev_trial_duration_level = max_dur
        return duration_levels_dict[max_dur]
    } else {
        prev_trial_duration_level = prev_trial_duration_level - 1
        if (prev_trial_duration_level >= min_dur) {
            return duration_levels_dict[prev_trial_duration_level]
        }
        prev_trial_duration_level = min_dur
        return duration_levels_dict[min_dur]
    }
}

// each "trial round" is the image being shown, and the following transition
var getTrials = function(trialnum){
    final_list = random_stimulus_list(trialnum)
    var trials = []
    for (let i = 0; i < final_list.length - 1; i = i + 2) {

        var img_stim = final_list[i]
        var transition_stim = final_list[i + 1]
        var img_stim_type = "go"
        var transition_stim_type = "go"
        var img_correct_key = "q"
        var transition_correct_key = "q"
        if (img_stim.includes("m")){
            img_stim_type = "no-go"
        }
        if (transition_stim.split('_')[1].includes("m")){
            transition_stim_type = "no-go"
        }

        var trial_img = {
            type: jsPsychImageKeyboardResponse,
            stimulus: img_stim,
            choices: ['q'],
            data: {
                stimulus_type: img_stim_type,
            },
            prompt: "<p>press q if it is a city</p>",
            trial_duration:get_duration(data),
            response_ends_trial:false,
            render_on_canvas: false,
            on_finish: function(data){
                // first check if they got it correct during the previous transition trial
                var prev_correct = false
                if (i != 0) {// if this is the first trial, then there is no previous transition trial
                    prev_correct = jsPsych.data.get().last(1).values()[0].correct
                }
                // Score the response as correct or incorrect.
                if(jsPsych.pluginAPI.compareKeys(data.response, "q")){
                  data.correct = true;
                } else {
                  data.correct = false; 
                }
            }
        };

        var trial_transition = {
            type: jsPsychImageKeyboardResponse,
            stimulus: transition_stim,
            choices: ['q'],
            data: {
                stimulus_type: transition_stim_type,
            },
            prompt: "<p>press q if it is a city</p>",
            trial_duration:get_duration(data),
            response_ends_trial:false,
            render_on_canvas: false,
        };
        trials.push(trial_img)
        trials.push(trial_transition)
    }
}
// var trials = []
// for (const fn of list_stim) {
//     var trial = {
//       type: jsPsychImageKeyboardResponse,
//       stimulus: fn,
//       choices: ['q'],
//       prompt: "<p>press q if it is a city</p>",
//       trial_duration:700,
//       response_ends_trial:false,
//       render_on_canvas: false,
//     }
//     trials.push(trial)
// }

var gradcpt_trials = {
    timeline: getTrials(totalTrials)
}
