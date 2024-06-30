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
      "<p>We will now practice the spatial recall game! Click next for the instructions.</p>",
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
    stimulus: '<p> Great work! You will now practice for the next game. Press any key to continue. </p>',
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
       These points are separate from your bonus and your performance, but what is leftover may become a supplementary bonus at the end. You will not be shown your points throughout the game.</p>",
      "<p>In this experiment, you will be playing the two games you practiced earlier. You will occasionally be asked how many points \
      (from 1 to 100) you would pay to switch to the other game (these points will come from your endowment).</p>",
      "<p>Think of this like an <strong>auction</strong> for the chance to switch games. <br><br>\
      Each time the auction occurs, we will <strong>randomly generate</strong> a value from 1 to 100. Let's call this <strong> our random price </strong> <br><br>\
      <strong> If the number of points you offer </strong> is\
      <strong> greater than </strong> our random price, <strong> you will get to switch games</strong>, and <strong>you will only pay the random price</strong>\
      (even if your offer was larger).<br><br>\
      <strong>If the value you offer </strong> is <strong>less than</strong> our random price, <strong>you will continue playing \
      your current game</strong>.</p>",
      "<p><strong> Your optimal strategy is to be honest about how many points you want to trade to switch to the other game</strong></p>",
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
      prompt: "Every time I get the option to switch, my offer will be compared to a randomly selected bid. Which of the following is true:", 
      name: 'BDM_gen', 
      options: ['This randomly selected bid is the same throughout the experiment.','This randomly selected bid gets re-generated every time I am given the option to switch.','This randomly selected bid will always be larger than mine.'], 
      required: true
    }
  ],
  randomize_question_order: false,
  on_finish: function(data) {
      var BDM_gen = data.response.BDM_gen; 
        if(BDM_gen == 'This randomly selected bid gets re-generated every time I am given the option to switch.') {
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
    return "<p>CORRECT: The randomly selected bid that your offer will be compared to \
    will be re-generated every time you get the option to switch. </p>"
  } else {
    return "<p>INCORRECT: The randomly selected bid that your offer will be compared to \
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
      <br><br>If your answer is higher than our random price, you will be switched! \
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