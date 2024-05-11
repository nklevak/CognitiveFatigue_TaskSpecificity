//////////////////////////////////////
// EXPERIMENT SET UP VARIABLES
// max number of totalTrialNum_gradcpt = practice trials + num_blocks * gradcpt_trials_per_block
var practice_trials_gradcpt_num = 10
var num_blocks = 4
var gradcpt_trials_per_block = 15
// we will generate a stimuli list for the MAX amount of trials the gradcpt might have (depending on switches, some of these will not be used)
var totalTrialNum_gradcpt = practice_trials_gradcpt_num + num_blocks*gradcpt_trials_per_block
var level_for_all_trials = 1 // this is all that matters in this version since adjust_duration below is false
var curr_trial_duration_level = 1

//////////////////////////////
// STIMULI AND DURATION
var all_stim = ["city_1.jpg","city_2.jpg","city_3.jpg","city_4.jpg", "city_5.jpg","city_6.jpg","mountain_1.jpg",
"c1_c2.gif","c1_c3.gif","c1_c4.gif","c1_c5.gif","c1_c6.gif","c1_m1.gif","c2_c1.gif","c2_c3.gif","c2_c4.gif","c2_c5.gif","c2_c6.gif",
"c2_m1.gif","c3_c1.gif","c3_c2.gif","c3_c4.gif","c3_c5.gif","c3_c6.gif",
"c3_m1.gif","c4_c1.gif","c4_c2.gif","c4_c3.gif","c4_c5.gif","c4_c6.gif",
"c4_m1.gif","c5_c1.gif","c5_c2.gif","c5_c3.gif","c5_c4.gif","c5_c6.gif",
"c5_m1.gif","c6_c1.gif","c6_c2.gif","c6_c3.gif","c6_c4.gif","c6_c5.gif",
"c6_m1.gif","m1_c1.gif","m1_c2.gif","m1_c3.gif","m1_c4.gif","m1_c5.gif",
"white_1.jpg","c1_white1.gif", "c2_white1.gif","c3_white1.gif","c4_white1.gif",
"c5_white1.gif","c6_white1.gif","m1_white1.gif","white1_c1.gif","white1_c2.gif",
"white1_c3.gif","white1_c4.gif","white1_c5.gif","white1_c6.gif","white1_m1.gif"]

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
    '5-2': 'c5_c2.gif','5-3': 'c5_c3.gif','5-4': 'c5_c4.gif','5-6': 'c5_c6.gif', '6-0': 'c6_m1.gif',
    '6-1': 'c6_c1.gif','6-2': 'c6_c2.gif', '6-3': 'c6_c3.gif','6-4': 'c6_c4.gif','6-5': 'c6_c5.gif',
    '0-1': 'm1_c1.gif','0-2': 'm1_c2.gif','0-3': 'm1_c3.gif','0-4': 'm1_c4.gif','0-5': 'm1_c5.gif',
    '0-6': 'm1_c6.gif','-1':"white_1.jpg",'-1-1':"white1_c1.gif",'-1-2':"white1_c2.gif",
    '-1-3':"white1_c3.gif",'-1-4':"white1_c4.gif",'-1-5':"white1_c5.gif",'-1-6':"white1_c6.gif",'-1-0':"white1_m1.gif",
    '1--1':"c1_white1.gif", '2--1':"c2_white1.gif",'3--1':"c3_white1.gif",'4--1':"c4_white1.gif",'5--1':"c5_white1.gif",
    '6--1':"c6_white1.gif",'0--1':"m1_white1.gif"
};

