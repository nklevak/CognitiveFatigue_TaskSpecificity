// consent form
// declare the block.
var consent_form = {
type: jsPsychExternalHtml,
url: "./js/poldrack_consent_form.html",
cont_btn: "start"
};

// WELCOME TO EXPERIMENT
var welcome_practice_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>Welcome to this experiment! In this experiment, you will be playing two games. <br>\
      You will be paid 8 dollars / hour, plus a completion bonus of 4 dollars.<br>\
      Before we begin the actual experiment, let\'s do some practice of the games.</p><br>\
      We will begin with the first game."
    ],
    key_forward: 'ArrowRight',
    key_backward: 'ArrowLeft',
    allow_keys: true,
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next'
  }

// SPATIAL RECALL TASK INSTRUCTIONS (before each SR block)
var sr_task_instructions = {
    type: jsPsychInstructions,
    pages: [
      "<p>We will now practice the memory game! Click next for the instructions.</p>",
      "<p>In this game you will see a grid of squares that will flash blue one at a time.</p>\
      <p>Your goal is to remember the order in which the squares flashed blue.</p>\
      <p>At the end of each trial, press the tiles that flashed in the <b>same order</b> as they were presented to you.</p>",
      `<p>Do your best to memorize the order, but do not write them down<br>or use any other external tool to help you remember.</p>\
      <p>If you make a mistake, click the "Clear" button to erase your entries.</p>\
      <p>When you're ready, click "Next" to get started.</p>`
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
      "<p>Please do your best to understand the tasks and experiment, and try your best on the tasks. As long as you adhere to the instructions and do your best, you will receive a 4 dollar bonus at the end of the experiment.",
      "<p>You will also get an endowment of 500 points to begin with, which you can use as currency in this experiment.\
      These points are valuable, and they represent your ability to make choices during the experiment. \
      However, <strong>do not worry too much about holding onto every single point; they are meant to be used to make your experience more enjoyable.</strong></p>",
      "<p> You will start off playing one of the games. At certain points in the experiment, you will be given the option to switch to the other game.<br>\
       To do this, you will place a bid in points from 1 to 100. These points will come from your endowment, and this bid represents how much you value switching to the new game.</p>",
      "<p>After you place your bid, a random number will be generated. If your bid is higher than this random number, you will get to switch to the other game, <br>and it will only use the random number of points (even if your bid was higher). \
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
    return "<p>CORRECT: The points you offer when you get the option to switch come from your initial endowment of points. They are here to make your experience more enjoyable, so use them as you wish.</p>"
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
    you would be willing to trade in order to switch games.</p>"
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