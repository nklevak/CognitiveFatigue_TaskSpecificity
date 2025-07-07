// Initialize jsPsych.
var jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function() {
      // Add interactions to the data variable
      var interaction_data = jsPsych.data.getInteractionData();
      jsPsych.data.get().addToLast({interactions: interaction_data.json()});
  
      // Display jsPsych data in viewport.
      jsPsych.data.displayData();
    },
    on_start: function(){
      document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
    }
  });

// WELCOME TO EXPERIMENT
var welcome_practice_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to this experiment! In this experiment, you will be playing two games. Before we begin the actual experiment, let\'s do some practice rounds.</p><br>\
      We will begin with the first game."
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// // consent form (the full one will have been signed already before they began)
// var consent_form = {
//   type: jsPsychSurveyMultiChoice,
//   preamble: '<p>Welcome! Thank you for agreeing to take part in this study. If you consent to participating, please click the option below. If not, please exit out of the experiment.</p>',
//   questions: [
//     {
//       prompt: "Are you willing to take part in this study?", 
//       name: 'Consent_response', 
//       options: ['I agree to take part in this study.','I do not agree.'], 
//       required: true,
//       horizontal: true
//     }, 
//   ],
//   on_start: function(){
//     document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
//   }
// }

// SPATIAL RECALL TASK INSTRUCTIONS (before each SR block)
var sr_task_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>We will now practice the memory game! Click next for the instructions.</p>",
      "<p>In this game you will see a grid of squares that will flash blue one at a time.</p><p>Your goal is to remember the order in which the squares flashed blue.</p><p>At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>",
      `<p>Do your best to memorize the order, but do not write them down<br>or use any other external tool to help you remember.</p><p>If you make a mistake, click the "Clear" button to erase your entries.</p><p>When you're ready, click "Next" to get started.</p>`
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next',
    on_finish: function(){
      document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
      jsPsych.setProgressBar(0);
    }
  }

  // TRANSITION BETWEEN GAMES IN PRACTICE SESSION
  var practice_transition = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p> Great work! You will now practice for the search game. Press any key to continue. </p>',
    choices: "ALL_KEYS",
    on_start: function(){
      document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
    },
    trial_duration: 5000,
  }

// MAIN EXPERIMENT INSTRUCTIONS + BDM
var main_exp_BDM_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Great work on completing the practice! We will now go into instructions for the main experiment.</p>",
      "<p>Please do your best to understand the tasks and experiment, as <strong>you will be given a monetary bonus based on your performance in this experiment.</strong>\
      You will not be shown this bonus until the end.</p>",
      "<p>You will also get an endowment of 500 points to begin with, which you can use as currency in this experiment.\
      These points are valuable, and they represent your ability to make choices during the experiment. \
      However, do not worry too much about holding onto every single point; they are meant to be used to make your experience more enjoyable.</p>",
      "<p> You will start off playing one of the games. At certain points in the experiment, you will be given the option to switch to the other game.\
       To do this, you will place a bid in points from 1 to 100. These points will come from your endowment, and this bid represents how much you value switching to the new game.</p>",
      "<p>After you place your bid, a random number will be generated. If your bid is higher than this random number, you will get to switch to the other game, and it will only use the random number of points (even if your bid was higher). \
      If your bid is lower, you will stay in the current game, and no points will be used.</p>",
      "<p>It is important to bid the true value of how much you want to switch games. This ensures that your choices reflect your true preferences. Your optimal strategy is to be honest about how many points you want to trade to switch to the other game</p>",
      "<h2>Example</h2>\
      <p><strong>Scenario</strong>: You are currently playing Game A, and you see an option to switch to Game B.</p>\
      <p><strong>Placing Your Bid</strong>: You decide how many points you are willing to spend to switch to Game B. Let us say you bid 55 points.</p>\
      <p><strong>Random Number</strong>: A random number between 1 and 100 is generated. If this number is 50, you will switch to Game B because your bid (55) is higher and it will only use 50 points. \
      If the number is 72, you will stay in Game A because your bid is lower, and no points will be used.</p><br><br><p>\
      Remember, the points are here to help you express your preferences, so use them wisely to make the most out of your experience.</p>",
      "<p>You will now be asked to answer a few questions about this, so, if necessary, please re-read the instructions before you click Next </p>"
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

// BDM QUIZ
var BDM_quiz_1 = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "Every time I get the option to switch, my offer will be compared to a randomly generated value. Which of the following is true:", 
      name: 'BDM_gen', 
      options: ['This randomly selected value is the same throughout the experiment.','This randomly selected value gets re-generated every time I am given the option to switch.','This randomly selected value will always be larger than mine.'], 
      required: true
    }
  ],
  randomize_question_order: false,
  on_finish: function(data) {
      var BDM_gen = data.response.BDM_gen; 
        if(BDM_gen == 'This randomly selected value gets re-generated every time I am given the option to switch.') {
          data.correct = true
        } else {
          data.correct = false
        }
     }
};
var BDM_q1_feedback = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function(){
    var last_resp_correct = jsPsych.data.getLastTrialData().values()[0].correct; 
    if (last_resp_correct) {
    return "<p>CORRECT: The randomly selected value that your offer will be compared to \
    will be re-generated every time you get the option to switch. </p>"
  } else {
    return "<p>INCORRECT: The randomly selected value that your offer will be compared to \
    will be re-generated every time you get the option to switch. </p>" 
  }},
  choices: ['Next']
};

var BDM_q1_loop = {
  timeline: [BDM_quiz_1, BDM_q1_feedback], 
  loop_function: function(data){ 
    if (data.values()[0].correct == true) {
        return false; 
      } else { 
        return true;
      }
  }
};

