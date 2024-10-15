// Custom plugin for DSST with hidden "End Rest" button
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
        default: ['1', '2', '3'],
      },
      shapes: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: ['img/circle.png', 'img/diamond.png', 'img/square.png'],
      },
      show_end_rest_button: {
        type: jspsych.ParameterType.BOOL,
        default: false,
      },
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
        `<button id="end-rest-btn" style="position: absolute; top: -30px; right: -30px;">End Rest</button>` :
        `<button id="end-rest-btn" style="display: none; pointer-events: none;">End Rest</button>`;

      display_element.innerHTML = `
        <div style="position: relative;">
          <div style="margin-bottom: 20px;">
            ${shapes_html}
          </div>
          <p>What is the number under the ${trial.stimulus}?</p>
          ${end_rest_button_html}
        </div>
      `;

      const end_trial = (response) => {
        this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(response);
      };

      const after_key_response = (info) => {
        end_trial({
          rt: info.rt,
          response: info.key,
          end_rest: false
        });
      };

      this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_key_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      if (trial.show_end_rest_button) {
        display_element.querySelector('#end-rest-btn').addEventListener('click', () => {
          end_trial({
            rt: null,
            response: null,
            end_rest: true
          });
        });
      }
    }
  }

  DsstWithEndRestPlugin.info = info;

  return DsstWithEndRestPlugin;
})(jsPsychModule);