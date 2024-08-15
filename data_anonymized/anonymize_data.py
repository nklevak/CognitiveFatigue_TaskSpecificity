# this takes in a folder of data and removes all identified information 
# (location, browser, ip, prolific id, etc) and then saves them all to one large anonymized csv file

import os
import pandas as pd
import argparse

def concatenate_and_modify_csv_files(input_folder, output_file, columns_to_delete):
    # List to store DataFrames
    dataframes = []

    # Iterate through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(".csv"):
            # Construct full file path
            file_path = os.path.join(input_folder, filename)
            
            # Read the CSV file
            df = pd.read_csv(file_path)
            
            # drop additional columns
            columns_to_delete.extend(list(df.filter(like="browser").columns))
            columns_to_delete.extend(list(df.filter(like="platform").columns))
            
            columns_to_delete = list(columns_to_delete)
            
            # Drop all columns
            df.drop(columns=columns_to_delete, inplace=True, errors='ignore')
            
            # drop prolific id row
            df = df[~df['response'].str.contains("prolific_id", na=False)]
            
            # Append the modified DataFrame to the list
            dataframes.append(df)
            print(f"Processed: {filename}")

    # Concatenate all DataFrames
    concatenated_df = pd.concat(dataframes, ignore_index=True)
    
    # Save the concatenated DataFrame to a new CSV file
    concatenated_df.to_csv(output_file, index=False)
    print(f"All data saved to: {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Concatenate and modify CSV files.')

    # Add arguments
    parser.add_argument('input_folder', type=str, help='Path to the input folder containing CSV files.')
    parser.add_argument('output_file', type=str, help='Path to the output CSV file.')
    
    # columns
    columns = ["recorded_at","ip","user_agent","referer","sequence_length",
         "accept_language","device","platform","platform_version","internal_node_id","view_history",
         "source_code_version"]

    # Parse arguments
    args = parser.parse_args()

    # Call the function with parsed arguments
    concatenate_and_modify_csv_files(args.input_folder, args.output_file, columns)

if __name__ == "__main__":
    main()