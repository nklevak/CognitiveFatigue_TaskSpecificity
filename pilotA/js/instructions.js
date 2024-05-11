// WELCOME TO EXPERIMENT
var welcome_practice_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to this experiment! In this experiment, you will be doing two tasks. Before we begin the actual experiment, let\'s do some practice trials.</p><br>\
      We will begin with the first game."
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// #TODO CONSENT FORM
var consent_form = {
  type: jsPsychSurveyMultiChoice,
  preamble: '<p>Welcome! Thank you for agreeing to take part in the pilot version of this study. If you consent to participating, please click the option below. If not, please exit out of the experiment.</p>',
  questions: [
    {
      prompt: "Are you willing to take part in this study?", 
      name: 'Consent_response', 
      options: ['I agree to take part in this study.'], 
      required: true,
      horizontal: true
    }, 
  ],
  on_start: function(){
    document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  }
}

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

  // TRANSITION BETWEEN GAMES IN PRACTICE SESSION
  var practice_transition = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p> Great work! You will now have practice for the next game. Press any key to continue. </p>',
    choices: "ALL_KEYS"
    //trial_duration: 1200,
  }

// GRADCPT TASK INSTRUCTIONS (before each gradcpt block)
var cpt_task_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to the gradual onset game! Click next for the instructions.</p>",
      "<p>In this task, an image will appear in the center of the screen.</p><p>\
      If the image is a <strong>city</strong> press Spacebar on the keyboard as fast as you can.</p><p>\
      If the image is a <strong>mountain</strong>, do not press a key.</p>\
      <div style='width: 700px;'><div style='float: left;'><img src='./img900_esterman_w_big/city_1.jpg'></img>\
      <p class='small'><strong>Press the Space key</strong></p></div>\
      <div style='float: right;'><img src='./img900_esterman_w_big/mountain_1.jpg'></img>\
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

var gradcpt_quiz = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "For this game, I should:", 
      name: 'gradcpt_question', 
      options: ['Press the Enter key for a city, and nothing for a mountain', 'Press the Space key for a city, and nothing for a mountain', 'Press the Space key for all images'], 
      required: true
    }
  ],
};

var gradcpt_begin = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 'The correct answer is to press the Space key when you see a city, and nothing when you see a mountain. <br><br> When you are ready, press any key to continue to the game.</p>',
  choices: "ALL_KEYS"
  //trial_duration: 1200,
}


// MAIN EXPERIMENT INSTRUCTIONS + BDM
var main_exp_BDM_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>We will now go into instructions for the main experiment.</p>",
      "<p>You will be given a monetary bonus based on your accuracy in this experiment.\
      You will not be shown the bonus until the end.</p><p>",
      "<p>You will be also be given an endowment of <strong>1000</strong> points which you can use throughout the game </p>",
      "<p>In this experiment, you will be switching between the two games you practiced earlier. You will occasionally be asked how many points \
      (from 1 to 100) you are willing to offer in order to switch to the other game (these points will come from your endowment).</p>",
      "<p>Think of this like an <strong>auction</strong>. <br><br>\
      We will randomly select a value from 1 to 100 each time you are given the option to switch. Let's call this <strong> our bid </strong> <br><br> \
      <strong> If the number of points you offer </strong> is \
      <strong> larger </strong> than our bid, <strong> you will get to switch games</strong>, and <strong>you will only pay our bid value </strong>\
      (even if your offer was significantly higher).<br><br>\
      <strong>If the value you offer </strong> is <strong>lower</strong> than our bid value, <strong>you will continue playing \
      your current game</strong>. Because of this,<strong> it is to your benefit to be honest in how much you are willing to pay</strong>.</p>",
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
        prompt: "Every time I get the option to switch, my offer will be compared to a randomly selected bid. Which of the following is true:", 
        name: 'BDM_gen', 
        options: ['This randomly selected bid is the same throughout the experiment.','This randomly selected bid gets re-generated every time I am given the option to switch.','This randomly selected bid will always be larger than mine.'], 
        required: true
      },
      {
        prompt: "When I get the option to switch, the points I'm offering come from:", 
        name: 'BDM_points', 
        options: ['My initial endowment of points.','The points I have gained from being accurate in the experiment so far.','They come from nowhere. I have an infinite amount of points to give.'], 
        required: true
      },
      {
        prompt: "To get the best result when it comes to switching, I should:", 
        name: 'BDM_should', 
        options: ['Always offer a higher number of points than I would really want to trade to switch.', 'Always offer a lower number of points than I would really want to trade to switch.', 'Always be honest about exactly how many points I would be willing to trade.'], 
        required: true
      },
    ],
    randomize_question_order: false,
  };

  var BDM_quiz_answers = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p> The correct answers are: <br><br> 1. The randomly selected bid that your offer will be compared to \
    will be re-generated every time you get the option to switch. <br><br>\
     2. The points you offer when you get the option to switch come from your initial endowment of points.<br><br>\
     3. To get the best results when it comes to switching, you should always be honest about exactly how many points \
     you would be willing to trade. <br><br> Press any key to continue. </p>',
    choices: "ALL_KEYS",
    trial_duration: 5000,
  }

var final_exp_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Great! You are now ready to begin.</p>",
      "<p>As a reminder, in this experiment you will start off with playing one of the two games you previously practiced.\
      <br><br>You will also occasionally be asked \
      how many points you would be willing to trade to switch to the other game. \
      <br><br>If your answer is higher than our randomly generated one, you will be switched! \
      If not, you will stay on this game</p>",
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