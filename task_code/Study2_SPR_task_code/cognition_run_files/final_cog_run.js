// link: https://jub9l0zavv.cognition.run

// MAIN EXPERIMENT SET UP VARIABLES
var sr_trials_per_block = 10
var sr_practice_trial_num = 4
// MAIN EXPERIMENT SET UP VARIABLES
var ds_trials_per_block = 10
var ds_practice_trial_num = 4
var response_time_max = 4000 // in ms
// MAIN EXPERIMENT SET UP VARIABLES
var max_num_rest_trials_per_block = 20
var rest_num_practice_trials = 4
var num_groups = 10
var num_blocks_per_group = 3
var bonus_minimum = 1
var dependent_bonus = 2

// GROUP ORDER: ABABBABAAB

// Initialize jsPsych.
var jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function() {
      
      // Add interactions to the data variable
      //var interaction_data = jsPsych.data.getInteractionData();
      //jsPsych.data.get().addToLast({interactions: interaction_data.json()});
  
      // Display jsPsych data in viewport.
      //jsPsych.data.displayData();
    },
    on_start: function(){
      //document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
    },
    on_finish: function(){
      window.location = "https://app.prolific.com/submissions/complete?cc=CEAKMHC3"
    }
  });

//################ FILE ENDS ########################################## 

// INTRO AND BEFORE PRACTICE
// make a prolific id place for them to enter
var prolific_id_insert = {
  type: jsPsychSurveyText,
  preamble: `<div class="instructions-container">
    <h1 class="instructions-heading">Welcome!</h1>
    <p class="instructions-text">Please enter your Prolific ID below:</p>
  </div>`,
  questions: [
    {prompt: 'Enter here:', rows: 1, name: 'prolific_id'},
  ]
}

