var dsstWithEndRestPlugin = (function (jspsych) {
  "use strict";

  const info = {
    name: 'dsst-with-end-rest',
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        default: ['1', '2'],
      },
      shapes: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: ['img/circle.png', 'img/square.png'],
      },
      show_end_rest_button: {
        type: jspsych.ParameterType.BOOL,
        default: false,
      },
      clear_duration: {
        type: jspsych.ParameterType.INT,
        default: 150,
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: 1350,
      }
    }
  }

  class DsstWithEndRestPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // Create shapes HTML
      const shapes_html = trial.shapes.map((shape, index) => `
        <div style="display: inline-block; margin: 0 10px;">
          <img src="${shape}" style="width: 50px; height: 50px;">
          <p>${index + 1}</p>
        </div>
      `).join('');

      // Create end rest button if required
      const end_rest_button_html = trial.show_end_rest_button ?
        `<button id="end-rest-btn" class="modern-button">End Rest</button>` :
        `<button id="end-rest-btn" style="display: none; pointer-events: none;">End Rest</button>`;

      // Set up initial display
      display_element.innerHTML = `
        <div class="experiment-container">
          <div class="button-container">
            ${end_rest_button_html}
          </div>
          <div class="shapes-container">
            ${shapes_html}
          </div>
          <p style="font-size: 1.6rem"><strong>${trial.stimulus}</strong></p>
        </div>
      `;

      const start_time = performance.now();
      let response_recorded = false;
      let trial_ended = false;
      let end_rest_early = false;

      let response_info = {
        rt: null,
        response: null,
        end_rest: false,
        end_rest_button_clicked: false,
        timed_out: 0  // Initialize timed_out to 0
      };

      // Function to actually finish the trial after blank screen
      const finishAfterBlank = () => {
        display_element.innerHTML = '';
        // If no response was made or response was too late, mark as timed out
        if (!response_info.response || (response_info.rt && response_info.rt >= trial.trial_duration)) {
          response_info.timed_out = 1;
        }
        this.jsPsych.finishTrial(response_info);
      };

      // Function to show blank screen and then end trial after clear_duration
      const endTrialWithBlank = () => {
        if (trial_ended) return; // Prevent multiple calls
        trial_ended = true;

        display_element.innerHTML = ''; // blank screen
        this.jsPsych.pluginAPI.setTimeout(() => {
          finishAfterBlank();
        }, trial.clear_duration);
      };

      // Timer that triggers after full trial_duration has elapsed if no early end
      let trial_timer = this.jsPsych.pluginAPI.setTimeout(() => {
        // If no one ended rest and we haven't ended yet:
        if (!end_rest_early) {
          // If no response was made, mark timed_out
          if (!response_recorded) {
            response_info.timed_out = 1;
          }
          endTrialWithBlank();
        }
      }, trial.trial_duration);

      // Handle participant response
      const after_response = (info) => {
        if (!response_recorded) {
          response_recorded = true;
          response_info.rt = info.rt;
          response_info.response = info.key;
          // Check if response was too late
          if (info.rt >= trial.trial_duration) {
            response_info.timed_out = 1;
          }
        }
      };

      // Listen for participant's response
      const keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      // Handle End Rest button click
      if (trial.show_end_rest_button) {
        display_element.querySelector('#end-rest-btn').addEventListener('click', () => {
          if (trial_ended) return;
          end_rest_early = true;
          rest_ended = true // added this here
          this.jsPsych.pluginAPI.clearAllTimeouts();
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
          response_info.end_rest = true;
          response_info.end_rest_button_clicked = true;

          // Immediately go to blank screen and then end trial after clear_duration
          endTrialWithBlank();
        });
      }
    }
  }

  DsstWithEndRestPlugin.info = info;

  return DsstWithEndRestPlugin;
})(jsPsychModule);