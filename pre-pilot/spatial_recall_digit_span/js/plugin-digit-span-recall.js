// adapted and updated from https://github.com/mahiluthra/working_memory_tests/blob/master/jspsych-6.0.4/plugins/jspsych-digit-span-recall.js

var jsPsychDigitSpanRecall = (function (jspsych) {
    'use strict';

    const info = {
        name: 'digit-span-recall',
        description: '',
        parameters: {
          trial_duration: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Trial duration',
            default: null,
            description: 'How long to show the trial.'
          },
          size_cells: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Size of cells',
            default: 80,
            description: 'Size of each cell of numpad.'
          },
          correct_order: {
            type:jspsych.ParameterType.INT,
            default: undefined,
            description: 'Record the correct array'
          }
        }
    }

    class DigitSpanRecallPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            // making matrix:
            var grid = 3;
            var recalledGrid = [];
            var correctGrid = trial.correct_order
            var display = " "

            var numbertobutton = {
            "0": "1",
            "1": "2",
            "2": "3",
            "3": "4",
            "4": "5",
            "5": "6",
            "6": "7",
            "7": "8",
            "8": "9",
            "9": "0"
            }

            function indexOfArray(val, array) {
                var
                  hash = {},
                  indexes = {},
                  i, j;
                for(i = 0; i < array.length; i++) {
                  hash[array[i]] = i;
                }
                return (hash.hasOwnProperty(val)) ? hash[val] : -1;
            };

            function recordClick(data) {
                var tt = data.getAttribute('id')
                tt = ("#"+tt)
                display_element.querySelector(tt).className = 'jspsych-digit-span-recall';
                var recalledN = (data.getAttribute('data-choice'));
                recalledGrid.push(numbertobutton[recalledN])
                var div = document.getElementById('recall_space');
                display += numbertobutton[recalledN] + " "
                div.innerHTML = display;
            }

            function clearSpace(data){
              recalledGrid = recalledGrid.slice(0, (recalledGrid.length-1))
              console.log(recalledGrid)
              var div = document.getElementById('recall_space');
              display = display.slice(0, (display.length-2))
              div.innerHTML = display
            }
            
            
            var matrix = [];
            for (var i=0; i<grid; i++){
                var m1 = i;
                for (var h=0; h<grid; h++){
                    var m2 = h;
                    matrix.push([m1,m2])
                    }
            };
            matrix.push([3,1])

            var paper_size = [(grid*trial.size_cells), ((grid+1)*trial.size_cells)+80];

            display_element.innerHTML = '<div id="jspsych-html-button-response-btngroup" style= "position: relative; width:' + paper_size[0] + 'px; height:' + paper_size[1] + 'px"></div>';
            var paper = display_element.querySelector("#jspsych-html-button-response-btngroup");

            paper.innerHTML += '<div class="recall-space" style="position: absolute; top:'+ 0 +'px; left:'+(paper_size[0]/2-300)+'px; width:600px; height:64px" id="recall_space">'+ recalledGrid+'</div>';


            var buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

            for (var i = 0; i < matrix.length; i++) {
                var str = buttons[i]
                paper.innerHTML += '<div class="jspsych-digit-span-recall" style="position: absolute; top:'+ (matrix[i][0]*(trial.size_cells-3)+80) +'px; left:'+matrix[i][1]*(trial.size_cells-3)+'px; width:'+(trial.size_cells-6)+'px; height:'+(trial.size_cells-6)+'px"; id="jspsych-spatial-span-grid-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
            }

            display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+0+' '+-10+'" id="jspsych-html-button-response-button-clear">Backspace</div>';

            display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+20+' '+40+'" id="jspsych-html-button-response-button">Continue</div>';

            var start_time = Date.now();

            // Add event listeners to buttons
            for (let i = 0; i < 10; i++) {
              display_element.querySelector('#jspsych-spatial-span-grid-button-' + i).addEventListener('click', function(e){
                recordClick(e.currentTarget)
              });
            };

            display_element.querySelector('#jspsych-html-button-response-button-clear').addEventListener('click',function(e){
              clearSpace(e.currentTarget)
            });

            display_element.querySelector('#jspsych-html-button-response-button').addEventListener('click', function(e){
                var accuracy = 1
                if (correctGrid.length == recalledGrid.length){
                for (var i=0; i<correctGrid.length; i++){
                    if (recalledGrid[i] != correctGrid[i]){
                    accuracy = 0
                    }
                }
                } else {
                accuracy = 0
                }
                after_response(accuracy);
            });

            var response = {
                rt: null,
                button: null
            };

            function after_response(choice) {

                // measure rt
                var end_time = Date.now();
                var rt = end_time - start_time;
                var choiceRecord = choice;
                response.button = choice;
                response.rt = rt;
              
                // after a valid response, the stimulus will have the CSS class 'responded'
                // which can be used to provide visual feedback that a response was recorded
                //display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';
              
                // disable all the buttons after a response
                var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
                for(var i=0; i<btns.length; i++){
                  //btns[i].removeEventListener('click');
                  btns[i].setAttribute('disabled', 'disabled');
                }
              
                clear_display();
                  end_trial();
              };
              
              if (trial.trial_duration !== null) {
                jsPsych.pluginAPI.setTimeout(function() {
                  clear_display();
                  end_trial();
                }, trial.trial_duration);
              }
              
              function clear_display(){
                  display_element.innerHTML = '';
              }
              
              
        function end_trial() {
              
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();
              
            // gather the data to store for the trial
            var trial_data = {
                rt: response.rt,
                recall: recalledGrid,
                stimuli: correctGrid,
                accuracy: response.button
            };
              
            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

    }
};
DigitSpanRecallPlugin.info = info;

return DigitSpanRecallPlugin;
})(jsPsychModule);