// welcome screen for experiment
var welcome_practice_instructions = {
    type: jsPsychInstructions,
    pages: [
      `<div class="instructions-container">
        <h1 class="instructions-heading">Welcome to the experiment!</h1>
        <p class="instructions-text">Important: This experiment must be completed in fullscreen mode. 
        Please do not exit fullscreen mode during the experiment as this will break the experiment 
        and you will need to start over. It might help to put your computer/laptop on do not disturb.</p>
      </div>`,
      `<div class="instructions-container">
        <p class="instructions-text">In this experiment, you will be playing two games&mdash;<b>Game A</b> and <b>Game B</b>. <br>\
        You will also be given rest breaks, during which you will do the <b>Rest Game</b>.</p>
        <p class="instructions-text">You will be paid 12 dollars / hour, plus a bonus of up to 4 dollars, and \
        regardless of your choices during this experiment, it will be approximately 54 minutes. </p>
        <p class="instructions-text">Before we begin, let's do some practice of the games. We will begin with <b>Game A</b></p>
      </div>`
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// practice instructions
SR_practice = [
  `<div class="instructions-container">
    <h1 class="instructions-heading">Square Game</h1>
    <p class="instructions-text">In this game you will see a grid of squares that will flash blue one at a time.\
    Your goal is to remember the order in which the squares flashed blue. \
    At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>
  </div>`,
  `<div class="instructions-container">
    <p class="instructions-text">Do your best to memorize the order, but do not write them down or use any other \
    external tool to help you remember.\
    If you make a mistake, click the "Clear" button to erase your entries.</p>
    <p class="instructions-text">When you're ready, click "Next" to get started.</p>
  </div>`
]

DS_practice = [
`<div class="instructions-container">
  <h1 class="instructions-heading">Digit Game</h1>
  <p class="instructions-text">You will see a sequence of 4 digits shown one at a time.</p>
  <p class="instructions-text">After the sequence, use the on-screen keypad to enter the digits in the <b>same order</b> they were presented to you.</p>
  <p class="instructions-text">Press any key to begin.</p>
</div>`
]

rest_practice = [
`<div class="instructions-container">
  <h1 class="instructions-heading">Rest Game</h1>
  <p class="instructions-text">You have completed the practice for the two main games, Game A and Game B!</p>
  <p class="instructions-text">Now, you will practice the rest game, which will be shown to you during rest breaks.</p>
  <p class="instructions-text">Unlike Game A and Game B, do not worry about getting everything correct in the Rest Game. \
  As long as make an attempt to answer most of the trials, you will get credit.</p>
</div>`,
`<div class="instructions-container">
  <p class="instructions-text">In this game, you will see two shapes with numbers underneath them. \
  You will be asked about the number under one of the shapes.</p>
  <div style="display: flex; justify-content: center; gap: 10px; margin: 0;">
    <div class="shape-container"><img src="Circle.png" style="width: 50px;"><br>1</div>
    <div class="shape-container"><img src="Square.png" style="width: 50px;"><br>2</div>
</div>
  <p class="instructions-text">Press the <b>corresponding number key</b> when a specific shape is listed.</p>
  <p class="instructions-text"><b>In the actual experiment, you will be able to end the rest at any time by clicking the \
  "End Rest" button that will appear in the top right corner, but for the practice it will not be visible.<b></p>
  <p class="instructions-text">Press Next to begin the practice.</p>
</div>`
]

// practice transition between A and B
var practice_transition = {
type: jsPsychHtmlKeyboardResponse,
stimulus: `<div class="instructions-container">
  <p class="instructions-text">Great work! You will now practice for <b>Game B</b>. Press any key to continue.</p>
</div>`,
choices: "ALL_KEYS",
on_start: function(){
  document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
},
trial_duration: 5000,
}

// rest task practice instructions and transition
var rest_practice_instructions = {
type: jsPsychInstructions,
pages: rest_practice,
key_forward: 'ArrowRight',
key_backward: 'ArrowLeft',
allow_keys: true,
show_clickable_nav: true,
button_label_previous: 'Prev',
button_label_next: 'Next',
on_finish: function(){
  document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  //jsPsych.setProgressBar(0);
}
}

// POST PRACTICE INSTRUCTIONS
// main experiment instructions
var main_exp_instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions-container">
      <h1 class="instructions-heading">Main Experiment</h1>
      <p class="instructions-text">Great work on completing the practice! We will now go into instructions for the main experiment.</p>
    </div>`,
    `<div class="instructions-container">
      <h1 class="instructions-heading">Experiment Structure</h1>
      <p class="instructions-text">In this experiment, you will be switched between playing Game A and Game B, \
      with some rest periods in between (during which you will play the rest game).
      You will start off by playing Game A. At certain points of the experiment, you will be notified that you are 
      about to enter a <strong>rest period</strong>, and will be told which game (A or B) will occur after the rest period is over.</p>
      <p class="instructions-text">When you enter the rest period, you will be able to remain in rest and play the rest game for up \
      to 30 seconds. <b>Once you're ready to leave rest, you can press the "End Rest" button in the top right corner</b>. /
      You should stay in the rest game for as long as you need or want, but be aware that staying longer will be costly.</p>
    </div>`,
    `<div class="instructions-container">
      <h1 class="instructions-heading">The point system and bonus</h1>
  
      <p class="instructions-test">Please try your best each trial of each game; as long as it is clear you did your best, you will get an initial bonus of at least 1 dollar.</p>
      <p class="instructions-text">You can gain an extra bonus of 2 additional dollars (bringing the total up to 3). \
      To do so: you will get an endowment of <b>600 points</b> to begin with, which you can use as currency in this experiment.\
      These points are valuable, and <b>they represent your ability to rest for longer during the experiment.</b> \
      During the rest game, <b>every rest trial you use will use 1 point from your endowment</b> and at the end of the game, \
      the proportion remaining of your endowment will be converted to the extra 2 dollar bonus. \
      However, <strong>do not worry too much about holding onto every single point; they are meant to be used to make your experience more enjoyable.</strong></p>
    </div>`,
    `<div class="instructions-container">
      <h1 class="instructions-heading">Important Notes</h1>
      <p class="instructions-text">1) The experiment is set to be exactly 55 minutes long (no matter how much time is spent on the rest game vs the two games), so please
      feel free to extend rest whenever you feel you need to--taking into consideration that it will take away points from your endowment. \
      <br><br>2) Your base bonus is not tied to your accuracy performance, but you will receive it as long as it is \
      clear that you tried your best on the experiment. </p>
    </div>`,
    `<div class="instructions-container">
      <h1 class="instructions-heading">Ready to Begin</h1>
      <p class="instructions-text">Re-read the instructions if necessary, and press continue when you are ready to begin the main experiment!</p>
    </div>`
  ],
key_forward: 'ArrowRight',
key_backward: 'ArrowLeft',
allow_keys: true,
show_clickable_nav: true,
button_label_previous: 'Prev',
button_label_next: 'Next',
on_start: function(){
  document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
}
}

var exitFullscreen = {
type: jsPsychFullscreen,
fullscreen_mode: false,
};


// cue that task will stay
var rest_leftovers_transition = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You have completed the main experiment! Now you will do the leftover rest trials that you skipped earlier. </p>',
  choices: "ALL_KEYS",
  trial_duration: 2000,
}
//################ FILE ENDS ########################################## 

// SR specific set up variables:
var consistent_tile_duration = 275
var grid_size_constant = 4
var digits_to_mem = 4

///////////////////////////////////////////////////////////////
////// SET UP GRID DIFFICULTY TO BE MAX_TILE_DURATION & CREATE num_trials TRIALS
// this function sets up the timing of each trial. 
// IF CHANGE_DIFFICULTY = TRUE: It will start with the max duration for the first group of 5. Then for every subsequent group it will sample from prev_group - 100 +/- 50.
// IF CHANGE_DIFFICULTY = FALSE (default): it will give every trial the given max_tile_duration
function getGridParams(num_trials,max_tile_duration,change_difficulty=false) {
  // Initialize an array to hold the duration of each trial
  var trialDurations = [];

  for (i=0;i < num_trials;i++) {
    trialDurations.push(max_tile_duration)
  }
  // go through the trial durations and return the timeline vals
  let timeline_full_vals = []
  trialDurations.forEach((item, _) => {
    timeline_full_vals.push({
        sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], digits_to_mem),
        tile_duration: item
    });
  });
  return timeline_full_vals
}

// PRACTICE SESSION
var sr_practice_prop_added = 1/sr_practice_trial_num
var sr_recall_forwards_practice = {
  timeline: [
    {
      type: jsPsychScreenCheck,
      min_width: 258,
      min_height: 364
    },
//    {
//      type: jsPsychHtmlKeyboardResponse,
//      stimulus: '<p style="font-size: 48px;">+</p>',
//      choices: 'NO_KEYS',
//      trial_duration: 400,
//    },
    {
      type: jsPsychSpatialRecall,
      grid_size: grid_size_constant,
      sequence: jsPsych.timelineVariable('sequence'),
      tile_duration: jsPsych.timelineVariable('tile_duration'),
      backwards: false,
      on_finish: function(data){
        data.practice = "true"
        data.game_type = "spatial_recall"
        data.trial_type = "sr_practice_response"
      }
    },
    {
      type: jsPsychHtmlKeyboardResponse,
      trial_duration: 1000,
      stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].score_an;
        if(last_trial_correct){
          return "<p>Correct!</p>"; // the parameter value has to be returned from the function
        } else {
          return "<p>Incorrect! Please try to focus on the order in which the squares appear.</p>"; // the parameter value has to be returned from the function
        }
      },
      choices: 'NO_KEYS',
      on_start: function(){
//        var update_to = jsPsych.getProgressBarCompleted() + sr_practice_prop_added
//        jsPsych.setProgressBar(update_to);
      },
      on_finish: function(data){
        data.trial_type = "sr_practice_feedback"
      }
    }
  ],
  timeline_variables: getGridParams(sr_practice_trial_num,consistent_tile_duration,false)
}

// MAIN EXPERIMENT GET BLOCK TRIALS FUNCTION
function sr_getBlock() {
  var timeline_sr_block = []
  var proportion_per_trial = 1 / sr_trials_per_block

  for (i=0; i < sr_trials_per_block; i++){
    var screenCheck={
      type: jsPsychScreenCheck,
      min_width: 258,
      min_height: 364
    }
  
    //var response_key = {
    //  type: jsPsychHtmlKeyboardResponse,
    //  stimulus: '<p style="font-size: 48px;">+</p>',
    //  choices: 'NO_KEYS',
    //  trial_duration: 400,
    //}
  
    var recall_sr = {
      type: jsPsychSpatialRecall,
      grid_size: grid_size_constant,
      sequence: jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], digits_to_mem),
      tile_duration: consistent_tile_duration,
      backwards: false,
      on_start: function(recall_sr) {
        recall_sr.sequence = jsPsych.randomization.sampleWithoutReplacement([...Array(16).keys()], digits_to_mem)
      },
      on_finish: function(data){
        data.practice = "false"
        data.game_type = "spatial_recall"
        data.trial_type = "sr_main_response"

        //var progressbar_update = jsPsych.getProgressBarCompleted() + proportion_per_trial
        //jsPsych.setProgressBar(progressbar_update);
      }
    }

    //timeline_sr_block.push(screenCheck,response_key,recall_sr)
    timeline_sr_block.push(screenCheck,recall_sr)
  }

  return timeline_sr_block
}

//################ FILE ENDS ########################################## 
// DS specific setups:
// also includes 200 ms between each digit flash
var ds_digit_duration = 275
var ds_digits_to_mem = 4

// Define the HTML for the keypad
const keypadHTML = `
<div id="custom-keypad-container" style="width: 100%; max-width: 500px; margin: 0 auto; position: static; transform: none;">
    <div id="response-display" style="font-size: 32px; margin-bottom: 2rem; height: 48px; text-align: center; position: static; transform: none;"></div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; width: 100%; position: static; transform: none;">
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black" onclick="handleDigit(1)">1</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(2)">2</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(3)">3</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(4)">4</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(5)">5</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(6)">6</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(7)">7</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(8)">8</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(9)">9</button>
        <button style="padding: 1rem; font-size: 24px; background-color: #94a3b8; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black; color: white;" onclick="handleClear()">Clear</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(0)">0</button>
        <button style="padding: 1rem; font-size: 24px; background-color: #0ea5e9; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black; color: white;" onclick="handleSubmit()">Submit</button>
    </div>
