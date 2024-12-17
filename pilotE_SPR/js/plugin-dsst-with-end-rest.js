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
        default: 100, // Duration in ms for the clear screen
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: 900, // Total trial duration in ms
      }
    }
  }

  class DsstWithEndRestPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      const shapes_html = trial.shapes.map((shape, index) => `
        <div style="display: inline-block; margin: 0 10px;">
          <img src="${shape}" style="width: 50px; height: 50px;">
          <p>${index + 1}</p>
        </div>
      `).join('');
      const end_rest_button_html = trial.show_end_rest_button ?
        `<button id="end-rest-btn" class="modern-button">End Rest</button>` :
        `<button id="end-rest-btn" style="display: none; pointer-events: none;">End Rest</button>`;
    
      display_element.innerHTML = `
        <div class="experiment-container">
          <div class="button-container">
            ${end_rest_button_html}
          </div>
          <div class="shapes-container">
            ${shapes_html}
          </div>
          <p style="font-size: 1.3rem"><strong>${trial.stimulus}</strong></p>
        </div>
      `;

      // Record the start time of the trial
      const start_time = performance.now();

      const end_trial = (response) => {
        this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(response);
      };

      const after_key_response = (info) => {
        // Clear the display immediately after response
        display_element.innerHTML = '';

        // check to see if they answered anything, if not then set the info.key as []
        if (!info.key) {
          info.key = -1
        }
        
        // Calculate remaining time
        const elapsed_time = performance.now() - start_time;
        const remaining_time = Math.max(0, trial.trial_duration - elapsed_time) + trial.clear_duration;
        
        // Wait for the remaining time before ending the trial
        setTimeout(() => {
          end_trial({
            rt: info.rt,
            response: info.key,
            end_rest: false,
            end_rest_button_clicked: false
          });
        }, remaining_time);
      };

      const keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_key_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      // Set a timeout to end the trial if no response is given
      var max_trial_length = trial.trial_duration + trial.clear_duration
      const trial_timeout = setTimeout(() => {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
        end_trial({
          rt: null,
          response: null,
          end_rest: false,
          end_rest_button_clicked: false
        });
      }, max_trial_length);

      if (trial.show_end_rest_button) {
        display_element.querySelector('#end-rest-btn').addEventListener('click', () => {
          clearTimeout(trial_timeout);
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
          end_trial({
            rt: null,
            response: null,
            end_rest: true,
            end_rest_button_clicked: true
          });
        });
      }
    }
  }

  DsstWithEndRestPlugin.info = info;

  return DsstWithEndRestPlugin;
})(jsPsychModule);