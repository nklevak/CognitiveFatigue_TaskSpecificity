var max_num_rest_trials_per_block = 20;
var rest_num_practice_trials = 6;

const rt_instructions_01 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>In this task, you will see three shapes with numbers underneath them.</p>
    <p>You will be asked about the number under one of the shapes.</p>
    <div style="display: flex; justify-content: space-around; margin: 20px;">
      <div><img src="img/circle.png" style="width: 50px;"><br>1</div>
      <div><img src="img/diamond.png" style="width: 50px;"><br>2</div>
      <div><img src="img/square.png" style="width: 50px;"><br>3</div>
    </div>
    <p>Press the corresponding number key when asked about a specific shape.</p>
    <p>You can end the rest at any time by clicking the "End Rest" button.</p>
    <p>Press any key to begin.</p>
  `,
};


// REST BREAK INSTRUCTIONS
var rest_ended = false;

function shouldTrialRun() {
  console.log('in function')
  console.log(rest_ended)
  return !rest_ended
}

function rest_task_createTrials(num_rt_trials) {
  const shapes = ['circle', 'diamond', 'square'];
  const trials = [];

  var count_without_button = 0 // makes first 5 trials not have option to end rest

  for (let i = 0; i < num_rt_trials; i++) {
    const targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    if (count_without_button < 5) {
      trials.push({
        timeline: [{
          type: dsstWithEndRestPlugin,
          stimulus: targetShape,
          choices: ['1', '2', '3'],
          shapes: ['img/circle.png', 'img/diamond.png', 'img/square.png'],
          show_end_rest_button: false,
          trial_duration: 2000,
          data: {
            target_shape: targetShape,
            correct_response: shapes.indexOf(targetShape) + 1,
            option_to_end: false,
            rest_trial_num: count_without_button
          },
          on_finish: function(data) {
            console.log("end_rest: " + data.end_rest.toString());
            if (data.end_rest == false && rest_ended == false) {
              data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
              rest_ended = false;
            } else {
              rest_ended = true;
            }
          },
        }],
        conditional_function: function() {
          console.log("Evaluating conditional function for trial " + (i + 1));
          const shouldRun = shouldTrialRun();
          console.log("shouldTrialRun() returned: " + shouldRun);
          return shouldRun;
        }
      });
    } else {
      trials.push({
        timeline: [{
          type: dsstWithEndRestPlugin,
          stimulus: targetShape,
          choices: ['1', '2', '3'],
          shapes: ['img/circle.png', 'img/diamond.png', 'img/square.png'],
          show_end_rest_button: true,
          trial_duration: 2000,
          data: {
            target_shape: targetShape,
            correct_response: shapes.indexOf(targetShape) + 1,
            option_to_end: true,
            rest_trial_num: count_without_button
          },
          on_finish: function(data) {
            console.log("end_rest: " + data.end_rest.toString());
            if (data.end_rest == false && rest_ended == false) {
              data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
              rest_ended = false;
            } else {
              rest_ended = true;
            }
          },
        }],
        conditional_function: function() {
          console.log("Evaluating conditional function for trial " + (i + 1));
          const shouldRun = shouldTrialRun();
          console.log("shouldTrialRun() returned: " + shouldRun);
          return shouldRun;
        }
      });
    }

    count_without_button = count_without_button + 1
  }

  return trials;
}


// cue that task will stay
var cue_stay = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You will now begin the rest break. At the end of this rest break, <strong>you will continue with the same game.</strong> </p>',
  choices: "ALL_KEYS",
  trial_duration: 5000,
  on_finish: function(data){
    rest_ended = false
    console.log(rest_ended)
  }
}

// cue that task will switch
var cue_switch = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You will now begin the rest break. At the end of this rest break, <strong>you will switch to the other game.</strong> </p>',
  choices: "ALL_KEYS",
  trial_duration: 5000,
  on_finish: function(data){
    rest_ended = false
    console.log(rest_ended)
  }
}

var rest_to_game_transition= {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="instructions-container">
    <p class="instructions-text">You are done with rest! You will now return to the games.</p>
  </div>`,
  choices: "ALL_KEYS",
  trial_duration: 1000,
  }

// Create self-paced rest timeline
function createSelfPacedRestTimeline(cue) {
  var cue_timeline = cue === "switch" ? cue_switch : cue_stay;
  var rest_timeline = rest_task_createTrials(max_num_rest_trials_per_block);
  
  var self_paced_rest_procedure = {
    timeline: rest_timeline,
    on_finish: function(data) {
      var rest_duration = data.last(1).time_elapsed - data.first(1).time_elapsed;
      jsPsych.data.addProperties({rest_duration: rest_duration});
      console.log("in on finish")
      rest_ended = false
    }
  };

  return {timeline: [cue_timeline, self_paced_rest_procedure, rest_to_game_transition]};
}

// edit to add feedback
function practice_rest_task_createTrials(num_rt_trials) {
  const shapes = ['circle', 'diamond', 'square'];
  const trials = [];

  for (let i = 0; i < num_rt_trials; i++) {
    const targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
      type: dsstWithEndRestPlugin,
      stimulus: targetShape,
      choices: ['1', '2', '3'],
      shapes: ['img/circle.png', 'img/diamond.png', 'img/square.png'],
      show_end_rest_button: false,
      trial_duration: 2000,
      data: {
        target_shape: targetShape,
        correct_response: shapes.indexOf(targetShape) + 1
      },
      on_finish: function(data) {
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
        data.game_type = "rest_practice"
      }
    });
  }

  return trials;
}

  var rt_practice = {timeline: practice_rest_task_createTrials(rest_num_practice_trials)}

