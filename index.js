const { exec } = require('child_process');
const fs = require('fs');

// Find the index of the "--files" parameter in the command line arguments
const filesIndex = process.argv.indexOf('--files');
const outputFilePath = 'output.mp4';
let filesValue;
const inputFiles = [];

for (let i = 1; i <= filesValue; i++) {
  inputFiles.push(`${i}.mp4`);
}

// If the "--files" parameter exists and has a value
if (filesIndex !== -1 && filesIndex + 1 < process.argv.length) {
  // Get the value of the "--files" parameter
  filesValue = process.argv[filesIndex + 1];

  // Use the value in your program
  console.log(`Number of files: ${filesValue}`);
} else {
  // The "--files" parameter was not provided or does not have a value
  console.log('Please provide a value for the --files parameter.');
  process.exit(1); // Exit the program with an error code (1)
}

function mergeMP4Files(filePaths, outputFilePath, callback) {
  const fileListPath = 'filelist.txt';

  // Create a text file with the list of input file paths
  fs.writeFileSync(fileListPath, filePaths.map(path => `file '${path}'`).join('\n'));

  // FFmpeg command to merge the files
  const ffmpegCmd = `ffmpeg -f concat -safe 0 -i ${fileListPath} -c copy ${outputFilePath}`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    // Cleanup: delete the temporary file list
    fs.unlinkSync(fileListPath);

    if (error) {
      console.error(`Error merging files: ${stderr}`);
      callback(error);
    } else {
      console.log(`Files merged successfully into ${outputFilePath}`);
      callback(null);
    }
  });
}

mergeMP4Files(inputFiles, outputFilePath, (error) => {
  if (error) {
    console.error('An error occurred while merging the files:', error);
  } else {
    console.log('Files merged successfully!');
  }
});


// TODO: Add progress logs