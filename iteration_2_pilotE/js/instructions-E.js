// INTRO AND BEFORE PRACTICE
// make a prolific id place for them to enter
var prolific_id_insert = {
    type: jsPsychSurveyText,
    preamble: `<p>Welcome! Please enter your Prolific ID below:</p>`,
    questions: [
      {prompt: 'Enter here:', rows: 1,name: 'prolific_id'},
    ]
  }

// welcome screen for experiment
var welcome_practice_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to this experiment! In this experiment, you will be playing two games--<b>Game A<b> and <b>Game B<b>. <br>\
      You will also be given rest breaks, during which you will do the <b>Rest Game<b>.<br>\
      You will be paid 10 dollars / hour, plus a bonus of up to 5 dollars.<br>\
      Before we begin the actual experiment, let\'s do some practice of the games.</p><br>\
      We will begin with Game A."
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
    "<p>In this game you will see a grid of squares that will flash blue one at a time.</p>\
    <p>Your goal is to remember the order in which the squares flashed blue.</p>\
    <p>At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>",
    `<p>Do your best to memorize the order, but do not write them down<br>or use any other external tool to help you remember.</p>\
    <p>If you make a mistake, click the "Clear" button to erase your entries.</p>\
    <p>When you're ready, click "Next" to get started.</p>`
  ]

DS_practice = [
    "<p>In this game you will see a sequence of digits that will be shown one at a time.</p>\
    <p>Your goal is to remember the order in which the digits appeared.</p>\
    <p>At the end of each trial, press the buttons of the digits that appeared in the <b>same order</b> as they were presented to you.</p>",
    `<p>Do your best to memorize the order, but do not write them down<br>or use any other external tool to help you remember.</p>\
    <p>When you're ready, click "Next" to get started.</p>`
  ]

rest_practice = [
  "<p>You have completed the practice for the two main games, game A and game B!</p>\
  <p>Now, you will practice the rest task, which will be shown to you during rest breaks. </p>",
  `
    <p>In this task, you will see three shapes with numbers underneath them.</p>
    <p>You will be asked about the number under one of the shapes.</p>
    <div style="display: flex; justify-content: space-around; margin: 20px;">
      <div><img src="img/circle.png" style="width: 50px;"><br>1</div>
      <div><img src="img/diamond.png" style="width: 50px;"><br>2</div>
      <div><img src="img/square.png" style="width: 50px;"><br>3</div>
    </div>
    <p>Press the corresponding number key when asked about a specific shape.</p>
    <p>You can end the rest at any time by clicking the "End Rest" button.</p>
    <p>Press Next to begin the practice.</p>
  `,
]

// practice transition between A and B
var practice_transition = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> Great work! You will now practice for Game B. Press any key to continue. </p>',
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
    document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
    jsPsych.setProgressBar(0);
  }
}

// POST PRACTICE INSTRUCTIONS
// main experiment instructions
var main_exp_instructions = {
  type: jsPsychInstructions,
  pages: [
    "<p>Great work on completing the practice! We will now go into instructions for the main experiment.</p>",
    "<p>Please do your best to understand the tasks and experiment, and try your best on the two games. \
    As long as you adhere to the instructions and do your best, you will receive a bonus at the end of the experiment.</p>",
    "<p> You will get an endowment of 300 points to begin with, which you can use as currency in this experiment.\
 These points are valuable, and they represent your ability to choose to rest during the experiment.\
At the end of the task, the proportion remaining of your endowment will be converted to an additional bonus.\
However, <strong>do not worry too much about holding onto every single point; they are meant to be used to make your experience more enjoyable.</strong></p>",
    "<p> In this experiment, you will be switched between playing Games A and B, with some rest periods in between.\
 You will start off by playing Game A. At certain points of the experiment, you will be notified that you are \
 about to enter a <strong>rest period</strong><br>\
    Before the rest period, you will be told which game you will play after the rest is over\
 (you might switch to the other game, or remain in the game you were playing before the rest).\
You will then enter the rest period, during which you will play the rest task for at least 5 seconds. \
After that, you can keep playing for however long you want, but every extra second\
 you stay in rest will cost you 1 point from your endowment. You should still stay in the rest task for as long as you need or want, \
 but be aware that staying too long may be costly.\
 When you are ready to continue with the experiment, press the “end rest” button that will appear during the rest task.</p>",
 "<p>Even though the bonus at the end is based on a combination of completion and what\’s left of your endowment, please do your best\
 on all of the games and make sure to try on every trial of the games and the rest task. As long as you do that, you will receive a bonus. \
 Additionally, the task is set to be exactly 50 minutes long (no matter how much time is spent on the rest task vs the two games), so please\
 feel free to extend rest whenever you feel you need to. </p>",
 "<p>Re-read the instructions if necessary, and press continue when you are ready to begin the main experiment!</p>"
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

// END OF EXPERIMENT INSTRUCTION
// thanks for participating, your bonus is ______

var overall_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 
    `<p>Thanks for participating! This experiment seeked to understand how cognitive fatigue, \
    effort, errors, and task switching interact. Your final completion bonus is\
    <strong>3</strong> dollars. The experiment is over now, press any button to continue to be redirected.</p>`,
  //on_start: function(overall_debrief) {
  //    var bonus = calculate_bonus()

   //   document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  //}
}