var BDM_quiz_2 = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "When I get the option to switch, the points I'm offering come from:", 
      name: 'BDM_points', 
      options: ['My initial endowment of points.','The points I have gained from being accurate in the experiment so far.','They come from nowhere. I have an infinite amount of points to give.'], 
      required: true
    }
  ],
  randomize_question_order: false,
  on_finish: function(data) {
      var BDM_points = data.response.BDM_points; 
        if(BDM_points == 'My initial endowment of points.') {
          data.correct = true
        } else {
          data.correct = false
        }
     }
};
var BDM_q2_feedback = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function(){
    var last_resp_correct = jsPsych.data.getLastTrialData().values()[0].correct; 
    if (last_resp_correct) {
    return "<p>CORRECT: The points you offer when you get the option to switch come from your initial endowment of points. </p>"
  } else {
    return "<p>INCORRECT: The points you offer when you get the option to switch come from your initial endowment of points. </p>" 
  }},
  choices: ['Next']
};

var BDM_q2_loop = {
  timeline: [BDM_quiz_2, BDM_q2_feedback], 
  loop_function: function(data){ 
    if (data.values()[0].correct == true) { 
      return false; 
      } else { 
      return true;
      }
  }
};

var BDM_quiz_3 = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "To get the best result when it comes to switching, I should:", 
      name: 'BDM_should', 
      options: ['Always offer a higher number of points than I would really want to trade to switch.', 'Always offer a lower number of points than I would really want to trade to switch.', 'Always be honest about exactly how many points I want to trade.'], 
      required: true
    },
  ],
  randomize_question_order: false,
  on_finish: function(data) {
      var BDM_should = data.response.BDM_should; 
        if(BDM_should == 'Always be honest about exactly how many points I want to trade.') {
          data.correct = true
        } else {
          data.correct = false
        }
     }
};
var BDM_q3_feedback = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function(){
    var last_resp_correct = jsPsych.data.getLastTrialData().values()[0].correct; 
    if (last_resp_correct) {
    return "<p>CORRECT: To get the best results when it comes to switching, you should always be honest about exactly how many points \
    you would be willing to trade.</p>"
  } else {
    return "<p>INCORRECT: To get the best results when it comes to switching, you should always be honest about exactly how many points \
    you would be willing to trade. </p>" 
  }},
  choices: ['Next']
};

var BDM_q3_loop = {
  timeline: [BDM_quiz_3, BDM_q3_feedback], 
  loop_function: function(data){ 
    if (data.values()[0].correct == true) { 
      return false; 
      } else { 
      return true;
      }
  }
};


var final_exp_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Great! You are now ready to begin.</p>",
      "<p>As a reminder, in this experiment you will start off with playing one of the two games you previously practiced.\
      <br><br>You will also occasionally be asked \
      how many points you want to trade to switch to the other game. \
      <br><br>If your answer is higher than our random value, you will be switched! \
      If not, you will stay in the same game</p>",
      "<p>When you're ready, press Next to begin</p>",
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next',
    on_finish: function(){
      document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
      jsPsych.setProgressBar(0);
    }
}
// EXPERIMENT SET UP VARIABLES
var sr_trials_per_block = 10
var sr_practice_trial_num = 8
var consistent_tile_duration = 350
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
    {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size: 48px;">+</p>',
      choices: 'NO_KEYS',
      trial_duration: 400,
    },
    {
      type: jsPsychSpatialRecall,
      grid_size: grid_size_constant,
      sequence: jsPsych.timelineVariable('sequence'),
      tile_duration: jsPsych.timelineVariable('tile_duration'),
      backwards: false,
      on_finish: function(data){
        data.practice = "true"
        data.game_type = "spatial_recall"
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
      on_start: function(){
        var update_to = jsPsych.getProgressBarCompleted() + sr_practice_prop_added
        jsPsych.setProgressBar(update_to);
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
  
    var response_key = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size: 48px;">+</p>',
      choices: 'NO_KEYS',
      trial_duration: 400,
    }
  
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

        var progressbar_update = jsPsych.getProgressBarCompleted() + proportion_per_trial
        jsPsych.setProgressBar(progressbar_update);
      }
    }

    timeline_sr_block.push(screenCheck,response_key,recall_sr)
  }

  return timeline_sr_block
}

// constants that are necessary
const visual_search_trials_practice = 16 // called practiceLen in og code
const visual_search_trials_block = 16 // called numTrialsPerBlock in og code
const fixationDuration = 500;
const stimStimulusDuration = 1500;
const stimTrialDuration = 2000;
const instructTimeThresh = 5; // /in seconds
var sumInstructTime = 0; // ms
var numTestBlocks = 13 // number of blocks of the main experiment
// const accuracyThresh = 0.8; // threshhold for block-level feedback
const practiceAccuracyThresh = 0.75; //threshold to proceed to test blocks, 3 out of 4 trials for .75
const rtThresh = 1250;
const missedResponseThresh = 0.1;
var expStage = "practice";// starts off here
var practiceCount = 0;
var testCount = 0;
var practiceThresh = 1;//this is how  many times they can redo practice
// for updating the progress bar:
var vs_practice_prop_added = 1/visual_search_trials_practice
var vs_test_prop_added = 1/visual_search_trials_block

// PARAMETERS FOR DECAYING EXPONENTIAL FUNCTION
var meanITI = 0.5;

