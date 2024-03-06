// defines image and correct key association
// randomly assign which stimuli is which 
var index_go_stimuli = Math.random() < 0.5 ? 0 : 1
var index_no_go_simuli = index_go_stimuli == 1 ? 0 : 1
var stimuli_files = ["img/blue.png","img/orange.png"]
var gng_test_stimuli = [
    { stimulus: stimuli_files[index_go_stimuli],  correct_response: 'f'},
    { stimulus: stimuli_files[index_no_go_simuli],  correct_response: null}
];

// preload the stimuli for the go no go
var preload = {
    type: jsPsychPreload,
    images: stimuli_files,
    auto_preload: true
};

// takes in length of the stimulus onset, and also either a "go" or a "no go" stimuli value for this trial
function getTrialGNG(time, stimuli_value) {
    // define go no go trials
    var timed_gng_single_trial = {
        type: jsPsychImageKeyboardResponse,
        stimulus: stimuli_value["stimulus"],
        choices: ['f'],
        data: {
          task: 'response',
          correct_response: stimuli_value['correct_response']
        },
        trial_duration: function(){
          return time;
        },
        // save the time in the on finish TODO
        on_finish: function(data){
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
        }
    };

    return timed_gng_single_trial
}

function getFixation(time) {
    var timed_fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: time,
        data: {
            task: 'fixation'
        }// save the time in the on finish TODO
    };

    return timed_fixation
}

// given num_trials is even, generates a shuffled list of 50% go indices and 50% no-go indices
// NUM TRIALS NEEDS TO BE EVEN
function getStimuliList(num_trials) {
    stim_list = []
    for (let i = 0; i < num_trials / 2; i++) {
        stim_list.push(gng_test_stimuli[0]); 
        stim_list.push(gng_test_stimuli[1]); 
    }

    // shuffle this stimulus list
    for (let i = num_trials - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stim_list[i], stim_list[j]] = [stim_list[j], stim_list[i]]; // Swap elements
    }

    return stim_list
}

// this function provides a list of go no go trials and fixations that get increasingly more difficult (the fixation 
// times get smaller on average)
// should I make the amount of time a go is on screen smaller too? For now only changing fixation display time
function getGngTrials(num_trials) {
    // make the range of possible fixation times get smaller and smaller every n trials

    // the number of trials i want to group together
    var num_trial_per_group = 3;
    // the difference in mean time I want per group
    var mean_time_diff = 250;
    // initialize an array to hold all of the fixation trial durations and all of the stimuli trial durations
    var fixationDurations = [];
    var stimuliDurations = [];
    // Calculate the number of full groups of 5 and the remainder
    var fullGroups = Math.floor(num_trials / num_trial_per_group);
    var remainder = num_trials % num_trial_per_group;
    // initialize array to hold all of the timeline variables
    var timelineVarsGNG = []
    var max_fixation_duration = 1500
    var min_fixation_duration = 250

    // Initialize the current duration to the max duration
    var currentFixDuration = max_fixation_duration;
    // Process full groups
    for (let i = 0; i < fullGroups; i++) {
        // make first group anywhere in the range of (the max time - 125)
        if (i == 0) {
          for (let j = 0; j < num_trial_per_group; j++) {
            fixationDurations.push(Math.max(0, currentFixDuration - Math.floor(Math.random() * (mean_time_diff / 2))))
            stimuliDurations.push(Math.random() < 0.5 ? 1000 : 2000)
          }
          currentFixDuration = currentFixDuration - mean_time_diff
          continue;
        }
        // make each following groups anywhere in +125 or -125 of the previous max time - 250
        let min = min_fixation_duration
        if (((currentFixDuration - (mean_time_diff / 2)) >= min_fixation_duration)) {
          min = currentFixDuration - (mean_time_diff / 2)
        }
        // adding the +1 makes it inclusive
        for (let j = 0; j < num_trial_per_group; j++) {
            fixationDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min))
            stimuliDurations.push(Math.random() < 0.5 ? 1000 : 2000)
        }
        // update the new current duration (mean duration) for the next group
        currentFixDuration = currentFixDuration - mean_time_diff
      }
    // Process any remaining trials and give them all the final value
    let min = min_fixation_duration
    if (((currentFixDuration - (mean_time_diff / 2)) >= 0)) {
      min = currentFixDuration - (mean_time_diff / 2)
    }
    for (let i = 0; i < remainder; i++) {
        fixationDurations.push(Math.floor(Math.random() * (mean_time_diff + 1) + min));
        stimuliDurations.push(Math.random() < 0.5 ? 2000 : 3000)
    }

    // create a list of indices of go or no-go to make sure there is an equal number of go and no-go trials
    var stimuli_list = getStimuliList(num_trials);

    // add the timeline items
    fixationDurations.forEach((item, i) => {
        // add the trial
        timelineVarsGNG.push(getTrialGNG(stimuliDurations[i],stimuli_list[i]));
        // add the fixation
        timelineVarsGNG.push(getFixation(item));
    });
    return timelineVarsGNG
}

// Extract the color name of the "go" color from the filename
var goStimulusColor = stimuli_files[index_go_stimuli].match(/img\/(.*?)\.png/)[1];

// instructions for the go no go 
var gng_transition = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "You will now do a new task. Press any key to begin."
};
var gng_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>In this task, a circle will appear in the center
        of the screen.</p><p>If the circle is <strong>${goStimulusColor}</strong>,
        press the letter F on the keyboard as fast as you can.</p>
        <p>If the circle is not <strong>${goStimulusColor}</strong>, do not press a key.</p>
        <div style='width: 700px;'>
        <div style='float: left;'><img src='${stimuli_files[index_go_stimuli]}'></img>
        <p class='small'><strong>Press the F key</strong></p></div>
        <div style='float: right;'><img src='${stimuli_files[index_no_go_simuli]}'></img>
        <p class='small'><strong>Do not press a key</strong></p></div>
        </div>
        <p>Press any key to begin.</p>
    `,
    post_trial_gap: 2000
};

// entire task timeline (of individual trials + fixations)
// this one makes the fixations get shorter as it goes (to increase difficulty)
var gng_trials_auto = {
    timeline: getGngTrials(14),
    timeline_variables: gng_test_stimuli,
    repetitions: 0,
    randomize_order: false
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