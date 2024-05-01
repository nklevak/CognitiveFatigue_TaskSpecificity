// WELCOME TO EXPERIMENT
var welcome_practice_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to this experiment! In this experiment, you will be doing two tasks. Before we begin the actual experiment, let\'s do some practice trials.</p>"
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// CONSENT FORM

// SPATIAL RECALL TASK INSTRUCTIONS (before each SR block)
var sr_task_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to the spatial recall game! Click next for the instructions.</p>",
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

// GRADCPT TASK INSTRUCTIONS (before each gradcpt block)
var cpt_task_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to the gradual onset game! Click next for the instructions.</p>",
      "<p>In this task, an image will appear in the center of the screen.</p><p>\
      If the image is a <strong>city</strong> press enter on the keyboard as fast as you can.</p><p>\
      If the image is a <strong>mountain</strong>, do not press a key.</p>\
      <div style='width: 700px;'><div style='float: left;'><img src='./img900_esterman/city_1.jpg'></img>\
      <p class='small'><strong>Press the enter key</strong></p></div>\
      <div style='float: right;'><img src='./img900_esterman/mountain_1.jpg'></img>\
      <p class='small'><strong>Do not press a key</strong></p></div>\
      </div>",
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// FEEDBACK FOR THE GRADCPT PRACTICE

// FEEDBACK FOR THE SPATIAL RECALL PRACTICE

// MAIN EXPERIMENT INSTRUCTIONS + BDM
var main_exp_BDM_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>We will now go into instructions for the main experiment.</p>",
      "<p>You will be given points based on your accuracy in each trial, which will be converted to a monetary bonus at the end of the experiment. \
      You will not be shown how many points you have until the end.</p><p>",
      "<p>In this experiment, you will be switching between the two games you practiced earlier. You will occasionally be asked how many points \
      (on a scale of 1 to 100)  you are willing to give away in order to switch to the other game</p>",
      "<p>Think of this like an auction. We will also randomly generate a value from 1 to 100 each time you pick a value, and if your selection is \
      larger <strong>you will get to switch games</strong> and <strong>you will only pay the number that we randomly generated </strong>\
      (even if your value was significantly higher). If the value you offered is <strong>lower</strong> than our randomly generated value, you will continue playing \
      your current game. Because of this,<strong> it is to your benefit to be honest in how much you are willing to pay</strong>.</p>",
      "<p>You will now be asked to answer a few questions about this, so feel free to re-read the instructions before you click Next </p>"
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// BDM QUIZ
var BDM_quiz = {
    type: jsPsychSurveyMultiChoice,
    questions: [
      {
        prompt: "To get the best result when it comes to switching, I should:", 
        name: 'BDM_should', 
        options: ['always give a higher number of points than I would really want to trade to switch', 'always give a lower number of points than I would really want to trade to switch', 'always be honest about exactly how many points I would be willing to switch'], 
        required: true
      }
    ],
  };

var final_exp_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Great! You are now ready to begin.</p>",
      "<p>As a reminder, in this experiment you will start off with playing one of the two games you previously practiced. You will be given points each time you are correct (although you will not see them). You will also occasionally be asked how many points you would trade to switch to the other game. \
      If your answer is higher than our randomly generated one, you will be switched! \
      If not, you will stay on this game</p>",
      "<p>When you're ready, press Next to begin</p>",
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
}

// FINAL DEBRIEF
var overall_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 
      `<p>Thanks for participating! This experiment seeked to understand how cognitive fatigue, \
      effort, errors, and task switching interact. Your final bonus (based purely on how correct you \
    were) is <strong>insert</strong>. The experiment is over now, press any button to continue</p>`
}