function sampleFromDecayingExponential() {
  // Decay parameter of the exponential distribution λ = 1 / μ
  var lambdaParam = 1 / meanITI;
  var minValue = 0;
  var maxValue = 5;

  /**
   * Sample one value with replacement
   * from a decaying exponential distribution within a specified range.
   *
   * @param {number} lambdaParam
   * - The decay parameter lambda of the exponential distribution.
   * @param {number} minValue - The minimum value of the range.
   * @param {number} maxValue - The maximum value of the range.
   * @returns {number}
   * A single value sampled from the decaying
   * exponential distribution within the specified range.
   */
  var sample;
  do {
    sample = -Math.log(Math.random()) / lambdaParam;
  } while (sample < minValue || sample > maxValue);
  return sample;
}
// this creates the stimuli for blockLen number of trials
// should I make all of mine high load and conjunction?
// conjunction is harder, and means the distractors have the same features as target
// blockStimConditions = feature or conjunction
// blockStimNums = number of elements (8 or 16)
// blockStimTargets = 1 or 0 (if target is present or not)
// each block rn is half feature half conjunction, and half of each of those is present/nonpresent and 8/16
function createStimArrays(blockLen) {
    console.log("called")
    let blockStimConditions_t = [];
    let blockStimNums_t = [];
    let blockStimTargets_t = [];
  
    const halfLen = blockLen / 2;
    const quarterLen = blockLen / 4;
  
    for (let i = 0; i < blockLen; i++) {
      // OLD: Alternate between "feature" and "conjunction"
      // blockStimConditions_t.push(i < halfLen ? "feature" : "conjunction");
      // NEW: to make it harder, make them all conjunctoin
      blockStimConditions_t.push("conjunction");

      // OLD: For each condition, half "8" and half "24"
      // can change this distribution later
      // NEW: make all of them 24

      // if (i % quarterLen < quarterLen / 2) {
      //   blockStimNums_t.push(8);
      // } else {
      //   blockStimNums_t.push(24);
      // }
      blockStimNums_t.push(24);

      // For each condition, half "1" and half "0"
      if (i % (quarterLen / 2) < quarterLen / 4) {
        blockStimTargets_t.push(1);
      } else {
        blockStimTargets_t.push(0);
      }
    }
    console.log(blockStimConditions_t)
  
    return [blockStimConditions_t, blockStimNums_t, blockStimTargets_t];
  }