</div>
`;

// Global variables to store response
let currentResponse = [];
let currentTrial = null;
let startTime = null;

// Handler functions
function handleDigit(digit) {
    if (currentResponse.length < 4) {
        currentResponse.push(digit);
        document.getElementById('response-display').textContent = currentResponse.join(' ');
    }
}

function handleClear() {
    currentResponse = [];
    document.getElementById('response-display').textContent = '';
}

function handleSubmit() {
    if (currentResponse.length === 4) {
        // Store response before ending trial
        if (currentTrial) {
            currentTrial.data.response = currentResponse.slice();
            currentTrial.data.rt = performance.now() - startTime;
        }
        // Find and click the hidden jsPsych button
        document.querySelector('#jspsych-html-button-response-button-0').click();
    }
}

// Generate random sequence of 4 digits
function generateSequence(num_digits) {
    var seq = Array.from({length: num_digits}, () => Math.floor(Math.random() * 10));
    console.log(seq);
    return seq;
}

// Modify the digit display timeline
function createDigitDisplayTimeline(sequence) {
    let timeline = [];
    for (let digit of sequence) {
        // Add blank screen before digit
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size: 96px; min-height: 200px; display: flex; align-items: center; justify-content: center; position: static; transform: none;"></div>`,
            choices: "NO_KEYS",
            trial_duration: 200
        });

        // Show digit
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size: 96px; min-height: 200px; display: flex; align-items: center; justify-content: center; position: static; transform: none;">${digit}</div>`,
            choices: "NO_KEYS",
            trial_duration: ds_digit_duration
        });
    }
    return timeline;
}