// UPDATED TO ADD THE TRANSITION FROM WHITE AND THE TRANSITION TO WHITE
// num_trials = practice_trials_gradcpt_num + gradcpt_trials_per_block * num_blocks
// each trial will be white to first img, transiton from first to next img, ....., transition to last, 
// last img, transition from last img to white
var random_stimulus_list = function(num_trials) {
    var prev_trial_index = -1
    let key_stim_list = []
    let final_stim_list = []
    var randomNumber = 0

    // do the practice trials
    var num_trials = practice_trials_gradcpt_num
    prev_trial_index = -1
    for (let i =0; i < num_trials;i++){
        randomNumber = Math.floor(Math.random() * 10); // Generates a number between 0 and 9
        // this means this is the first trial
        if (prev_trial_index == -1){
            if (randomNumber == 0) {
                // starts with mountain
                // push transition from white to mountain
                key_stim_list.push('-1-'+randomNumber.toString()) // starts with transition white to mountain

                // push mountain
                key_stim_list.push(randomNumber.toString()) // starts with mountain
            } else {
                // starts with a city
                randomNumber = Math.floor(Math.random() * 6) + 1

                // push transition from white to city
                key_stim_list.push('-1-'+randomNumber.toString()) // starts with transition white to city
                // push city
                key_stim_list.push(randomNumber.toString())
            }
            prev_trial_index = randomNumber
            // skip to next trial
            continue
        }

        // this part will only get activated if it is not the first trial
        // adds transition from prev trial index and then a new img
        if (randomNumber == 0 && prev_trial_index != 0) {
            key_stim_list.push(prev_trial_index + '-' + randomNumber) // add transition to this image
            key_stim_list.push(randomNumber.toString()) // add this image
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
        }
        prev_trial_index = randomNumber

        // this part will only get activated if it is the last trial
        // after adding the last trial, add a transition from img to white
        if (i == (num_trials - 1)){
            key_stim_list.push(prev_trial_index.toString() + '--1')// transition from img to white
        }
    }

    // do the blocks, same as practice but do it num_blocks times
    for (j = 0; j < num_blocks; j++){
        num_trials = gradcpt_trials_per_block
        prev_trial_index = -1

        for (let i =0; i < num_trials;i++){
            randomNumber = Math.floor(Math.random() * 10); // Generates a number between 0 and 9
            // this means this is the first trial
            if (prev_trial_index == -1){
                if (randomNumber == 0) {
                    // starts with mountain
                    // push transition from white to mountain
                    key_stim_list.push('-1-'+randomNumber.toString()) // starts with transition white to mountain
    
                    // push mountain
                    key_stim_list.push(randomNumber.toString()) // starts with mountain
                } else {
                    // starts with a city
                    randomNumber = Math.floor(Math.random() * 6) + 1
    
                    // push transition from white to city
                    key_stim_list.push('-1-'+randomNumber.toString()) // starts with transition white to city
                    // push city
                    key_stim_list.push(randomNumber.toString())
                }
                prev_trial_index = randomNumber
                // skip to next trial
                continue
            }
    
            // this part will only get activated if it is not the first trial
            // adds transition from prev trial index and then a new img
            if (randomNumber == 0 && prev_trial_index != 0) {
                key_stim_list.push(prev_trial_index + '-' + randomNumber) // add transition to this image
                key_stim_list.push(randomNumber.toString()) // add this image
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
            }
            prev_trial_index = randomNumber
    
            // this part will only get activated if it is the last trial
            // after adding the last trial, add a transition from img to white
            if (i == (num_trials - 1)){
                key_stim_list.push(prev_trial_index.toString() + '--1')// transition from img to white
            }
        }
    }

    // transform the keys into image files
    for (const key of key_stim_list) {
        final_stim_list.push("./img900_esterman_w_big/" + stim_dict[key])
    }

    return final_stim_list;
};

// PRELOADING
var preload_stim = []
var path_to_img = "./img900_esterman_w_big/"
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
var preload_manual_instr = {
    type: jsPsychPreload,
    show_detailed_errors: true,
    images: [path_to_img + 'mountain_1.jpg',path_to_img + 'city_1.jpg'],
    message: 'Please wait while the experiment loads. This may take a few minutes.',
};

