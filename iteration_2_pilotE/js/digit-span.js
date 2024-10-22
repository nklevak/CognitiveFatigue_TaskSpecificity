// Define the HTML for the keypad
const keypadHTML = `
<div id="keypad" class="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-4">
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">1</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">2</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">3</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">4</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">5</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">6</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">7</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">8</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">9</button>
  <button id="clear-btn" class="p-4 text-xl bg-red-200 rounded col-span-1">Clear</button>
  <button class="digit-btn p-4 text-xl bg-gray-200 rounded">0</button>
  <button id="submit-btn" class="p-4 text-xl bg-green-200 rounded col-span-1">Submit</button>
</div>
<div id="response-display" class="text-2xl mt-4 h-8 text-center"></div>
`;

// Generate random sequence of 4 digits
function generateSequence() {
    return Array.from({length: 4}, () => Math.floor(Math.random() * 10));
}

// Timeline for showing digits one by one
function createDigitDisplayTimeline(sequence) {
    return sequence.map(digit => ({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div class="text-7xl">${digit}</div>`,
        choices: "NO_KEYS",
        trial_duration: 1000,
        css_classes: ['flex', 'items-center', 'justify-center', 'h-screen']
    }));
}

// Response phase with keypad
var responsePhase = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '',
    choices: [],
    button_html: keypadHTML,
    data: {
        sequence: null,
        response_time: null,
        is_correct: null
    },
    on_load: function(trial) {
        let response = [];
        const responseDisplay = document.getElementById('response-display');
        const digitBtns = document.querySelectorAll('.digit-btn');
        const clearBtn = document.getElementById('clear-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // Record start time
        const startTime = performance.now();
        
        // Add click handlers for digit buttons
        digitBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (response.length < 4) {
                    response.push(parseInt(btn.textContent));
                    responseDisplay.textContent = response.join(' ');
                }
            });
        });
        
        // Clear button handler
        clearBtn.addEventListener('click', () => {
            response = [];
            responseDisplay.textContent = '';
        });
        
        // Submit button handler
        submitBtn.addEventListener('click', () => {
            if (response.length === 4) {
                const endTime = performance.now();
                trial.data.response_time = endTime - startTime;
                trial.data.response = response;
                trial.data.is_correct = JSON.stringify(response) === JSON.stringify(trial.data.sequence);
                trial.end_trial();
            }
        });
    }
};

var ds_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div class="max-w-2xl mx-auto p-6">
            <h1 class="text-2xl mb-4">Digit Span Task</h1>
            <p class="mb-4">You will see a sequence of 4 digits shown one at a time.</p>
            <p class="mb-4">After the sequence, use the on-screen keypad to enter the digits in the order they were presented.</p>
            <p class="text-center mt-8">Press any key to begin.</p>
        </div>
    `,
}

function ds_getPracticeBlock(num_practice){
    var trials = []
    var sequence = []

    // practice instructions
    trials.push(ds_instructions)

    for (let i = 0; i < num_practice; i++) {
        sequence = generateSequence();

        // fixation cross
        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div class="text-4xl">+</div>',
            choices: "NO_KEYS",
            trial_duration: 1000,
            css_classes: ['flex', 'items-center', 'justify-center', 'h-screen']
        })

        // actual digit sequence
        trials.push(...createDigitDisplayTimeline(sequence))

        // Add response phase
        var responseTrial = {...responsePhase};
        responseTrial.data = {...responsePhase.data, sequence: sequence};
        trials.push(responseTrial);
    }

    return trials
}

var ds_practice = {timeline: ds_getPracticeBlock(5)}