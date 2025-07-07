// Initialize jsPsych.
var jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  on_finish: function() {
    
    // Add interactions to the data variable
    //var interaction_data = jsPsych.data.getInteractionData();
    //jsPsych.data.get().addToLast({interactions: interaction_data.json()});

    // Display jsPsych data in viewport.
    //jsPsych.data.displayData();
  },
  on_start: function(){
    //document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  },
  on_finish: function(){
    window.location = "https://app.prolific.com/submissions/complete?cc=CEAKMHC3"
  }
});