// variables
// not sure if I actually need these for this
var trialTargetPresent;
var condition;
var numberStim;
// more necessary variables
function getExpStage() {
    return expStage
};
function getCurrCondition(){
    return condition
};
function getInstructFeedback(){
    return   `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;
}

function getFeedback(){
  return `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`
};
// right now I don't assign group index (which counterbalances , and .) so my group index is always 1
var group_index =
  typeof window.efVars !== "undefined" ? window.efVars.group_index : 1;
var possibleResponses;

function shuffleArray(array) {
    // Create a copy of the original array
    const shuffledArray = [...array];

    // Perform Fisher-Yates shuffle
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

// uses generateHTML() function to create each stimuli html for each one in a block
function getStims(blockStimNums_t,blockStimTargets_t,blockStimConditions_t,length) {
    console.log(blockStimNums_t.length)
    console.log(blockStimTargets_t.length)
    console.log(blockStimConditions_t.length)
    console.log(length)

    const containerWidth = window.innerWidth * 0.7;
    const containerHeight = window.innerHeight * 0.7;
    const boxWidth = 40;
    const boxHeight = 80;
    var stims = [];
  
    for (var i = 0; i < length; i++) {
      const targetPresent = blockStimTargets_t.shift();
      const stimCondition = blockStimConditions_t.shift();
      const stimNum = blockStimNums_t.shift();
      const targetIndex = Math.floor(Math.random() * stimNum);
      const html = generateHTML(
        containerWidth,
        containerHeight,
        targetPresent,
        targetIndex,
        boxWidth,
        boxHeight,
        stimCondition,
        stimNum
      );
  
      var obj = {
        html: html,
        targetPresent: targetPresent,//im not sure what targetPresent means when its 0 or 1 
        condition: stimCondition,
        stimNum: stimNum,
      };
  
      stims.push(obj);
    }
    stims = shuffleArray(stims)
  
    return stims;
}

// gets an individual stim's html
// for practice runs
function getStim_practice() {
    stim = blockStims_p.shift();
    trialTargetPresent = stim.targetPresent;
    condition = stim.condition;
    numberStim = stim.stimNum;
    return stim.html;
}
// for test runs
function getStim() {
    stim = blockStims.shift();
    trialTargetPresent = stim.targetPresent;
    condition = stim.condition;
    numberStim = stim.stimNum;
    return stim.html;
}
function getStim_withData(){
    return blockStims.shift();
}

function getCurrBlockNum() {
    return getExpStage() === "practice" ? practiceCount : testCount
}

// parses the html to understand the id of a single stim 
function getStimProperties(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const divs = doc.querySelectorAll(".container > div");
    const ids = Array.from(divs).map(div => div.id);
  
    const parsedIDList = ids.map(item => {
      if (item === "black-distractor-element") {
        return "black vertical";
      } else if (item === "white-distractor-element") {
        return "white horizontal";
      } else if (item === "target") {
        return "white vertical";
      }
    });
  
    return parsedIDList;
}

// what is this for?
const getTargetLocation = arr => arr.indexOf("white vertical");

// make the html string for a visual search trial
function generateHTML(
    containerWidth,
    containerHeight,
    targetPresent,
    targetIndex,
    boxWidth,
    boxHeight,
    stimCondition,
    stimNum
  ) {
    let html;
  
    html =
      '<div class="container" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: ' +
      containerWidth +
      "px; height: " +
      containerHeight +
      'px;">';
  
    const positions = [];
    let rows;
    let cols;
  
    if (stimNum === 8) {
      rows = 4;
      cols = 2;
    } else if (stimNum === 24) {
      rows = 6;
      cols = 4;
    } else {
      throw new Error("Invalid value of n. Only 8 or 24 is supported.");
    }
  
    const spacingX = (containerWidth - cols * boxWidth) / (cols + 1);
    const spacingY = (containerHeight - rows * boxHeight) / (rows + 1);
  
    for (let i = 0; i < stimNum; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
  
      const left = spacingX * (col + 1) + col * boxWidth;
      const top = spacingY * (row + 1) + row * boxHeight;
  
      positions.push({ left, top });
  
      if (i === targetIndex && targetPresent) {
        html += generateTargetElement(left, top, boxWidth, boxHeight);
      } else {
        html += generateDistractorElement(
          left,
          top,
          boxWidth,
          boxHeight,
          stimCondition
        );
      }
    }
  
    html += "</div>";
  
    return html;
}
function generateTargetElement(left, top, width, height) {
    return (
      '<div id="target" class="box" style="position: absolute; left: ' +
      left +
      "px; top: " +
      top +
      "px; width: " +
      width +
      "px; height: " +
      height +
      'px; background-color: white;"></div>'
    );
}
function generateDistractorElement(left, top, width, height, stimCondition) {
    if (stimCondition === "feature") {
      return (
        '<div id="black-distractor-element" class="box" style="position: absolute; left: ' +
        left +
        "px; top: " +
        top +
        "px; width: " +
        width +
        "px; height: " +
        height +
        'px; background-color: black;"></div>'
      );
    } else if (stimCondition === "conjunction") {
      if (Math.random() < 0.5) {
        return (
          '<div id="white-distractor-element"  class="box" style="position: absolute; left: ' +
          left +
          "px; top: " +
          top +
          "px; width: " +
          width +
          "px; height: " +
          height +
          'px; background-color: white; transform: rotate(90deg); transform-origin: center;"></div>'
        );
      } else {
        return (
          '<div id="black-distractor-element"  class="box" style="position: absolute; left: ' +
          left +
          "px; top: " +
          top +
          "px; width: " +
          width +
          "px; height: " +
          height +
          'px; background-color: black;"></div>'
        );
      }
    }
}

// maps comma and period (since i dont have a group index this is always 1 for me)
// this means right now . == target is present, , == target is absent
function getKeyMappingForTask(group_index) {
    if (group_index % 2 === 0) {
      // // Assuming even group_index uses ",", odd group_index uses "."
      // possibleResponses = [
      //   ["index finger", ",", "comma key (,)"],
      //   ["middle finger", ".", "period key (.)"],
      // ];
      
      // Assuming even group_index uses ",", odd group_index uses "."
      possibleResponses = [
        ["left", "q", "q key"],
        ["right", "p", "p key"],
      ];
    } else {
      // // Assuming even group_index uses ",", odd group_index uses "."
      // possibleResponses = [
      //   ["middle finger", ".", "period key (.)"],
      //   ["index finger", ",", "comma key (,)"],
      // ];

      // Assuming even group_index uses ",", odd group_index uses "."
      possibleResponses = [
        ["right", "p", "p key"],
        ["left", "q", "q key"],
      ];
    }
  }
getKeyMappingForTask(group_index);
const choices = [possibleResponses[0][1], possibleResponses[1][1]];

// I got rid of endText, feedbackInstructText
const vs_instruct_reminder_text = `<div class="centerbox">
<p class="block-text">Place your left hand on the <b>q key</b> and your right hand on the <b>p key</b></p>
<p class="block-text">If you determine the vertical white rectangle is <b>${
  possibleResponses[0][0] == "right" ? "present" : "absent"
}</b>, press <b>p</b>, and if you determine a target is <b>${
  possibleResponses[0][0] == "right" ? "absent" : "present"
}</b>, press <b>q</b></p>
`

var speedReminder =
  "<p class = block-text>Try to respond as quickly and accurately as possible.</p>";
const pageInstruct = [
    `<div class="centerbox">
      <p class="block-text">We will now practice the search game!</p>
      <p class="block-text">Place a finger on your left hand on the <b>q key</b> and a finger on your right hand on the <b>p key</b></p>
      <p class="block-text">During this task, on each trial rectangles will appear on the screen. The rectangles can be either black or white in color.</p>
      <p class="block-text">On some trials, <b>one</b> of these rectangles will be a <b>vertical white rectangle</b>. We will call this rectangle the 'target'.</p>
      <div style="display: flex; align-items: center; justify-content: center; padding-top: 80px; padding-bottom: 80px;">
      <p style="width: 70%; font-size: 24px;">The target looks like: </p>
      <div style="display: flex; justify-content: center; align-items: center; width:100%;">
      <div id="target" class="box" style="background-color:white; width:40px; height:80px;"></div>
      </div>
      </div>
      </div>
      `,
    `
    <div class="centerbox">
      <p class="block-text">Your task is to determine whether the vertical white rectangle is ${
        possibleResponses[0][0] == "right" ? "present" : "absent"
      } or ${
        possibleResponses[0][0] == "right" ? "absent" : "present"
      } on each trial.</p>
      <p class="block-text">If you determine the vertical white rectangle (the target) is <b>${
        possibleResponses[0][0] == "right" ? "on the screen (present)" : "not on the screen (absent)"
      }</b>, press <b>p</b>, and if you determine a target is <b>${
        possibleResponses[0][0] == "right" ? "not on the screen (absent)" : "on the screen (present)"
      }</b>, press <b>q</b>.</p>
      <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the main game, so make sure you understand the instructions before moving on.</p>
      ${speedReminder}
    </div>`,
  ];
const promptText = `
<p class="bottom-right" style="font-size: 16px; line-height: 80%;">Target ${
    possibleResponses[0][0] == "right" ? "is present" : "is absent"
}: p</p></div>
<p class="bottom-left" style="font-size: 16px; line-height: 80%;">Target ${
    possibleResponses[0][0] == "right" ? "is absent" : "is present"
}: q</p>`;
const promptTextList = `
<ul style="text-align: left; font-size: 24px;">
<li>Target ${
    possibleResponses[0][0] == "right" ? "present" : "absent"
}: p</li>
<li>Target ${
    possibleResponses[0][0] == "right" ? "absent" : "present"
}: q</li>
</ul>`;

// setting first value for feature/conjunction condition
const conditionArray = ["feature", "conjunction"];
var blockStims = [];
var blockStimNums = [];
var blockStimTargets = [];
var blockStimConditions = [];

var blockStims_p = [];
var blockStimNums_p = [];
var blockStimTargets_p = [];
var blockStimConditions_p = [];

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim_practice,
    choices: choices,
    stimulus_duration: stimStimulusDuration, // 1500,
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    prompt: function () {
      return promptText;
    },
    data: function () {
      const stage = "practice"; 
      return {
        trial_id: `${stage}_trial`, 
        choices: choices, 
        trial_duration: stimTrialDuration,
        stimulus_duration: stimStimulusDuration,
        block_num: practiceCount,
        game_type: "vs",
        practice: "true"
      };
    },
    on_finish: function (data) {
      data["target_present"] = trialTargetPresent ? 1 : 0;
      data["num_stimuli"] = numberStim;
      data["condition"] = condition;
      data["exp_stage"] = getExpStage();
      data["correct_response"] = trialTargetPresent
        ? possibleResponses[0][1]
        : possibleResponses[1][1];
  
      if (data.response !== null) {
        if (trialTargetPresent == 1) {
          if (data.response == possibleResponses[0][1]) {
            data["correct_trial"] = 1;
          } else {
            data["correct_trial"] = 0;
          }
        } else {
          if (data.response == possibleResponses[0][1]) {
            data["correct_trial"] = 0;
          } else {
            data["correct_trial"] = 1;
          }
        }
      } else {
        data["correct_trial"] = null;
      }
  
      let stimProperties = getStimProperties(data.stimulus);
      data["order_and_color_of_rectangles"] = stimProperties;
      data["target_rectangle_location"] = trialTargetPresent
        ? getTargetLocation(stimProperties)
        : null;
    },
    on_start: function(){
      var update_to = jsPsych.getProgressBarCompleted() + vs_practice_prop_added
      jsPsych.setProgressBar(update_to);
    }
  };

// instructions before task
var instructionsBlock = {
    type: jsPsychInstructions,
    pages: pageInstruct,
    allow_keys: true,
    data: {
      trial_id: "instructions",
      trial_duration: null,
      stimulus: pageInstruct,
    },
    show_clickable_nav: true,
  };

var vs_instructionNode = {
    timeline: [instructionsBlock],
  };

var feedbackText =
  "<div class = centerbox><p class = center-block-text>Press <i>enter</i> to begin practice.</p></div>";
var feedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    data: function () {
      const stage = getExpStage();
      return {
        trial_id: `${stage}_feedback`,
        exp_stage: stage,
        trial_duration: 60000,
        block_num: stage === "practice" ? practiceCount : testCount,
      };
    },
    choices: ["Enter"],
    stimulus: getFeedback,
    trial_duration: 60000,
    response_ends_trial: true,
};

var fixationBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div class="centerbox"><div class="fixation">+</div></div>',
    choices: ["NO_KEYS"],
    data: function () {
        if (getExpStage() == "practice") {
        return {
            trial_id: "practice_fixation",
            exp_stage: "practice",
            trial_duration: fixationDuration,
            stimulus_duration: fixationDuration,
            block_num: practiceCount,
        };
        } else {
        return {
            trial_id: "test_fixation",
            exp_stage: "test",
            trial_duration: fixationDuration,
            stimulus_duration: fixationDuration,
            block_num: testCount,
        };
        }
    },
    prompt: function () {
        if (getExpStage() == "practice") {
        return promptText;
        } else {
        return "";
        }
    },
    stimulus_duration: fixationDuration, // 500
    trial_duration: fixationDuration, // 500
};

var ITIms = null;// not sure what this is
// *** ITI *** //
// does this change how long the fixation shows up for by sampling from a lambda distribution?
var ITIBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
    is_html: true,
    choices: ["NO_KEYS"],
    data: function () {
      const stage = getExpStage();
      return {
        trial_id: `${stage}_ITI`,
        ITIParams: {
          min: 0,
          max: 5,
          mean: 0.5,
        },
        block_num: stage === "practice" ? practiceCount : testCount,
        exp_stage: stage,
      };
    },
    trial_duration: function () {
      ITIms = sampleFromDecayingExponential();
      return ITIms * 1000;
    },
    on_load: function () {
      function preventSlash(event) {
        if (event.key === "/" || event.key === "," || event.key === ".") {
          event.preventDefault();
        }
      }
      window.addEventListener("keydown", preventSlash);
      jsPsych.getCurrentTrial().on_close = function () {
        window.removeEventListener("keydown", preventSlash);
      };
    },
    prompt: function () {
      return getExpStage() === "practice" ? promptText : "";
    },
    on_finish: function (data) {
      data["trial_duration"] = ITIms * 1000;
      data["stimulus_duration"] = ITIms * 1000;
    },
  };
// correct or incorrect for practice trials
var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).trials[0];
      if (last.response == null) {
        return "<div class=center-box><p class=center-text>Respond Faster!</div></div>";
      }
      if (last.correct_trial == 1) {
        return "<div class=center-box><p class=center-text>Correct!</div></div>";
      } else if (last.correct_trial == 0) {
        return "<div class=center-box><p class=center-text>Incorrect!</div></div>";
      }
    },
    data: function () {
      return {
        exp_stage: "practice",
        trial_id: "practice_feedback",
        trial_duration: 500,
        stimulus_duration: 500,
        block_num: practiceCount,
      };
    },
    choices: ["NO_KEYS"],
    stimulus_duration: 500,
    trial_duration: 500,
    prompt: function () {
      return getExpStage() === "practice" ? promptText : "";
    },
};

// practice block for visual search
var practiceTrials = [];
for (let i = 0; i < visual_search_trials_practice; i++) {
  practiceTrials.push(
    fixationBlock,
    practiceTrial,
    practiceFeedbackBlock,
    ITIBlock
  );
}

var vs_practiceNode = {
    timeline: [feedbackBlock].concat(practiceTrials),
    loop_function: function (data) {
      practiceCount += 1;
  
      var sumRT = 0;
      var sumResponses = 0;
      var correct = 0;
      var totalTrials = 0;
  
      for (var i = 0; i < data.trials.length; i++) {
        if (
          data.trials[i].trial_id == "practice_trial" &&
          data.trials[i].block_num == getCurrBlockNum() - 1
        ) {
          totalTrials += 1;
          if (data.trials[i].rt != null) {
            sumRT += data.trials[i].rt;
            sumResponses += 1;
            if (data.trials[i].correct_trial == 1) {
              correct += 1;
            }
          }
        }
      }
  
      var accuracy = correct / totalTrials;
      var missedResponses = (totalTrials - sumResponses) / totalTrials;
      var avgRT = sumRT / sumResponses;
  
      // for mine, I don't care about the practiceAccuracyThresh (should I set this to 0?)
      if (accuracy >= practiceAccuracyThresh || practiceCount == practiceThresh) {
        feedbackText = `
        <div class="centerbox">
          <p class="center-block-text">We will now continue onto the rest of the experiment. Press any key.</p>
        </div>`;
  
        expStage = "test";
        return false;
      } else {
        feedbackText =
          "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 1 minute.</p>";
        if (accuracy < practiceAccuracyThresh) {
          feedbackText +=
            `<p class="block-text">Your accuracy is low. Remember: </p>` +
            promptTextList;
        }
        if (avgRT > rtThresh) {
          feedbackText += `<p class="block-text">You have been responding too slowly. Try to respond as quickly and accurately as possible.</p>`;
        }
        if (missedResponses > missedResponseThresh) {
          feedbackText += `<p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>`;
        }
  
        feedbackText +=
          `<p class="block-text">We are now going to repeat the practice round.</p>` +
          `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;
          
        return true;
      }
    },
  };

var fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
  };
var exitFullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
};

function vs_getBlock_timelineVals_all(){
    var timeline_vals = []
    var length_blockStims = blockStims.length
    for (let i = 0; i < (length_blockStims); i++){
        var temp_stim = getStim_withData()
        trialTargetPresent = temp_stim.targetPresent;
        condition = temp_stim.condition;
        numberStim = temp_stim.stimNum;

        // add it to timeline vals so you can add it to data
        timeline_vals.push({
            stimulus: temp_stim.html,
            target_present: trialTargetPresent,
            condition: condition,
            numberStim: numberStim
        });
    }
    return timeline_vals
}

var trialCounter = 0
function vs_getBlock(){
    var trial_t = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: choices,
        stimulus_duration: stimStimulusDuration, // 1500,
        trial_duration: stimTrialDuration, // 1500
        response_ends_trial: false,
        prompt: function () {
          return promptText;
        },
        // prompt: "",
        data: function () {
          const stage = "test"; 
          return {
            trial_id: `${stage}_trial`, 
            choices: choices, 
            trial_duration: stimTrialDuration,
            stimulus_duration: stimStimulusDuration,
            block_num: testCount,
            game_type: "vs",
            target_present: jsPsych.timelineVariable('target_present'),
            condition: jsPsych.timelineVariable('condition'),
            numberStim: jsPsych.timelineVariable('numberStim'),
            practice: "false"
          };
        },
        on_finish: function (data) {
            // data["target_present"] = trialTargetPresent ? 1 : 0;
            // data["num_stimuli"] = numberStim;
            // data["condition"] = condition;
            data["exp_stage"] = "test";
            data["correct_response"] = data["target_present"]
              ? possibleResponses[0][1]
              : possibleResponses[1][1];
        
            if (data.response !== null) {
              if (data["target_present"] == 1) {
                if (data.response == possibleResponses[0][1]) {
                  data["correct_trial"] = 1;
                } else {
                  data["correct_trial"] = 0;
                }
              } else {
                if (data.response == possibleResponses[0][1]) {
                  data["correct_trial"] = 0;
                } else {
                  data["correct_trial"] = 1;
                }
              }
            } else {
              // used to say = null, but I changed it to be = 0 (false)
              data["correct_trial"] = 0;
              data["missed_response"] = 1;
            }
        
            let stimProperties = getStimProperties(data.stimulus);
            data["order_and_color_of_rectangles"] = stimProperties;
            data["target_rectangle_location"] = trialTargetPresent
              ? getTargetLocation(stimProperties)
              : null;
            
            trialCounter += 1
            if (trialCounter >= visual_search_trials_block){
                trialCounter=0
                testCount += 1
            }

            var progressbar_update = jsPsych.getProgressBarCompleted() + vs_test_prop_added
            jsPsych.setProgressBar(progressbar_update);
        }
    }

    var block_timeline_vals = vs_getBlock_timelineVals_all()
    var full_timeline_return = {
        timeline: [fixationBlock,trial_t,ITIBlock],
        timeline_variables: block_timeline_vals,
        sample: {
            type: 'custom',
            fn: function(t){
                let starting_val = testCount * visual_search_trials_block
                return t.slice(starting_val, starting_val + visual_search_trials_block);
            }
        }
    }

    return full_timeline_return;
}