// Response phase with keypad
function createResponsePhase(sequence, is_practice) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: keypadHTML,
        choices: ['Continue'],
        button_html: '<button style="display:none" class="jspsych-btn">%choice%</button>',
        trial_duration: response_time_max,  // 4 second timeout
        data: {
            sequence: sequence
        },
        on_start: function(trial) {
            currentResponse = [];
            currentTrial = trial;
            startTime = performance.now();
        },
        on_finish: function(data) {
            data.game_type = "digit_span"
            data.trial_type = "ds_main_response"
            data.practice = is_practice
            data.timed_out = 0 // assume it is not timed out

            if (is_practice) {
                data.trial_type = "ds_practice_response"
            }

            // If response is empty (timed out), set it to an empty array
            if (!data.response || data.response.length === 0) {
                data.response = [];
                data.is_correct = 0;
                data.timed_out = 1;
                data.rt = response_time_max; // timeout duration
            }
            data.is_correct = JSON.stringify(data.response) === JSON.stringify(data.sequence);
            console.log(JSON.stringify(data.response) === JSON.stringify(data.sequence));

            currentTrial = null;
            startTime = null;
        }
    };
}

function ds_getMainBlock(num_trials = ds_trials_per_block, num_d = ds_digits_to_mem) {
    var trials = [];

    for (let i = 0; i < num_trials; i++) {
        var sequence = jsPsych.randomization.sampleWithReplacement([...Array(10).keys()], num_d);

        // actual digit sequence
        trials.push(...createDigitDisplayTimeline(sequence));

        // Add response phase
        trials.push(createResponsePhase(sequence, false));
    }

    return trials;
}

