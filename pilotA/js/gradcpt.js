//////////////////////////////////////
// GRADCPT EXPERIMENT SET UP VARIABLES
// max number of totalTrialNum_gradcpt = practice trials + num_blocks * gradcpt_trials_per_block
var practice_trials_gradcpt_num = 20
var num_blocks = 6
var gradcpt_trials_per_block = 6
// we will generate a stimuli list for the MAX amount of trials the gradcpt might have (depending on switches, some of these will not be used)
var totalTrialNum_gradcpt = practice_trials_gradcpt_num + num_blocks*gradcpt_trials_per_block

//////////////////////////////
// STIMULI AND DURATION
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

// ORDER OF STIMULI
// this generates a random stimulus list for num_trials, with mountains appearing 10% of the time
// the num_trials inputted here should be for the entire experiment 
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
        final_stim_list.push("./img900_esterman/" + stim_dict[key])
    }
    return final_stim_list;
};

// PRELOADING
var preload_stim = []
var path_to_img = "./img900_esterman/"
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

//////////////////////////////////////////////////////////////////////////////
// DURATION MANIPULATION SECTION (for this pilot version, we do not need auto-titrating for now)
// for this verion, these variables are initialized and exist but don't really mean anything because
// adjust_duration = false
var level_for_all_trials = 2 // this is all that matters in this version since adjust_duration below is false
var curr_trial_duration_level = 1
let max_dur = 11
let min_dur = 1

// GET TRIALS FUNCTION
// each "trial round" is the image being shown, and the following transition
// pass in how many trial timeline rounds you want it to generate, and remove those from the final_list
var getTrials_gradcpt = function(num_trials_gradcpt_block){
    // array you return with the timeline objects
    var trials = []

    // calculate how many elements of the final_list we need to take off
    // for num_trials_gradcpt_block rounds, it is num_trials_gradcpt_block * 2 - 1 items of the list
    // when we splice off items from the front of the list though, it should be num_trials_gradcpt_block * 2 
    // since we won't use the final transition for anything anyways
    var num_items = num_trials_gradcpt_block * 2

    for (let i = 0; i < num_items - 1; i = i + 2) {
        // get each stimuli
        var img_stim = final_list[i]
        var transition_stim = final_list[i + 1]

        // define correct values for give stimuli
        var img_stim_type = "go"
        var transition_stim_type = "go"
        var img_correct_key = "enter"
        var transition_correct_key = "enter"

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
            choices: ['enter'],
            data: {
                stimulus_type: img_stim_type,
                correct_key: img_correct_key,
                trial_number: i,
            },
            // fix the step function so that if the transition was correct, it doesn't mean this specific image gets harder
            trial_duration: function(i,adjust_duration=false){
                // this means for every single trial we maintain the level at level_for_all_trials
                if (adjust_duration == false) {
                    curr_trial_duration_level = level_for_all_trials
                    return duration_levels_dict[curr_trial_duration_level]
                } else {
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
            choices: ['enter'],
            data: {
                stimulus_type: transition_stim_type,
                correct_key: transition_correct_key,
                curr_level: 1,
                curr_trial_duration: duration_levels_dict[1],
                trial_number: i+1,
            },
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

    // remove the items you used from the final_list array
    final_list.splice(num_items)
    console.log(trials)

    return trials
}

//////////////////////////////////////////////////////////////////////////////
//// TIMELINE CREATION

// ORDERED LIST OF STIMULI (length: totalTrialNum_gradcpt = practice_trials_gradcpt_num + num_blocks*gradcpt_trials_per_block = max possible number of gradCPT trials in this experiment)
var final_list = random_stimulus_list(totalTrialNum_gradcpt)

// PRACTICE TRIALS
var gradcpt_practice_trials = {
    timeline: getTrials_gradcpt(practice_trials_gradcpt_num)
}