///////////////////////////////////////////////////////////////
function doInitialAssignment(){
    // for practice runs
    [blockStimConditions_p, blockStimNums_p, blockStimTargets_p] = createStimArrays(visual_search_trials_practice * practiceThresh)
    blockStims_p = getStims(
          blockStimNums_p,
          blockStimTargets_p,
          blockStimConditions_p,
          visual_search_trials_practice*practiceThresh
    );

    // for actual runs
    [blockStimConditions, blockStimNums, blockStimTargets] = createStimArrays(visual_search_trials_block * numTestBlocks)
    blockStims = getStims(
          blockStimNums,
          blockStimTargets,
          blockStimConditions,
          visual_search_trials_block*numTestBlocks
        );
}

doInitialAssignment()





















// important variables to customize
var dollars_per_correct_bonus = 0.02
var num_blocks = numTestBlocks

// INITIALIZE TIMELINE
var timeline = [];

// INTRUCTIONS AND PRACTICE SESSION
//timeline.push(fullscreen,consent_form,welcome_practice_instructions,sr_task_instructions,sr_recall_forwards_practice,practice_transition,vs_instructionNode,vs_practiceNode)
timeline.push(fullscreen,welcome_practice_instructions,sr_task_instructions,sr_recall_forwards_practice,practice_transition,vs_instructionNode,vs_practiceNode)

