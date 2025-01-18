// MAIN EXPERIMENT SET UP VARIABLES
var ds_trials_per_block = 10
var ds_practice_trial_num = 4
var response_time_max = 4200 // in ms

// DS specific setups:
// also includes 200 ms between each digit flash
var ds_digit_duration = 275
var ds_digits_to_mem = 4

// Define the HTML for the keypad
const keypadHTML = `
<div id="custom-keypad-container" style="width: 100%; max-width: 500px; margin: 0 auto; position: static; transform: none;">
    <div id="response-display" style="font-size: 32px; margin-bottom: 2rem; height: 48px; text-align: center; position: static; transform: none;"></div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; width: 100%; position: static; transform: none;">
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black" onclick="handleDigit(1)">1</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(2)">2</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(3)">3</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(4)">4</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(5)">5</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(6)">6</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(7)">7</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(8)">8</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(9)">9</button>
        <button style="padding: 1rem; font-size: 24px; background-color: #94a3b8; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black; color: white;" onclick="handleClear()">Clear</button>
        <button class="digit-btn" style="padding: 1rem; font-size: 24px; background-color: #f3f4f6; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black;" onclick="handleDigit(0)">0</button>
        <button style="padding: 1rem; font-size: 24px; background-color: #0ea5e9; border-radius: 0.5rem; width: 100%; height: 64px; border: 2px solid black; color: white;" onclick="handleSubmit()">Submit</button>
    </div>
</div>
`;

// Global variables to store response
let currentResponse = [];
let currentTrial = null;
let startTime = null;

// Handler functions
function handleDigit(digit) {
    if (currentResponse.length < 4) {
        currentResponse.push(digit);
        document.getElementById('response-display').textContent = currentResponse.join(' ');
    }
}

function handleClear() {
    currentResponse = [];
    document.getElementById('response-display').textContent = '';
}

function handleSubmit() {
    if (currentResponse.length === 4) {
        // Store response before ending trial
        if (currentTrial) {
            currentTrial.data.response = currentResponse.slice();
            currentTrial.data.rt = performance.now() - startTime;
        }
        // Find and click the hidden jsPsych button
        document.querySelector('#jspsych-html-button-response-button-0').click();
    }
}

// Generate random sequence of 4 digits
function generateSequence(num_digits) {
    var seq = Array.from({length: num_digits}, () => Math.floor(Math.random() * 10));
    console.log(seq);
    return seq;
}

// Modify the digit display timeline
function createDigitDisplayTimeline(sequence) {
    let timeline = [];
    for (let digit of sequence) {
        // Add blank screen before digit
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size: 96px; min-height: 200px; display: flex; align-items: center; justify-content: center; position: static; transform: none;"></div>`,
            choices: "NO_KEYS",
            trial_duration: 200
        });

        // Show digit
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size: 96px; min-height: 200px; display: flex; align-items: center; justify-content: center; position: static; transform: none;">${digit}</div>`,
            choices: "NO_KEYS",
            trial_duration: ds_digit_duration
        });
    }
    return timeline;
}

// Response phase with keypad
function createResponsePhase(sequence, is_practice) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: keypadHTML,
        choices: ['Continue'],
        button_html: '<button style="display:none" class="jspsych-btn">%choice%</button>',
        trial_duration: response_time_max,  // 4.2 second timeout
        data: {
            sequence: sequence
        },
        on_start: function(trial) {
            currentResponse = [];
            currentTrial = trial;
            startTime = performance.now();
        },
        on_finish: function(data) {
            data.game_type = "digit_span"
            data.trial_type = "ds_main_response"
            data.practice = is_practice
            data.timed_out = 0 // assume it is not timed out

            if (is_practice) {
                data.trial_type = "ds_practice_response"
            }

            // If response is empty (timed out), set it to an empty array
            if (!data.response || data.response.length === 0) {
                data.response = [];
                data.is_correct = 0;
                data.timed_out = 1;
                data.rt = response_time_max; // timeout duration
            }
            data.is_correct = JSON.stringify(data.response) === JSON.stringify(data.sequence);
            console.log(JSON.stringify(data.response) === JSON.stringify(data.sequence));

            currentTrial = null;
            startTime = null;
        }
    };
}

function ds_getMainBlock(num_trials = ds_trials_per_block, num_d = ds_digits_to_mem) {
    var trials = [];

    for (let i = 0; i < num_trials; i++) {
        var sequence = jsPsych.randomization.sampleWithReplacement([...Array(10).keys()], num_d);

        // actual digit sequence
        trials.push(...createDigitDisplayTimeline(sequence));

        // Add response phase
        trials.push(createResponsePhase(sequence, false));
    }

    return trials;
}

function ds_getPracticeBlock(num_practice, num_d) {
    var trials = [];

    for (let i = 0; i < num_practice; i++) {
        var sequence = jsPsych.randomization.sampleWithReplacement([...Array(10).keys()], num_d);

        // actual digit sequence
        trials.push(...createDigitDisplayTimeline(sequence));

        // Add response phase
        trials.push(createResponsePhase(sequence, true));

        // Add feedback
        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                var last_trial = jsPsych.data.get().last(1).values()[0];
                if (last_trial.timed_out) {
                    return `
                        <div class="flex flex-col items-center justify-center">
                            <p class="text-2xl text-red-500 mb-4">Respond faster!</p>
                            <p class="text-xl">The sequence was: ${last_trial.sequence.join(' ')}</p>
                        </div>
                    `;
                }
                if (last_trial.is_correct) {
                    return `
                        <div class="flex flex-col items-center justify-center">
                            <p class="text-2xl text-green-500 mb-4">Correct!</p>
                            <p class="text-xl">The sequence was: ${last_trial.sequence.join(' ')}</p>
                            <p class="text-xl">Your response was: ${last_trial.response.join(' ')}</p>
                        </div>
                    `;
                } else {
                    return `
                        <div class="flex flex-col items-center justify-center">
                            <p class="text-2xl text-red-500 mb-4">Incorrect</p>
                            <p class="text-xl">The correct sequence was: ${last_trial.sequence.join(' ')}</p>
                            <p class="text-xl">Your response was: ${last_trial.response.join(' ')}</p>
                        </div>
                    `;
                }
            },
            choices: "NO_KEYS",
            trial_duration: 1000,
            on_finish: function(data) {
                data.trial_type = "ds_practice_feedback"
            }
        });
    }

    return trials;
}

function ds_getBlock(num_trials, num_d) {
    return {
        timeline: ds_getMainBlock(num_trials, num_d)
    }
}

var ds_practice_block = {timeline: ds_getPracticeBlock(num_practice = ds_practice_trial_num, num_d = ds_digits_to_mem)};