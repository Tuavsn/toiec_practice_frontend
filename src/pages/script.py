import os
import shutil

def organize_tsx_files():
    # Get the current directory
    current_directory = os.getcwd()

    # Iterate through all files in the directory
    for file_name in os.listdir(current_directory):
        if file_name.endswith(".tsx"):  # Check for .tsx files
            file_path = os.path.join(current_directory, file_name)
            if os.path.isfile(file_path):  # Ensure it's a file
                # Create a folder with the same name as the file (without extension)
                folder_name = os.path.splitext(file_name)[0]
                folder_path = os.path.join(current_directory, folder_name)
                os.makedirs(folder_path, exist_ok=True)
                
                # Move the .tsx file into the folder
                shutil.move(file_path, os.path.join(folder_path, file_name))
                print(f"Moved {file_name} to folder {folder_name}")

if __name__ == "__main__":
    organize_tsx_files()
