// EVERYTHING THAT WE WANT TO PRE-LOAD
var all_stim = ["city_1.jpg","city_2.jpg","city_3.jpg","city_4.jpg", "city_5.jpg","city_6.jpg","mountain_1.jpg",
"c1_c2.gif","c1_c3.gif","c1_c4.gif","c1_c5.gif","c1_c6.gif","c1_m1.gif","c2_c1.gif","c2_c3.gif","c2_c4.gif","c2_c5.gif","c2_c6.gif",
"c2_m1.gif","c3_c1.gif","c3_c2.gif","c3_c4.gif","c3_c5.gif","c3_c6.gif",
"c3_m1.gif","c4_c1.gif","c4_c2.gif","c4_c3.gif","c4_c5.gif","c4_c6.gif",
"c4_m1.gif","c5_c1.gif","c5_c2.gif","c5_c3.gif","c5_c4.gif","c5_c6.gif",
"c5_m1.gif","c6_c1.gif","c6_c2.gif","c6_c3.gif","c6_c4.gif","c6_c5.gif",
"c6_m1.gif","m1_c1.gif","m1_c2.gif","m1_c3.gif","m1_c4.gif","m1_c5.gif"]

var list_stim_temp = ["city_1.jpg","c1_c2.gif","city_2.jpg","c2_c3.gif","city_3.jpg",
"c3_c4.gif","city_4.jpg","c4_c5.gif","city_5.jpg","c5_c6.gif","city_6.jpg","c6_m1.gif",
"mountain_1.jpg","m1_c2.gif","city_2.jpg","c2_c3.gif","city_3.jpg","c3_c4.gif","city_4.jpg",
"c4_c5.gif","city_5.jpg","c5_m1.gif","mountain_1.jpg","m1_c6.gif","city_6.jpg"]

// preloading 
var preload_stim = []
var path_to_img = "./img/"
for (let i = 0; i < all_stim.length; i++) {
    preload_stim.push(path_to_img + all_stim[i]);
}
var list_stim = []
for (let i = 0; i < list_stim_temp.length; i++) {
    list_stim.push(path_to_img + list_stim_temp[i]);
}

var preload_auto = {
    type: jsPsychPreload,
    show_detailed_errors: true,
    auto_preload: true,
    message: 'Please wait while the experiment loads. This may take a few minutes.',
};

var preload_manual = {
    type: jsPsychPreload,
    show_detailed_errors: true,
    images: preload_stim,
    message: 'Please wait while the experiment loads. This may take a few minutes.',
};

// welcome and instructions
var welcome_cpt = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome to this task. Press any key to begin."
  };
  
var instructions_cpt = {
type: jsPsychHtmlKeyboardResponse,
stimulus: `
    <p>In this task, an image will appear in the center
    of the screen.</p><p>If the image is a <strong>city</strong>,
    press the letter q on the keyboard as fast as you can.</p>
    <p>If the image is a <strong>mountain</strong>, do not press a key.</p>
    <div style='width: 700px;'>
    <div style='float: left;'><img src='./img/city_1.jpg'></img>
    <p class='small'><strong>Press the q key</strong></p></div>
    <div style='float: right;'><img src='./img/mountain_1.jpg'></img>
    <p class='small'><strong>Do not press a key</strong></p></div>
    </div>
    <p>Press any key to begin.</p>
`,
post_trial_gap: 2000
};

// post-task debrief
var overall_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 
      `<p>Great work! This experiment is over now. Please press any button.</p>`
}

// trial set up
var trials = []
for (const fn of list_stim) {
    var trial = {
      type: jsPsychImageKeyboardResponse,
      stimulus: fn,
      choices: ['q'],
      prompt: "<p>press q if it is a city</p>",
      trial_duration:700,
      response_ends_trial:false,
      render_on_canvas: false,
    }
    trials.push(trial)
  }

var gradcpt_trials = {
    timeline: trials
}