// UPDATED GET TRIALS FUNCTION
// each trial round is the transition and then the following image
// it ends with an extra transition from img to white
// pass in how many trial timeline rounds you want it to generate, and remove those from the final_list
var getTrials_gradcpt = function(num_trials){
    // array you return with the timeline objects
    var trials = []

    var proportion_per_trial = 1 / num_trials

    // take of num_trials from final_list
    var num_items = num_trials * 2

    var preload_stim_block = final_list.slice(0,num_items+1)
    preload_stim_block.push(path_to_img + 'mountain_1.jpg',path_to_img + 'city_1.jpg')
    var preload_manual_block = {
      type: jsPsychPreload,
      show_detailed_errors: true,
      images: preload_stim_block,
      message: 'Please wait while the game loads.',
      on_finish: function(){
        console.log("done!")
      }
    };
    trials.push(preload_manual_block)

    // add a transition then image for each trial
    for (let i = 0; i < num_items; i++){// evens are transitions odds are images
        var stim = final_list[i]
        var stim_type = "go"
        var correct_key = " "

        var trial_type = i % 2 == 0 ? 'transition' : 'img'

        if (trial_type == 'transition') { // that means adding a transition trial
            if (stim.split('/')[2].split('_')[1].includes("m")){
                stim_type = "no-go"
                correct_key = null
            }

            // add transition trials
            var trial_transition = {
                type: jsPsychImageKeyboardResponse,
                stimulus: stim,
                choices: [' '],
                data: {
                    stimulus_type: stim_type,
                    correct_key: correct_key,
                    curr_level: 1,
                    curr_trial_duration: duration_levels_dict[1],
                    trial_number: i / 2,
                    game_type: "gradcpt",
                    practice: "false",
                    cpt_type: "transition"
                },
                trial_duration:duration_levels_dict[1],
                response_ends_trial:false,
                render_on_canvas: false,
                on_finish: function(data){
                    // Score the response as correct or incorrect.
                    if(jsPsych.pluginAPI.compareKeys(data.response, data.correct_key)){
                        data.correct = true;
                    } else {
                        console.log("key was pressed, incorrect")
                        data.correct = false; 
                    }
                }
            };
            trials.push(trial_transition)
            continue
        } else { // that means adding an imaage trial
            if (stim.includes("mountain")){
                stim_type = "no-go"
                correct_key = null
            }
            // add image trials
            var trial_img = {
                type: jsPsychImageKeyboardResponse,
                stimulus: stim,
                choices: [' '],
                data: {
                    stimulus_type: stim_type,
                    correct_key: correct_key,
                    trial_number: i / 2,
                    curr_trial_duration: duration_levels_dict[level_for_all_trials],
                    game_type: "gradcpt",
                    practice: "false",
                    cpt_type: "img"
                },
                // fix the step function so that if the transition was correct, it doesn't mean this specific image gets harder
                trial_duration: duration_levels_dict[level_for_all_trials],
                response_ends_trial:false,
                render_on_canvas: false,
                on_finish: function(data){
                    // first check if they got it correct during the previous transition trial
                    var prev_correct = jsPsych.data.get().last(2).values()[0].correct
                    
                    // Score the response as correct or incorrect.
                    if(jsPsych.pluginAPI.compareKeys(data.response, data.correct_key)){
                        data.correct = true;
                        // if it was a mountain, then being incorrect during the transition is enough to be incorrect now 
                        if (data.stimulus_type == "no-go"){
                            data.correct = prev_correct
                        }
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

                    var progressbar_update = jsPsych.getProgressBarCompleted() + proportion_per_trial
                    jsPsych.setProgressBar(progressbar_update);
                }
            };
            trials.push(trial_img)
            continue
        }
    }

    // add final transition from prev image to white
    var trial_transition = {
        type: jsPsychImageKeyboardResponse,
        stimulus: final_list[num_items],
        choices: [' '],
        data: {
            stimulus_type: 'filler',
            correct_key: ' ',
            curr_level: 1,
            curr_trial_duration: duration_levels_dict[1],
            trial_number: i / 2,
            game_type: "gradcpt",
            practice: "false",
            cpt_type: "transition"
        },
        prompt:"<div style='text-align: center; margin-top: 20px;'>Ending now.</div>",
        trial_duration:duration_levels_dict[1],
        response_ends_trial:false,
        render_on_canvas: false,
    };
    trials.push(trial_transition)

    // remove the items you used from the final_list array
    final_list.splice(0,num_items + 1)

    return trials
}

// GET PRACTICE TRIALS FUNCTION
// each "trial round" is the image being shown, and the following transition
// pass in how many trial timeline rounds you want it to generate, and remove those from the final_list
var getTrials_practice_gradcpt = function(num_trials){
    // array you return with the timeline objects
    var trials = []

    // take of num_trials from final_list
    var num_items = num_trials * 2
    var preload_stim_block = final_list.slice(0,num_items+1)
    preload_stim_block.push(path_to_img + 'mountain_1.jpg',path_to_img + 'city_1.jpg')
    var preload_manual_block = {
      type: jsPsychPreload,
      show_detailed_errors: true,
      images: preload_stim_block,
      message: 'Please wait while the game loads.',
      on_finish: function(){
        console.log("done!")
      }
    };
    trials.push(preload_manual_block)

    // add a transition then image for each trial
    for (let i = 0; i < num_items; i++){// evens are transitions odds are images
        var stim = final_list[i]
        var stim_type = "go"
        var correct_key = " "//space key

        var trial_type = i % 2 == 0 ? 'transition' : 'img'

        if (trial_type == 'transition') { // that means adding a transition trial
            if (stim.split('/')[2].split('_')[1].includes("m")){
                stim_type = "no-go"
                correct_key = null
            }

            // add transition trials
            var trial_transition = {
                type: jsPsychImageKeyboardResponse,
                stimulus: stim,
                choices: [' '],
                data: {
                    stimulus_type: stim_type,
                    correct_key: correct_key,
                    curr_level: 1,
                    curr_trial_duration: duration_levels_dict[1],
                    trial_number: i / 2,
                    game_type: "gradcpt",
                    practice: "true",
                    cpt_type: "transition"
                },
                prompt:"<div style='text-align: center; margin-top: 20px;'>Press Spacebar if it is a city.</div>",
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
            trials.push(trial_transition)
            continue
        } else { // that means adding an imaage trial
            if (stim.includes("mountain")){
                stim_type = "no-go"
                correct_key = null
            }
            // add image trials
            var trial_img = {
                type: jsPsychImageKeyboardResponse,
                stimulus: stim,
                choices: [' '],
                data: {
                    stimulus_type: stim_type,
                    correct_key: correct_key,
                    trial_number: i / 2,
                    curr_trial_duration: duration_levels_dict[level_for_all_trials],
                    game_type: "gradcpt",
                    practice: "true",
                    cpt_type: "img"
                },
                prompt:"<div style='text-align: center; margin-top: 20px;'>Press Spacebar if it is a city.</div>",
                // fix the step function so that if the transition was correct, it doesn't mean this specific image gets harder
                trial_duration: duration_levels_dict[level_for_all_trials],
                response_ends_trial:false,
                render_on_canvas: false,
                on_finish: function(data){
                    // first check if they got it correct during the previous transition trial
                    var prev_correct = jsPsych.data.get().last(2).values()[0].correct
                    
                    // Score the response as correct or incorrect.
                    if(jsPsych.pluginAPI.compareKeys(data.response, data.correct_key)){
                        data.correct = true;

                        if (data.stimulus_type == "no-go"){
                            data.correct = prev_correct
                        }
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
            trials.push(trial_img)
            continue
        }
    }
    
    // add final transition from prev image to white
    var trial_transition = {
        type: jsPsychImageKeyboardResponse,
        stimulus: final_list[num_items],
        choices: [' '],
        data: {
            stimulus_type: 'filler',
            correct_key: ' ',
            curr_level: 1,
            curr_trial_duration: duration_levels_dict[1],
            trial_number: i / 2,
            game_type: "gradcpt",
            practice: "true",
            cpt_type: "transition"
        },
        prompt:"<div style='text-align: center; margin-top: 20px;'>Ending now.</div>",
        trial_duration:duration_levels_dict[1],
        response_ends_trial:false,
        render_on_canvas: false,
    };
    trials.push(trial_transition)

    // add a feedback trial here
    var cpt_practice_feedback = {
        type: jsPsychHtmlKeyboardResponse,
        trial_duration: 2000,
        response_ends_trial:false,
        stimulus: function(){
            var cpt_practice_trials = jsPsych.data.get().filter({game_type:"gradcpt",practice:"true",cpt_type: "img"}).values();
            var num_cpt_practice_trials = cpt_practice_trials.length
            var accuracy_count = 0
            for (let i = 0; i < num_cpt_practice_trials; i++){
                if(cpt_practice_trials[i].correct){
                    accuracy_count += 1
                }
            }

            var accuracy =  num_trials > 0 ? (100 * accuracy_count / num_trials) : 0;
            
            jsPsych.data.get().addToLast({cpt_practice_accuracy: accuracy});// should I do something where if they get a lot wrong they have to do it again? or would this just be exclusion criteria?

            return '<div>You got ' + accuracy + '% correct </p>'
        }
      }
    
    trials.push(cpt_practice_feedback)

    // remove the items you used from the final_list array
    final_list.splice(0,num_items + 1)

    return trials
}

//////////////////////////////////////////////////////////////////////////////
//// TIMELINE CREATION

// ORDERED LIST OF STIMULI (length: totalTrialNum_gradcpt = practice_trials_gradcpt_num + num_blocks*gradcpt_trials_per_block = max possible number of gradCPT trials in this experiment)
// the num trials input here doesn't really do anything
var final_list = random_stimulus_list(totalTrialNum_gradcpt)

// PRACTICE TRIALS
var gradcpt_practice_trials = {
    timeline: getTrials_practice_gradcpt(practice_trials_gradcpt_num)
}