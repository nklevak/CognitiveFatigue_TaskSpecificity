// THIS WAS THE FILE RUN ON COGNITION.RUN when I ran this pilot

// INITIALIZE TIMELINE
var jsPsych = initJsPsych({
    on_finish: function() {
      jsPsych.data.displayData();
      // jsPsych.data.get().addToLast({interactions: interaction_data.json()});
    }, 
  });
  
  // screen check file
  var jsPsychScreenCheck = (function (jspsych) {
      'use strict';
      const info = {
        name: 'screen-check',
        parameters: {
          min_width: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Minmum width',
            default: null,
            description: 'The minimum width (in pixels) of browser window for the experiment to continue.'
          },
          min_height: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Minmum height',
            default: null,
            description: 'The minimum height (in pixels) of browser window for the experiment to continue.'
          },
        }
      };
      /**
      * jspsych-screen-check
      * Sam Zorowitz
      *
      * plugin for ensuring a participant's viewport meets minimum size requirements
      *
      **/
      class ScreenCheckPlugin {
        constructor(jsPsych) {
          this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
    
          // store screen information
          var screen_info = {
            mw: trial.min_width !== null ? trial.min_width : 0,
            mh: trial.min_height !== null ? trial.min_height : 0,
            w: window.innerWidth,
            h: window.innerHeight
          }
    
          // function to report current viewport size
          var report_viewport_size = function() {
    
            // define message for participants
            var msg = '<p>Your browser window is too small to complete this experiment. '+
            'Please maximize the size of your browser window. If your browser window is already maximized, '+
            'you will not be able to complete this experiment.</p>'+
            '<p>The minimum width is '+screen_info.mw+'px. Your current width is '+screen_info.w+'px.</p>'+
            '<p>The minimum height is '+screen_info.mh+'px. Your current height is '+screen_info.h+'px.</p>' +
            '<p>If you are unable to meet these requirements, please return the experiment.</p>';
    
            // draw
            display_element.innerHTML = msg;
    
          }
    
          // function to end trial when it is time
          var end_trial = function() {
    
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();
            window.removeEventListener('resize', evalute_viewport_size);
    
            // gather the data to store for the trial
            var trial_data = {
              min_width: screen_info.mw,
              min_height: screen_info.mh,
              inner_width: screen_info.w,
              inner_height: screen_info.h
            };
    
            // clear the display
            display_element.innerHTML = '';
    
            // move on to the next trial
            jsPsych.finishTrial(trial_data);
    
          };
    
          // function to evalute viewport size
          var evalute_viewport_size = function() {
    
            // update info
            screen_info.w = window.innerWidth;
            screen_info.h = window.innerHeight;
    
            // evaluate viewport size
            if (screen_info.w >= screen_info.mw && screen_info.h >= screen_info.mh) {
              end_trial();
            } else {
              report_viewport_size();
            }
    
          }
          // initial validation
          evalute_viewport_size();
    
          // initialize event listener
          window.addEventListener('resize', evalute_viewport_size);
        }
      }
      ScreenCheckPlugin.info = info;
      return ScreenCheckPlugin;})(jsPsychModule);
  
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
    timeline_variables: getGridParams(15,750)
  }
  
  // GO NO GO file
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
              task: 'fixation',
              fixation_time: time,
          }
      };
  
      return timed_fixation
  }
  
  // given num_trials is even, generates a shuffled list of 50% go indices and 50% no-go indices
  // NUM TRIALS NEEDS TO BE EVEN
  function getStimuliList(num_trials) {
      stim_list = []
      // for 50 50 split
      // for (let i = 0; i < num_trials / 2; i++) {
      //     stim_list.push(gng_test_stimuli[0]); 
      //     stim_list.push(gng_test_stimuli[1]); 
      // }
  
      // for 20 no go and 80 go split
      num_no_go = Math.floor(0.2*num_trials)
      num_go = num_trials - num_no_go
      for (let i = 0; i < num_no_go; i++) {
        stim_list.push(gng_test_stimuli[1]); // 1 is the no go
      }
      for (let i = 0; i < num_go; i++) {
        stim_list.push(gng_test_stimuli[0]);
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
      var num_trial_per_group = 10;
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
  var transition = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>You will now do a new task. Press any key to begin.</p>"
  };
  // go no go new task instructions
  var gng_instructions_1 = {
      type: jsPsychInstructions,
      pages: [
        "<p>Welcome to the next task! Click next for the instructions.</p>",
      ],
      key_forward: 'ArrowRight',
      key_backward: 'ArrowLeft',
      allow_keys: true,
      show_clickable_nav: true,
      button_label_previous: 'Prev',
      button_label_next: 'Next'
    }
  var gng_instructions_2 = {
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
      timeline: getGngTrials(30),
      timeline_variables: gng_test_stimuli,
      repetitions: 0,
      randomize_order: false
  };
  
  // go no go debrief
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
  
  // overall task debrief
  var overall_debrief_block = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: 
        `<p>Great work! This experiment is over now. Please press any button.</p>`
  }
  
  /////////
  // from init-jspsych file
  // Initialize jsPsych.
  // var jsPsych = initJsPsych({
  //     on_finish: function() {
  //       // Add interactions to the data variable
  //       var interaction_data = jsPsych.data.getInteractionData();
  //       jsPsych.data.get().addToLast({interactions: interaction_data.json()});
  //       // Display jsPsych data in viewport.
  //       // jsPsych.data.displayData();
  //     }
  //   });
  
  
  
  var timeline = [];
  
  // GENERAL TASK INSTRUCTIONS
  timeline.push(gen_instructions);
  
  // SPATIAL RECALL TASK (forward span only)
  timeline.push(sr_instructions_01);
  timeline.push(sr_recall_forwards);
  
  // GO NO-GO TASK (simple version)
  // preload images 
  timeline.push(preload);
  // first instructions about how this is a new task 
  timeline.push(transition);
  // instructions about what to do 
  timeline.push(gng_instructions_1);
  timeline.push(gng_instructions_2);
  // add the trials and fixations
  //timeline.push(gng_trials);
  timeline.push(gng_trials_auto);
  
  // the debrief (how many you got right)
  timeline.push(gng_debrief_block);
  timeline.push(overall_debrief_block)
  
  // RUN THE EXPERIMENT
  jsPsych.run(timeline);