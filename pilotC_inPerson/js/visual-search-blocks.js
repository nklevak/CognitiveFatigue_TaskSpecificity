// constants that are necessary
const visual_search_trials_practice = 1 // called practiceLen in og code
const visual_search_trials_block = 4 // called numTrialsPerBlock in og code
const fixationDuration = 500;
const stimStimulusDuration = 1500;
const stimTrialDuration = 2000;
const instructTimeThresh = 5; // /in seconds
var sumInstructTime = 0; // ms
var numTestBlocks = 3 // number of blocks of the main experiment
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
      // Assuming even group_index uses ",", odd group_index uses "."
      possibleResponses = [
        ["index finger", ",", "comma key (,)"],
        ["middle finger", ".", "period key (.)"],
      ];
    } else {
      // Assuming even group_index uses ",", odd group_index uses "."
      possibleResponses = [
        ["middle finger", ".", "period key (.)"],
        ["index finger", ",", "comma key (,)"],
      ];
    }
  }
getKeyMappingForTask(group_index);
const choices = [possibleResponses[0][1], possibleResponses[1][1]];

// I got rid of endText, feedbackInstructText
const vs_instruct_reminder_text = `<div class="centerbox">
<p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
<p class="block-text">If you determine a target is <b>${
  possibleResponses[0][0] == "index finger" ? "present" : "absent"
}</b>, press your <b>index finger</b>, and if you determine a target is <b>${
  possibleResponses[0][0] == "index finger" ? "absent" : "present"
}</b>, press your <b>middle finger</b>.</p>
`

var speedReminder =
  "<p class = block-text>Try to respond as quickly and accurately as possible.</p>";
const pageInstruct = [
    `<div class="centerbox">
      <p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
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
      <p class="block-text">Your task is to determine whether a target is ${
        possibleResponses[0][0] == "index finger" ? "present" : "absent"
      } or ${
        possibleResponses[0][0] == "index finger" ? "absent" : "present"
      } on each trial.</p>
      <p class="block-text">If you determine a target is <b>${
        possibleResponses[0][0] == "index finger" ? "present" : "absent"
      }</b>, press your <b>index finger</b>, and if you determine a target is <b>${
        possibleResponses[0][0] == "index finger" ? "absent" : "present"
      }</b>, press your <b>middle finger</b>.</p>
      <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
      ${speedReminder}
    </div>`,
  ];
const promptText = `
<div class="prompt_box">
<p class="center-block-text" style="font-size: 16px; line-height: 80%;">Target ${
    possibleResponses[0][0] == "index finger" ? "target is present" : "target is absent"
}: comma key (,)</p>
<p class="center-block-text" style="font-size: 16px; line-height: 80%;">Target ${
    possibleResponses[0][0] == "index finger" ? "target is absent" : "target is present"
}: period key (.)</p>
</div>`;
const promptTextList = `
<ul style="text-align: left; font-size: 24px;">
<li>Target ${
    possibleResponses[0][0] == "index finger" ? "present" : "absent"
}: comma key (,)</li>
<li>Target ${
    possibleResponses[0][0] == "index finger" ? "absent" : "present"
}: period key (.)</li>
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