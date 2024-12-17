var max_num_rest_trials_per_block = 3; // before it was 20; make it 30?
var rest_num_practice_trials = 6;
var num_groups = 10
var num_blocks_per_group = 3

const rt_instructions_01 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>In this task, you will see two shapes with numbers underneath them.</p>
    <p>You will be asked about the number under one of the shapes.</p>
    <div style="display: flex; justify-content: space-around; margin: 20px;">
      <div><img src="img/circle.png" style="width: 50px;"><br>1</div>
      <div><img src="img/square.png" style="width: 50px;"><br>2</div>
    </div>
    <p>Press the corresponding number key when asked about a specific shape.</p>
    <p>You can end the rest at any time by clicking the "End Rest" button.</p>
    <p>Press any key to begin.</p>
  `,
};

// REST BREAK INSTRUCTIONS
var rest_ended = false;
var overall_rest_left = num_groups * num_blocks_per_group * max_num_rest_trials_per_block
var num_rest_used = 0

function shouldTrialRun() {
  console.log('in function')
  console.log(rest_ended)
  return !rest_ended
}

function rest_task_createTrials(num_rt_trials) {
  const shapes = ['circle', 'square'];
  const trials = [];

  var rest_trial_number = 0; // records how many trials have been added
  for (let i = 0; i < num_rt_trials; i++) {
    var targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
        timeline: [{
          type: dsstWithEndRestPlugin,
          stimulus: targetShape,
          choices: ['1', '2'],
          shapes: ['img/circle.png', 'img/square.png'],
          show_end_rest_button: true,
          trial_duration: 900,
          data: {
            target_shape: targetShape,
            correct_response: shapes.indexOf(targetShape) + 1,
            option_to_end: true, //whether the end rest button is visible
            rest_trial_num: rest_trial_number,
            overall_num_rest_used: num_rest_used
          },
          on_finish: function(data) {
            console.log("end_rest: " + data.end_rest.toString());

            data.game_type = "rest_task"

            if (data.end_rest == false && rest_ended == false) {
              data.is_correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
              rest_ended = false;
            } else {
              rest_ended = true;
            }

            overall_rest_left = overall_rest_left - 1
            num_rest_used = num_rest_used + 1
          },
        }],
        conditional_function: function() {
          console.log("Evaluating conditional function for trial " + (i + 1));
          const shouldRun = shouldTrialRun();
          console.log("shouldTrialRun() returned: " + shouldRun);
          return shouldRun;
        }
      });

      rest_trial_number = rest_trial_number + 1
    }

  return trials;
}



// cue that task will stay
var cue_stay = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You will now begin the rest break. At the end of this rest break, <strong>you will continue with the same game.</strong> </p>',
  choices: "NO_KEYS",
  trial_duration: 2000,
  on_finish: function(data){
    rest_ended = false
    console.log(rest_ended)
  }
}

// cue that task will switch
var cue_switch = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You will now begin the rest break. At the end of this rest break, <strong>you will switch to the other game.</strong> </p>',
  choices: "NO_KEYS",
  trial_duration: 2000,
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
  choices: "NO_KEYS",
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
      jsPsych.data.addProperties({rest_duration: rest_duration, game_type: "rest_task", trial_type:"rt_main_trials"});
      console.log("in on finish")
      rest_ended = false
    }
  };

  return {timeline: [cue_timeline, self_paced_rest_procedure, rest_to_game_transition]};
}


function practice_rest_task_createTrials(num_rt_trials) {
  const shapes = ['circle', 'square'];
  const trials = [];

  for (let i = 0; i < num_rt_trials; i++) {
    var targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
      type: dsstWithEndRestPlugin,
      stimulus: targetShape,
      choices: ['1', '2'],
      shapes: ['img/circle.png', 'img/square.png'],
      show_end_rest_button: false,
      trial_duration: 900,
      data: {
        target_shape: targetShape,
        correct_response: shapes.indexOf(targetShape) + 1
      },
      on_finish: function(data) {
        data.is_correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
        data.game_type = "rest_task",
        data.trial_type = "rt_practice_trials"
      }
    });

    // Add feedback
    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
          var last_trial = jsPsych.data.get().last(1).values()[0];
          if (last_trial.is_correct) {
              return `
                  <div class="flex flex-col items-center justify-center">
                      <p class="text-2xl text-green-500 mb-4">Correct!</p>
                      <p class="mt-8">Press any key to continue</p>
                  </div>
              `;
          } else {
              return `
                  <div class="flex flex-col items-center justify-center">
                      <p class="text-2xl text-red-500 mb-4">Incorrect, please pay attention to what shape is requested.</p>
                      <p class="mt-8">Press any key to continue</p>
                  </div>
              `;
          }
      },
      choices: "NO_KEYS",
      trial_duration: 1000,
      on_finish: function(data) {
          data.trial_type = "rt_practice_feedback"
      }
    });
  }

  return trials;
}


function leftover_rest_task_createTrials(num_rt_trials) {
  const shapes = ['circle', 'square'];
  const trials = [];

  for (let i = 0; i < num_rt_trials; i++) {
    var targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
      timeline: [{
      type: dsstWithEndRestPlugin,
      stimulus: targetShape,
      choices: ['1', '2'],
      shapes: ['img/circle.png', 'img/square.png'],
      show_end_rest_button: false,
      trial_duration: 900,
      data: {
        target_shape: targetShape,
        correct_response: shapes.indexOf(targetShape) + 1
      },
      on_finish: function(data) {
        overall_rest_left = overall_rest_left - 1
        data.is_correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
        data.game_type = "rest_task",
        data.trial_type = "rt_extra_trials"
      },
    }],
      conditional_function: function() {
        console.log("Trials left" + (overall_rest_left));
        const shouldRun = overall_rest_left > 0
        return shouldRun;
      }
    });
  }

  return trials;
}

var rt_practice = {timeline: practice_rest_task_createTrials(rest_num_practice_trials)}
var rt_leftovers = {timeline: leftover_rest_task_createTrials(overall_rest_left)}