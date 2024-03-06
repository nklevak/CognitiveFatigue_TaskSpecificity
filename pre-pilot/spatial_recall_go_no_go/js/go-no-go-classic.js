// defines image and correct key association
// counterbalance across participants later
var gng_test_stimuli = [
    { stimulus: "img/blue.png",  correct_response: 'f'},
    { stimulus: "img/orange.png",  correct_response: null}
];

// preload the stimuli for the go no go
var preload = {
    type: jsPsychPreload,
    images: ['img/blue.png', 'img/orange.png'],
    auto_preload: true
};

function getTrialGNG(time) {
    // randomly pick if this will be a go or no go trial
    var trial_stimuli = gng_test_stimuli[(Math.random() < 0.5 ? 0 : 1)]

    // define go no go trials
    var timed_gng_single_trial = {
        type: jsPsychImageKeyboardResponse,
        stimulus: trial_stimuli["stimulus"],
        choices: ['f'],
        data: {
          task: 'response',
          correct_response: trial_stimuli['correct_response']
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
    var max_fixation_duration = 2000
    var min_fixation_duration = 250

    // Initialize the current duration to the max duration
    var currentFixDuration = max_fixation_duration;
    // Process full groups
    for (let i = 0; i < fullGroups; i++) {
        // make first group anywhere in the range of (the max time - 125)
        if (i == 0) {
          for (let j = 0; j < num_trial_per_group; j++) {
            fixationDurations.push(Math.max(0, currentFixDuration - Math.floor(Math.random() * (mean_time_diff / 2))))
            stimuliDurations.push(Math.random() < 0.5 ? 2000 : 3000)
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
            stimuliDurations.push(Math.random() < 0.5 ? 2000 : 3000)
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

    // add the timeline items
    fixationDurations.forEach((item, i) => {
        // add the trial
        timelineVarsGNG.push(getTrialGNG(stimuliDurations[i]));
        // add the fixation
        timelineVarsGNG.push(getFixation(item));
    });
    return timelineVarsGNG
}

// instructions for the go no go 
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

// entire task timeline (of individual trials + fixations)
// this one makes the fixations get shorter as it goes (to increase difficulty)
var gng_trials_auto = {
    timeline: getGngTrials(10),
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