// MAIN EXPERIMENT INSTRUCTIONS
timeline.push(main_exp_BDM_instructions, BDM_q1_loop, BDM_q2_loop, BDM_q3_loop, final_exp_instructions)

///////////////////////////////////////////////////////////
// MAIN EXPERIMENT
var generated_value = Math.floor(Math.random() * 101);
var currentTask = "spatial_recall" //(50% chance of either task being the first block) // other option is "vs"
if (Math.random() < 0.5) {
    currentTask = "vs"
}
console.log(currentTask)
var curr_block = 0
var nextSwitch = false // update this in the on_finish of the switch_offer_screen
var repeat_loop = false

// SWITCH OFFER SCREEN (where participants type in their offer instead of a sliding scale)
var repeat_message = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p style="font-size:40px;">Sorry, that was not a number between 1 and 100.</p><p style="font-size:40px;">Please press any key to try again.</p>',
    choices: "ALL_KEYS",
    trial_duration: 2000,
};
var switch_offer_screen = {
    type: jsPsychSurveyText,
    preamble: '<div style="width:500px;"><p>How many points would you pay to switch to the other game?</p></div>',
    questions: [
        {prompt: 'Enter a number from 1 to 100 here: ', 
        name: 'bid',
        required: true,}
    ],
    button_label: 'Submit bid',
    on_start: function(switch_offer_screen) {
        generated_value =  Math.floor(Math.random() * 101);
        document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
    },
    on_finish: function(data){
        cpt_ran = false
        var trade_value = jsPsych.data.get().last(1).values()[0].response.bid;
        var ans = parseInt(trade_value);
        if (!(isNaN(ans) | ans < 1 | ans > 100)) {
            data.generated_BDM_value = generated_value
            data.blocks_completed = curr_block
            data.prevBlockType = currentTask

            if (trade_value >= generated_value) {
                nextSwitch = true

                if (currentTask == "spatial_recall") {
                    currentTask = "vs"
                } else if (currentTask == "vs") {
                    currentTask = "spatial_recall"
                }
            } else {
                nextSwitch = false
            }

            data.switch_next_block = nextSwitch

            document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
            jsPsych.setProgressBar(0);
        } else {
            console.log("not valid")
        }
    }
}
var repeat_message_conditional = {
    timeline: [repeat_message],
    conditional_function: function() {
        // get last response
        var response = jsPsych.data.get().last(1).values()[0].response.bid
        // convert from text to number
        var response_num = parseInt(response);
        if (isNaN(response_num) | response_num < 1 | response_num > 100) {
            repeat_loop = true
            // return true to show the repeat_message trial
            return true;
        } else {
            repeat_loop = false
            // return false to skip the repeat_message trial
            return false;
        }
    }
}
var number_loop = {
    timeline: [switch_offer_screen, repeat_message_conditional],
    loop_function: function() {
        // repeat this timeline if 'repeat_loop' is true
        // don't repeat this timeline if 'repeat_loop' is false
        return repeat_loop;
    }
}

// final debrief 
var calculate_bonus = function(){
    // get vs trials which are NOT practice
    var vs_trials = jsPsych.data.get().filter({game_type:"vs",practice:"false",trial_id:"test_trial"}).values();

    // get sr trials which are NOT practice
    var sr_trials = jsPsych.data.get().filter({game_type:"spatial_recall",practice:"false"}).values();

    // get their accuracies
    var accuracy_count = 0
    var sr_len = sr_trials.length
    var vs_len = vs_trials.length
    var sr_correct = 0
    var vs_correct = 0

    for (let i = 0; i < sr_len;i++) {
        sr_correct = sr_correct + sr_trials[i].score_an
    }
    accuracy_count = accuracy_count + sr_correct

    for (let i = 0; i < vs_len; i++){
        vs_correct = vs_correct + vs_trials[i].correct_trial
    }
    accuracy_count = accuracy_count + vs_correct

    var total_trials = sr_len + vs_len
    var accuracy_calc = total_trials > 0 ? (accuracy_count / total_trials) : 0;    
    var final_bonus = (accuracy_count * dollars_per_correct_bonus).toFixed(2)

    var sr_accuracy_count = sr_len > 0 ? (sr_correct / sr_len) : 0;    
    var vs_accuracy_count = vs_len > 0 ? (vs_correct / vs_len) : 0;    

    // add the final accuracy and bonus to data
    jsPsych.data.get().addToLast({
        bonus: final_bonus,
        overall_accuracy: accuracy_calc,
        sr_accuracy: sr_accuracy_count,
        vs_accuracy: vs_accuracy_count
    });

    return final_bonus
}

