// INTRO AND BEFORE PRACTICE
// preload external html file
var preload = {
    type: 'preload',
    images: ['./js/poldrack_consent_form.html']
  };

// consent form
var consent_form = {
    type: jsPsychExternalHtml,
    url: "./js/poldrack_consent_form.html",
    cont_btn: "start"
};

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
    "<p>In this game you will see a grid of squares that will flash blue one at a time.</p>\
    <p>Your goal is to remember the order in which the squares flashed blue.</p>\
    <p>At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>",
    `<p>Do your best to memorize the order, but do not write them down<br>or use any other external tool to help you remember.</p>\
    <p>If you make a mistake, click the "Clear" button to erase your entries.</p>\
    <p>When you're ready, click "Next" to get started.</p>`
  ]

var gameA_practice_instructions = {
    type: jsPsychInstructions,
    pages: getInstructions("A"),
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
      document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
      jsPsych.setProgressBar(0);
    }
}

  // POST PRACTICE INSTRUCTIONS