function ds_getPracticeBlock(num_practice, num_d) {
    var trials = [];

    for (let i = 0; i < num_practice; i++) {
        var sequence = jsPsych.randomization.sampleWithReplacement([...Array(10).keys()], num_d);

        // actual digit sequence
        trials.push(...createDigitDisplayTimeline(sequence));

        // Add response phase
        trials.push(createResponsePhase(sequence, true));

        // Add feedback
        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                var last_trial = jsPsych.data.get().last(1).values()[0];
                if (last_trial.timed_out) {
                    return `
                        <div class="flex flex-col items-center justify-center">
                            <p class="text-2xl text-red-500 mb-4">Respond faster!</p>
                            <p class="text-xl">The sequence was: ${last_trial.sequence.join(' ')}</p>
                        </div>
                    `;
                }
                if (last_trial.is_correct) {
                    return `
                        <div class="flex flex-col items-center justify-center">
                            <p class="text-2xl text-green-500 mb-4">Correct!</p>
                            <p class="text-xl">The sequence was: ${last_trial.sequence.join(' ')}</p>
                            <p class="text-xl">Your response was: ${last_trial.response.join(' ')}</p>
                        </div>
                    `;
                } else {
                    return `
                        <div class="flex flex-col items-center justify-center">
                            <p class="text-2xl text-red-500 mb-4">Incorrect</p>
                            <p class="text-xl">The correct sequence was: ${last_trial.sequence.join(' ')}</p>
                            <p class="text-xl">Your response was: ${last_trial.response.join(' ')}</p>
                        </div>
                    `;
                }
            },
            choices: "NO_KEYS",
            trial_duration: 1000,
            on_finish: function(data) {
                data.trial_type = "ds_practice_feedback"
            }
        });
    }

    return trials;
}

function ds_getBlock(num_trials, num_d) {
    return {
        timeline: ds_getMainBlock(num_trials, num_d)
    }
}

var ds_practice_block = {timeline: ds_getPracticeBlock(num_practice = ds_practice_trial_num, num_d = ds_digits_to_mem)};



//################ FILE ENDS ########################################## 
// Rest specific set up variables:


const rt_instructions_01 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>In this task, you will see two shapes with numbers underneath them.</p>
    <p>You will be asked about the number under one of the shapes.</p>
    <div style="display: flex; justify-content: space-around; margin: 20px;">
      <div><img src="Circle.png" style="width: 50px;"><br>1</div>
      <div><img src="Square.png" style="width: 50px;"><br>2</div>
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

function getNumRestUsed() {
  return num_rest_used
}

function shouldTrialRun() {
  console.log('in function')
  console.log(rest_ended)
  return !rest_ended
}

