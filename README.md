# Node.js Log Generator & Analyzer

## Project Overview
This project includes two Node.js applications and one shared module:

1. Log Generator
   - Creates a new folder every minute.  
   - Creates a new log file every 10 seconds.  
   - Writes random log entries (INFO, SUCCESS, ERROR) every second.

2. Log Analyzer 
   - Reads all generated log files.  
   - Calculates statistics for each log type.  
   - Supports the --type CLI parameter for filtering (e.g., --type error).

3. Shared Logger Module
   - A reusable Logger class used by both applications.

### Install dependencies

npm install

### Run the Log Generator

npm run gen

The generator creates a new folder every minute and a new log file every 10 seconds.
Each second, it writes random log entries.
Stop the process with Ctrl + C.

### Run the Log Analyzer

Analyze all logs:

npm run analyze

Filter by log type:

npm run analyze:error
npm run analyze:success
npm run analyze:info

Show help:

node analyzer/index.js --help

## Project Structure

nodeJS_pr1_logs/
 ┣ analyzer/
 ┃ ┗ index.js
 ┣ generator/
 ┃ ┗ index.js
 ┣ shared/
 ┃ ┗ Logger.js
 ┣ package.json
 ┣ README.md
 ┗ .gitignore