var overall_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 
      `<p>Thanks for participating! This experiment seeked to understand how cognitive fatigue, \
      effort, errors, and task switching interact. Your final bonus (based purely on how correct you \
    were) is <strong>insert</strong>. The experiment is over now, press any button to continue</p>`,
    on_start: function(overall_debrief) {
        var bonus = calculate_bonus()

        document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";

        overall_debrief.stimulus = "<p>Thanks for participating! This experiment seeked to understand how cognitive fatigue, \
            effort, errors, and task switching interact. Your final bonus (based purely on how correct you \
          were) is $<strong>" + bonus + " dollars </strong>. The experiment is over now, press any button to continue</p>"
    }
}

// task switch or stay trials
var switchingGamesNotification = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'You will now switch to a new game',
    choices: 'NO_KEYS',  // No responses allowed
    trial_duration: 1000,
    on_start: function(switchingGamesNotification) {
        document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
        if (curr_block >= num_blocks){
            switchingGamesNotification.stimulus = "Great work! We will now debrief you."
        } else if (nextSwitch == false) {
            switchingGamesNotification.stimulus = "You will now stay in the same game."
        }
    },
    on_finish: function(){
        document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
        jsPsych.setProgressBar(0);
    }
};

var vs_filler_Notification = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: vs_instruct_reminder_text,
    choices: "NO_KEYS",
    trial_duration: 6000,
}

var vs_block_trials = vs_getBlock()
var sr_block_trials = {
    timeline: sr_getBlock()
}
var full_vs_block = {
    timeline: [vs_filler_Notification,vs_block_trials]
}
var full_sr_block = {
    timeline: [sr_block_trials]
}

// FIRST BLOCK ADD MANUALLY
if (curr_block == 0 && currentTask == "spatial_recall") {
    timeline.push(full_sr_block,number_loop,switchingGamesNotification)
    curr_block = curr_block + 1
} else {
    timeline.push(full_vs_block,number_loop,switchingGamesNotification)
    curr_block = curr_block + 1
}

// IF NODES FOR REST OF THE BLOCKS
var if_vs_node = {
    timeline: [full_vs_block],
    conditional_function: function(){
        if (curr_block == num_blocks || currentTask == "spatial_recall"){
            console.log(testCount)
            return false
        } else {
            console.log(testCount)
            curr_block = curr_block + 1
            return true
        }
    }
}
var if_sr_node = {
    timeline: [full_sr_block],
    conditional_function: function(){// if return true, this timeline gets run if not it gets skipped
        // currentTask will get updated in the switch_offer_screen on finish, so don't need to worry about switch or no switch here
        if (curr_block == num_blocks || currentTask == "vs"){
            return false
        } else {
            curr_block = curr_block + 1
            return true
        }
    }
}

// make the final survey here 
var bidding_debrief = {
    type: jsPsychSurveyText,
    preamble: `<p>In this experiment you were asked to bid on how many points you'd trade to switch games.</p>`,
    questions: [
      {prompt: 'How did you decide how many points to bid?', rows: 5,name: 'bid_decision'},
      {prompt: 'Did your strategy change over time?', rows: 5,name: 'bid_strategy'},
      {prompt: 'Were you trying to conserve points?', rows: 5,name: 'bid_conserve'}
    ]
  }

var task_debrief = {
    type: jsPsychSurveyText,
    preamble: `<p>In this experiment you played two games.</p>`,
    questions: [
      {prompt: 'Did you prefer one over the other? Why?', rows: 5,name: 'game_description'},
    ]
  }

var sr_debrief = {
    type: jsPsychSurveyText,
    preamble: `<p>One of the games you played was the memory game, where you had to memorize the squares on a grid in order of appearance.</p>`,
    questions: [
        {prompt: 'On a scale of 1 to 100, how <strong>boring</strong> did you find this game? 100 is very boring, 1 is not boring at all.',name: 'sr_boring'},
        {prompt: 'On a scale of 1 to 100, how <strong>difficult</strong> did you find this game? 100 is very difficult, 1 is not difficult at all', name: 'sr_difficult'}
    ]
}

var vs_debrief = {
    type: jsPsychSurveyText,
    preamble: `<p>One of the games you played was the search game, where you had to press a button if a vertical white rectangle was on the screen.</p>`,
    questions: [
        {prompt: 'On a scale of 1 to 100, how <strong>boring</strong> did you find this game? 100 is very boring, 1 is not boring at all.',name: 'vs_boring'},
        {prompt: 'On a scale of 1 to 100, how <strong>difficult</strong> did you find this game? 100 is very difficult, 1 is not difficult at all', name: 'vs_difficult'}
    ]
}

var debrief_timeline = [bidding_debrief, task_debrief, sr_debrief, vs_debrief, overall_debrief]

var if_debrief_node = {
    timeline: debrief_timeline,
    conditional_function: function() {
        if (curr_block == num_blocks){
            return true
        } else {
            return false
        }
    }
}

// add the main experiment
var main_loop = {
    timeline: [if_vs_node, if_sr_node, number_loop,switchingGamesNotification,if_debrief_node],
    loop_function: function(data){
        if (curr_block >= num_blocks) {
            return false
        } else {
            return true
        }
    }
}
timeline.push(main_loop)
timeline.push(exitFullscreen)
// RUN THE EXPERIMENT
jsPsych.run(timeline);


