import os
import re

def extract_scripts_from_html(html_filename):
    """Extract JavaScript code from the given HTML file."""
    with open(html_filename, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regular expression to match <script>...</script>
    script_pattern = re.compile(r'<script[^>]*>(.*?)</script>', re.DOTALL)
    scripts = script_pattern.findall(content)

    return scripts

def read_js_file(js_filename):
    """Read the content of a JavaScript file."""
    with open(js_filename, 'r', encoding='utf-8') as file:
        return file.read()

def combine_scripts(filenames, output_js_filename):
    """Combine all JavaScript code from given HTML and JS files into one file."""
    combined_scripts = []

    for filename in filenames:
        if filename.endswith('.html'):
            scripts = extract_scripts_from_html(filename)
            combined_scripts.extend(scripts)
            combined_scripts.append('//################ FILE ENDS ######################################## \n')
        elif filename.endswith('.js'):
            script_content = read_js_file(filename)
            combined_scripts.append(script_content)
            combined_scripts.append('//################ FILE ENDS ########################################## \n')
        else:
            print(f"Unsupported file type: {filename}")

    with open(output_js_filename, 'w', encoding='utf-8') as file:
        for script in combined_scripts:
            file.write(script + '\n')

if __name__ == "__main__":
    ## must do this in the order you want them to be in (so experiment.html must be last)
    files = ['./js/init-jspsych.js','./js/instructions.js','./js/spatial-recall.js','./js/digit-span.js','./js/rest-experiment.js','experiment.html']  # Add your filenames here
    output_file = './cognition_run_files/combined_scripts_final_dec19.js'
    
    combine_scripts(files, output_file)
    print(f"Combined scripts have been written to {output_file}")
