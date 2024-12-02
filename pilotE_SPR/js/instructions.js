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
      <p class="instructions-text">In this experiment, you will be playing two games&mdash;<b>Game A</b> and <b>Game B</b>.</p>
      <p class="instructions-text">You will also be given rest breaks, during which you will do the <b>Rest Game</b>.</p>
      <p class="instructions-text">You will be paid 10 dollars / hour, plus a bonus of up to 5 dollars.</p>
      <p class="instructions-text">Before we begin the actual experiment, let's do some practice of the games.</p>
      <p class="instructions-text">We will begin with Game A.</p>
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
    <p class="instructions-text">In this game you will see a grid of squares that will flash blue one at a time.</p>
    <p class="instructions-text">Your goal is to remember the order in which the squares flashed blue.</p>
    <p class="instructions-text">At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>
  </div>`,
  `<div class="instructions-container">
    <p class="instructions-text">Do your best to memorize the order, but do not write them down or use any other external tool to help you remember.</p>
    <p class="instructions-text">If you make a mistake, click the "Clear" button to erase your entries.</p>
    <p class="instructions-text">When you're ready, click "Next" to get started.</p>
  </div>`
]

DS_practice = [
`<div class="instructions-container">
  <h1 class="instructions-heading">Digit Game</h1>
  <p class="instructions-text">You will see a sequence of 4 digits shown one at a time.</p>
  <p class="instructions-text">After the sequence, use the on-screen keypad to enter the digits in the order they were presented.</p>
  <p class="instructions-text">Press any key to begin.</p>
</div>`
]

rest_practice = [
`<div class="instructions-container">
  <h1 class="instructions-heading">Rest Practice</h1>
  <p class="instructions-text">You have completed the practice for the two main games, Game A and Game B!</p>
  <p class="instructions-text">Now, you will practice the rest game, which will be shown to you during rest breaks.</p>
</div>`,
`<div class="instructions-container">
  <h1 class="instructions-heading">Rest Instructions</h1>
  <p class="instructions-text">In this game, you will see two shapes with numbers underneath them.</p>
  <p class="instructions-text">You will be asked about the number under one of the shapes.</p>
  <div style="display: flex; justify-content: space-around; margin: 2rem 0;">
    <div class="shape-container"><img src="img/circle.png" style="width: 50px;"><br>1</div>
    <div class="shape-container"><img src="img/square.png" style="width: 50px;"><br>3</div>
  </div>
  <p class="instructions-text">Press the corresponding number key when a specific shape is listed.</p>
  <p class="instructions-text"><b>In the actual experiment, you will be able to end the rest at any time by clicking the "End Rest" button that will appear in the top right corner.<b></p>
  <p class="instructions-text">Press Next to begin the practice.</p>
</div>`
]

// practice transition between A and B
var practice_transition = {
type: jsPsychHtmlKeyboardResponse,
stimulus: `<div class="instructions-container">
  <p class="instructions-text">Great work! You will now practice for Game B. Press any key to continue.</p>
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
    <h1 class="instructions-heading">Point system and bonus</h1>
    <p class="instructions-text">You will get an endowment of <b>300 points</b> to begin with, which you can use as currency in this experiment.
    These points are valuable, and <b>they represent your ability to rest for longer during the experiment.</b> During the rest game, \
    every second you stay in the rest game will use some points from your endowment and at the end of the game, the proportion remaining of your endowment will be converted to an additional bonus.
    However, <strong>do not worry too much about holding onto every single point; they are meant to be used to make your experience more enjoyable.</strong>\
    Also, please try your best each trial of each game; as long as you do your best, you will get a bonus of at least 3 dollars.</p>
  </div>`,
  `<div class="instructions-container">
    <h1 class="instructions-heading">Experiment Structure</h1>
    <p class="instructions-text">In this experiment, you will be switched between playing Games A and B, with some rest periods in between.
    You will start off by playing Game A. At certain points of the experiment, you will be notified that you are 
    about to enter a <strong>rest period</strong></p>
    <p class="instructions-text">Before the rest period, you will be told which game you will play after the rest is over
    (you might switch to the other game, or remain in the game you were playing before the rest).
    You will then enter the rest period, during which you will play the rest game for up to 40 seconds (pressing the "end rest" button when you want to move on). 
    You should stay in the rest game for as long as you need or want, but be aware that staying longer uses endowment points.</p>
  </div>`,
  `<div class="instructions-container">
    <h1 class="instructions-heading">Important Notes</h1>
    <p class="instructions-text">Even though the bonus at the end is based on a combination of completion and what's left of your endowment, please do your best
    on all of the games and make sure to try on every trial of the games and the rest game (but don't worry about going as fast as posisble). As long as you do that, you will receive a bonus.</p>
    <p class="instructions-text">Additionally, the game is set to be exactly 50 minutes long (no matter how much time is spent on the rest game vs the two games), so please
    feel free to extend rest whenever you feel you need to.</p>
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

var overall_debrief = {
type: jsPsychHtmlKeyboardResponse,
stimulus: 
  `<div class="instructions-container">
    <h1 class="instructions-heading">Thank You!</h1>
    <p class="instructions-text">Thanks for participating! This experiment sought to understand how cognitive fatigue, 
    effort, errors, and task switching interact. Your final completion bonus is
    <strong>4</strong> dollars. The experiment is over now, press any button to continue to be redirected.</p>
  </div>`
}


// cue that task will stay
var rest_leftovers_transition = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p> You have completed the main experiment! Now you will do the leftover rest trials that you skipped earlier. </p>',
  choices: "ALL_KEYS",
  trial_duration: 1000,
}