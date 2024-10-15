var max_num_rest_trials_per_block = 10;
var num_practice_trials = 5;

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
  return rest_ended
}

// Create trials
function rest_task_createTrials(num_rt_trials) {
  const shapes = ['circle', 'diamond', 'square'];
  const trials = [];

  for (let i = 0; i < num_rt_trials; i++) {
    const targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
      type: dsstWithEndRestPlugin,
      stimulus: targetShape,
      choices: ['1', '2', '3'],
      shapes: ['img/circle.png', 'img/diamond.png', 'img/square.png'],
      show_end_rest_button: true,
      data: {
        target_shape: targetShape,
        correct_response: shapes.indexOf(targetShape) + 1
      },
      on_finish: function(data) {
        if (!data.end_rest) {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
        }
      },
    });
  }

  return trials;
}


// cue that task will stay
var cue_stay = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You will now begin the rest break. At the end of this rest break, you will continue with the same game. </p>',
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
  stimulus: '<p> You will now begin the rest break. At the end of this rest break, you will switch to the other game. </p>',
  choices: "ALL_KEYS",
  trial_duration: 5000,
  on_finish: function(data){
    rest_ended = false
    console.log(rest_ended)
  }
}

// Create self-paced rest timeline
function createSelfPacedRestTimeline(cue) {
  var cue_timeline = cue === "switch" ? cue_switch : cue_stay;
  var rest_timeline = rest_task_createTrials(max_num_rest_trials_per_block);
  
  var self_paced_rest_procedure = {
    timeline: rest_timeline,
    loop_function: function(data) {
      // Check if the last trial was ended by the "End Rest" button
      var last_trial = data.values().slice(-1)[0];
      if (rest_ended == true || last_trial.end_rest == true) {
        console.log('ended in loop')
        rest_ended = true
        return false; // This will end the loop immediately
      } else {
        rest_ended = false
      }
      // Continue the loop if the trial wasn't ended by the button
      return true;
    },
    conditional_function: function() {
      console.log("conditioning")
      return !shouldTrialRun()
    },
    on_finish: function(data) {
      var rest_duration = data.last(1).time_elapsed - data.first(1).time_elapsed;
      jsPsych.data.addProperties({rest_duration: rest_duration});
      console.log("in on finish")
      rest_ended = false
    }
  };

  return {timeline: [cue_timeline, self_paced_rest_procedure]};
}


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
      data: {
        target_shape: targetShape,
        correct_response: shapes.indexOf(targetShape) + 1
      },
      on_finish: function(data) {
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
        data.type = "rest_practice"
      }
    });
  }

  return trials;
}

  var rt_practice = {timeline: practice_rest_task_createTrials(num_practice_trials)}

