// taken/adapted from: https://github.com/mahiluthra/working_memory_tests/blob/master/digit_span_task.html

//----- CUSTOMIZABLE VARIABLES -----------------------------------------

nTrials = 3 // number of trials in the test
minSetSize = 2 // number of digits per trial
stimuli_duration = 750 // number of miliseconds to display each digit
recall_duration = null // number of miliseconds to allow recall. If null, there is no time limit.
file_name = null // file name for data file. if null, a default name consisting of the participant ID and a unique number is chosen.
local = false // save the data file locally.
            // If this test is being run online (e.g., on MTurk), true will cause the file to be downloaded to the participant's computer.
            // If this test is on a server, and you wish to save the data file to that server, change this to false.
            // If changed to false, ensure that the php file (its in the directory!) and the empty "data" folder has also been appropriately uploaded to the server.
            // Incase of problems, feel free to contact me :)

//----------------------------------------------------------------------
// function ds_getGridParams_ds(num_trials,max_tile_duration) {
//   // the number of trials i want to group together
//   var num_trial_per_group = 5;
//   // the difference in mean time I want per group
//   var mean_time_diff = 100;
//   // Initialize an array to hold the duration of each trial
//   var trialDurations = [];
//   // Calculate the number of full groups of 5 and the remainder
//   var fullGroups = Math.floor(num_trials / num_trial_per_group);
//   var remainder = num_trials % num_trial_per_group;
//   // Initialize the current duration to the max duration
//   var currentDuration = max_tile_duration;
//   // Process full groups
//   for (let i = 0; i < fullGroups; i++) {
//       // make first group anywhere in the range of (the max time - 50)
//       if (i == 0) {
//         for (let j = 0; j < num_trial_per_group; j++) {
//           trialDurations.push(Math.max(0, currentDuration - Math.floor(Math.random() * (mean_time_diff / 2))))
//         }
//         currentDuration = currentDuration - mean_time_diff
//         continue;
//       }
//       // make each following groups anywhere in +50 or -50 of the previous max time - 100
//       let min = 0
//       if (((currentDuration - (mean_time_diff / 2)) >= 0)) {
//         min = currentDuration - (mean_time_diff / 2)
//       }
//       // adding the +1 makes it inclusive
//       for (let j = 0; j < num_trial_per_group; j++) {
//         trialDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min))
//       }
//       // update the new current duration (mean duration) for the next group
//       currentDuration = currentDuration - mean_time_diff
//     }
//   // Process any remaining trials and give them all the final value
//   let min = 0
//   if (((currentDuration - (mean_time_diff / 2)) >= 0)) {
//     min = currentDuration - (mean_time_diff / 2)
//   }
//   for (let i = 0; i < remainder; i++) {
//       trialDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min));
//   }

//   // go through the trial durations and return the timeline vals
//   let timeline_full_vals = []
//   trialDurations.forEach((item, _) => {
//     timeline_full_vals.push({
//         sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], 4),
//         tile_duration: item
//     });
//   });
//   return timeline_full_vals
// }

possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]  //possible digits participants can get
var selection = jsPsych.randomization.sampleWithoutReplacement(possibleNumbers, minSetSize)  //chooses random digits
var selection_id = -1

// keeps track of participant's scores:
var nError = 0
var highest_span_score = 0
var consec_error_score = 0

// instruction page
var ds_instructions_1_practice = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to the next task! Click next for the instructions.</p>",
      "<div style='font-size:20px;'><b>INSTRUCTIONS</b><br><br>This is the digit span task.<br><br>In this task, you will have to remember a sequence of numbers presented on the screen one after the other.<br>At the end of each trial, enter all the numbers into the onscreen number-pad in their correct order.<br><br><u>Example:</u> if the sequence is '7 4 5 1', enter '7 4 5 1' in this exact order.<br><br>You will now be given practice trials to help you understand the task.<br>Press 'Next' to start the practice trials.<br><br></div>",
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next',
    on_finish: function(){
      minSetSize = 3
      selection = jsPsych.randomization.sampleWithoutReplacement(possibleNumbers, minSetSize)
    }
  };

var ds_instructions_1 = {
    type: jsPsychInstructions,
    pages: [
        "<div style='font-size:20px;'>You have completed the practice trials. <br><br> If you have further questions about the task, ask the researcher now.<br> If you are clear about the task, click 'Next' to proceed to the main trials.<br><br></div>",
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next',
    on_finish: function(){
      minSetSize = 3
      selection = jsPsych.randomization.sampleWithoutReplacement(possibleNumbers, minSetSize)
    }
};

var test_stimuli = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function(){
    selection_id+=1
    return '<div style="font-size:70px;">'+selection[selection_id]+'</div>'
  },
  choices: "NO_KEYS",
  trial_duration: stimuli_duration,
  on_finish: function(){
    if (selection_id + 1 >=selection.length){
      jsPsych.endCurrentTimeline()
    }
  }
};

var recall = {
  type: jsPsychDigitSpanRecall,
  correct_order: function(){
    return selection
  },
  trial_duration: recall_duration,
  on_finish: function(){
    acc = jsPsych.data.get().last(1).values()[0].accuracy;
    if (acc==1){
      if (highest_span_score < minSetSize){
        highest_span_score = minSetSize
        }
        minSetSize+=1
        nError = 0
    } else if (nError < 1) { // checks for number of consecutive errors
      nError += 1
    } else {
      if (consec_error_score < minSetSize){
        consec_error_score = minSetSize
      }
      minSetSize = Math.max( 3, minSetSize-1)
      }
    if (minSetSize<=8){ // bottom code prevents immediate repition of digits
      selection = jsPsych.randomization.sampleWithoutReplacement(possibleNumbers, minSetSize)
    } else {
      selection = jsPsych.randomization.sampleWithoutReplacement(possibleNumbers, 8)
      var extra = minSetSize-8
      var id = possibleNumbers.indexOf(selection[7])
      possibleNumbers.splice(id, 1);
      var extraNumbers= jsPsych.randomization.sampleWithoutReplacement(possibleNumbers, extra)
      selection = selection.concat(extraNumbers)
      possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    }
    selection_id = -1
  }
}

var feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function(){
    var text = ""
    var accuracy = jsPsych.data.get().last(1).values()[0].accuracy
    if (accuracy==1){
      text += '<div style="font-size:35px; color:rgb(0 220 0)"><b>Correct</div>'
    } else {
      text += '<div style="font-size:35px; color:rgb(240 0 0)"><b>Incorrect</div>'
    }
    //text += '<div style="font-size:30px; color:rgb(0 0 0)"><br><br>New trial starting now.</div>'
    return text
  },
  choices: "NO_KEYS",
  trial_duration: 1000
}

var conclusion = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function(){
    return '<div style="font-size:20px;">You have completed the task.<br>Thank you for your participation in this task.<br><br>Maximum number of digits recalled correctly was ' + highest_span_score +'.<br><br>Maximum number of digits reached before making two consecutive errors was ' +consec_error_score+'.<br><br>Please tell the Research Assistant you have completed the task.</div>'
},
  choices: "NO_KEYS",
//  trial_duration:1000
}

var test_stack = {
  timeline: [test_stimuli],
  repetitions: 17
}

var test_procedure = {
  timeline: [test_stack, recall, feedback],
  repetitions: nTrials
}

var demo_procedure = {
  timeline: [test_stack, recall, feedback],
  repetitions: 3
}