function rest_task_createTrials(num_rt_trials, follows_group_num,follows_internal_block_num, type_desc) {
  const shapes = ['Circle', 'Square'];
  const trials = [];

  var rest_trial_number = 0; // records how many trials have been added
  for (let i = 0; i < num_rt_trials; i++) {
    var targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
        timeline: [{
          type: dsstWithEndRestPlugin,
          stimulus: targetShape,
          choices: ['1', '2'],
          shapes: ['Circle.png', 'Square.png'],
          show_end_rest_button: true,
          data: {
            target_shape: targetShape,
            correct_response: shapes.indexOf(targetShape) + 1,
            option_to_end: true, //whether the end rest button is visible
            rest_trial_num: rest_trial_number,
            overall_num_rest_used: getNumRestUsed(),
            follows_group_num: follows_group_num,
            follows_internal_block_num: follows_internal_block_num,
            type_desc: type_desc
          },
          on_finish: function(data) {
            console.log("end_rest: " + data.end_rest.toString());

            data.game_type = "rest_task"
            data.trial_type = "rt_main_trials";

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

// for calculating the bonus at the end
// get proportion used, and multiply it by 2 dollars
// default bonus = how much they get regardless
// bonus max = 
// make endownment = max num rest possible so that 1 point = 1 rest trial taken = 1 second of rest
function getPropRestUsed(default_bonus,bonus_max) {
  console.log("calculating bonus: num used, num possible")
  var num_used = num_rest_used
  console.log(num_used)
  var num_possible = num_groups * num_blocks_per_group * max_num_rest_trials_per_block
  console.log(num_possible)
  var final_bonus = bonus_max * (1 - num_used/num_possible) + default_bonus
  console.log(final_bonus)
  return final_bonus.toFixed(2)
}

// cue that task will stay
var cue_stay = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p  class="instructions-text"> You will now begin the rest break. <br>At the end of this rest break, <strong>you will continue with the same game.</strong> </p>',
  choices: "NO_KEYS",
  trial_duration: 1500,
  on_finish: function(data){
    data.transition_type = "stay"
    rest_ended = false
    console.log(rest_ended)
  }
}

// cue that task will switch
var cue_switch = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p  class="instructions-text"> You will now begin the rest break. <br>At the end of this rest break, <strong>you will switch to the other game.</strong> </p>',
  choices: "NO_KEYS",
  trial_duration: 1500,
  on_finish: function(data){
    data.transition_type = "switch"
    rest_ended = false
    console.log(rest_ended)
  }
}

var rest_to_game_transition= {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="instructions-container">
    <p class="instructions-text">You are done with rest! <br>You will now return to the games.</p>
  </div>`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  }

// Create self-paced rest timeline
function createSelfPacedRestTimeline(cue,follows_group_num,follows_internal_block_num, type_desc) {
  var cue_timeline = cue === "switch" ? cue_switch : cue_stay;
  var rest_timeline = rest_task_createTrials(max_num_rest_trials_per_block, follows_group_num = follows_group_num, follows_internal_block_num = follows_internal_block_num, type_desc = type_desc);
  
  var self_paced_rest_procedure = {
    timeline: rest_timeline,
    on_finish: function(data) {
    var rest_duration = data.last(1).time_elapsed - data.first(1).time_elapsed;
    data.rest_duration = rest_duration
    console.log("in on finish of createSelfPacedRestTimeline")
    rest_ended = false
    }
  };

  return {timeline: [cue_timeline, self_paced_rest_procedure, rest_to_game_transition]};
}
function practice_rest_task_createTrials(num_rt_trials) {
  const shapes = ['Circle', 'Square'];
  const trials = [];

  for (let i = 0; i < num_rt_trials; i++) {
    var targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    
    trials.push({
      timeline: [
        {
          type: dsstWithEndRestPlugin,
          stimulus: targetShape,
          choices: ['1', '2'],
          shapes: ['Circle.png', 'Square.png'],
          show_end_rest_button: false,
          data: {
            target_shape: targetShape,
            correct_response: shapes.indexOf(targetShape) + 1
          },
          on_finish: function(data) {
            data.is_correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response.toString());
            data.game_type = "rest_task";
            data.trial_type = "rt_practice_trials";
          }
        },
        {
          type: jsPsychHtmlKeyboardResponse,
          stimulus: function() {
            var last_trial = jsPsych.data.get().last(1).values()[0];
            console.log("Feedback trial data:", last_trial); // Add logging to diagnose

            if (last_trial.timed_out) {
              return `
                <div class="flex flex-col items-center justify-center">
                    <p>Incorrect! Please answer faster.</p>
                </div>
              `;
            } else if (last_trial.is_correct) {
                return `
                  <div class="flex flex-col items-center justify-center">
                      <p>Correct!</p>
                  </div>
                `;
            } else {
                return `
                  <div class="flex flex-col items-center justify-center">
                      <p>Incorrect, please click the number corresponding to the shape in bold.</p>
                  </div>
                `;
            }
          },
          choices: "ALL_KEYS",
          trial_duration: 1000,
          on_start: function(trial) {
            console.log("Feedback trial starting"); // Add more logging
          },
          on_finish: function(data) {
            data.trial_type = "rt_practice_feedback";
            console.log("Feedback trial finished"); // Add more logging
          }
        }
      ]
    });
  }

  return trials;
}


function leftover_rest_task_createTrials(num_rt_trials) {
  const shapes = ['Circle', 'Square'];
  const trials = [];

  for (let i = 0; i < num_rt_trials; i++) {
    var targetShape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1)[0];
    trials.push({
      timeline: [{
      type: dsstWithEndRestPlugin,
      stimulus: targetShape,
      choices: ['1', '2'],
      shapes: ['Circle.png', 'Square.png'],
      show_end_rest_button: false,
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
//################ FILE ENDS ########################################## 




























var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};


// MAIN EXPERIMENT SET UP VARIABLES

// IMPORTANT INITIALIZATION VARIABLES
// decides if spatial recall is game A; if gameA_SR = false, then digit span is game A and SR is game B
var gameA_SR = (jsPsych.randomization.randomInt(0,1) == 0)
var gameA = "spatial_recall"
var gameB = "digit_span"

// set the practice vars
var gameA_practice = sr_recall_forwards_practice
var gameB_practice = ds_practice_block

if (gameA_SR == 0) {
   gameA = "digit_span"
   gameB = "spatial_recall"

   gameA_practice = ds_practice_block
   gameB_practice = sr_recall_forwards_practice
}

// FUNCTIONS FOR CUSTOMIZING
// function to return instructions for either game A or game B
function getInstructions(game_type) {
  if (gameA == "spatial_recall") {
    if (game_type == "A"){
      return SR_practice
    } else{
      return DS_practice
    }
  } else { // this means gameA == "digit_span"
    if (game_type == "A"){
      return DS_practice
    } else {
      return SR_practice
    }
  }
  return ""
}

var gameA_practice_instructions = {
  type: jsPsychInstructions,
  pages: getInstructions("A"),
  key_forward: 'ArrowRight',
  key_backward: 'ArrowLeft',
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: 'Prev',
  button_label_next: 'Next',
  on_finish: function(data){
    data.game_A = gameA
    data.game_B = gameB
    //document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
    //jsPsych.setProgressBar(0);
  }
}

var gameB_practice_instructions = {
  type: jsPsychInstructions,
  pages: getInstructions("B"),
  key_forward: 'ArrowRight',
  key_backward: 'ArrowLeft',
  allow_keys: true,
  show_clickable_nav: true,
  button_label_previous: 'Prev',
  button_label_next: 'Next',
  on_finish: function(){
    //document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
    //jsPsych.setProgressBar(0);
  }
}

// preload external html file and images for rest task
var preload = {
  type: jsPsychPreload,
  message: 'Loading images. This may take a moment depending on your internet connection.',
  error_message: '<p>The experiment failed to load. Please try restarting your browser.</p><p>If this error persists after 2-3 tries, please contact the experimenter.</p>',
  continue_after_error: false,
  show_progress_bar: true,
  max_load_time: 30000,
  images: ['Circle.png','Square.png']
};

// consent form
// preload this later on cognition.run (right now it doesn't work because of access issues)
var consent_form = {
  type: jsPsychExternalHtml,
  url: "poldrack_consent_form.html",
  cont_btn: "start",
  on_finish: function(data){
    data.gameA_name = gameA
    data.gameB_name = gameB
    data.gameA_isSR = gameA_SR
  }
};

// INITIALIZE TIMELINE
var timeline = [];

// INTRUCTIONS AND PRACTICE SESSION

//timeline.push(preload,fullscreen, prolific_id_insert,welcome_practice_instructions)
timeline.push(preload,fullscreen,consent_form,prolific_id_insert,welcome_practice_instructions)

// A and B and rest practice
timeline.push(gameA_practice_instructions, gameA_practice, practice_transition, gameB_practice_instructions, gameB_practice, rest_practice_instructions, rt_practice, main_exp_instructions)

// MAIN EXPERIMENT TASKS:
// ABABBABAAB
// each A group is: A, rest, A, rest, A
// each B group is: B, rest, B, rest, B
// 10 blocks in total

// create rest timelines
//var rest_stay = createSelfPacedRestTimeline("stay")
//var rest_switch = createSelfPacedRestTimeline("switch")

// create A and B main blocks
var sr_block_trials = {
  timeline: sr_getBlock()
}
var sr_group = {
  timeline: [sr_block_trials, 
  createSelfPacedRestTimeline("stay", follows_group_num = null, follows_internal_block_num = 1, type_desc="block_same_same"), 
  sr_block_trials, 
  createSelfPacedRestTimeline("stay", follows_group_num = null, follows_internal_block_num = 2, type_desc="block_same_same"), 
  sr_block_trials]
}
//var ds_block_trials = {
//  timeline: ds_getBlock(ds_trials_per_block, ds_digits_to_mem)
//}
var ds_group = {
  timeline: [ds_getBlock(ds_trials_per_block, ds_digits_to_mem), 
  createSelfPacedRestTimeline("stay", follows_group_num = null, follows_internal_block_num = 1, type_desc="block_same_same"), 
  ds_getBlock(ds_trials_per_block, ds_digits_to_mem), 
  createSelfPacedRestTimeline("stay", follows_group_num = null, follows_internal_block_num = 2, type_desc="block_same_same"), 
  ds_getBlock(ds_trials_per_block, ds_digits_to_mem)]
}

// assign A and B main blocks
var A_block_group = sr_group
var B_block_group = ds_group
if (gameA_SR == 0) {// this means game A is actually digit span
  A_block_group = ds_group
  B_block_group = sr_group
}

//NEW ORDER: ABABBABAAB
timeline.push(
  A_block_group, createSelfPacedRestTimeline("switch", follows_group_num=1, follows_internal_block_num = 3, type_desc="group_A_B"), 
  B_block_group, createSelfPacedRestTimeline("switch", follows_group_num=2, follows_internal_block_num = 3, type_desc="group_B_A"), 
  A_block_group, createSelfPacedRestTimeline("switch", follows_group_num=3, follows_internal_block_num = 3, type_desc="group_A_B"), 
  B_block_group, createSelfPacedRestTimeline("stay", follows_group_num=4, follows_internal_block_num = 3, type_desc="group_B_B"), 
  B_block_group, createSelfPacedRestTimeline("switch", follows_group_num=5, follows_internal_block_num = 6, type_desc="group_B_A"), 
  A_block_group, createSelfPacedRestTimeline("switch", follows_group_num=6, follows_internal_block_num = 3, type_desc="group_A_B"),
  B_block_group, createSelfPacedRestTimeline("switch", follows_group_num=7, follows_internal_block_num = 3, type_desc="group_B_A"), 
  A_block_group, createSelfPacedRestTimeline("stay", follows_group_num=8, follows_internal_block_num = 3, type_desc="group_A_A"),
  A_block_group, createSelfPacedRestTimeline("switch", follows_group_num=9, follows_internal_block_num = 6, type_desc="group_A_B"), 
  B_block_group, createSelfPacedRestTimeline("switch", follows_group_num=10, follows_internal_block_num = 3, type_desc="group_B_A")
)
  
var overall_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    var current_bonus = getPropRestUsed(bonus_minimum, dependent_bonus); // calculate right here
    return `
      <div class="instructions-container">
        <h1 class="instructions-heading">Thank You!</h1>
        <p class="instructions-text">
          Thanks for participating! This experiment sought to understand how cognitive fatigue, 
          effort, errors, and task switching interact. Your final completion bonus is
          <strong>${current_bonus}</strong> dollars. The experiment is over now, press any button to continue to be redirected.
        </p>
      </div>
    `;
  },
  on_finish: function(data) {
    data.final_bonus = getPropRestUsed(bonus_minimum, dependent_bonus); // Store in data as well
  }
};
// CONCLUSION AND DEBRIEFS
// final debrief survey here 
var rest_debrief = {
  type: jsPsychSurveyText,
  preamble: `<p>Great work! We will now do a short debrief. <br><br> In this experiment you were asked to end the rest whenever you wanted.</p>`,
  questions: [
    {prompt: 'How did you decide how when to end the rest trials?', rows: 5,name: 'rest_decision'},
    {prompt: 'Did your strategy change over time?', rows: 5,name: 'rest_strategy'},
    {prompt: 'Were you trying to conserve endowment points?', rows: 5,name: 'rest_conserve'}
  ]
}

var task_debrief = {
  type: jsPsychSurveyText,
  preamble: `<p>In this experiment you played two games.</p>`,
  questions: [
    {prompt: 'Did you prefer one over the other? Why?', rows: 5,name: 'game_description'},
    {prompt: 'Did you find the rest task easier than the two main games? Please leave any feedback about this that you have!', rows: 5,name: 'game_description'},
  ]
}

timeline.push(rest_leftovers_transition, rt_leftovers, rest_debrief, task_debrief, overall_debrief, exitFullscreen)

// RUN THE EXPERIMENT
jsPsych.run(timeline);


//################ FILE ENDS ########################################