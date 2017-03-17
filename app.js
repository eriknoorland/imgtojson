/* globals __dirname, Buffer */

/**
 * This module looks through the given image folder
 * and creates a json file per folder with
 * base64 encoded images
 *
 * node app.js <image source path> [optional]
 * i.e. node app.js ./img
 * i.e. node app.js
 */

'use strict';

var fs = require('fs');
var path = require('path');
var args = process.argv.slice(2);
var baseDir = __dirname;
var sourceDir = args[0] || baseDir + '/img';
var outputDir = baseDir + '/output';
var fileTypes = ['.jpg', '.png'];

// create output directory if it doesn't exist
if(!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, '0744');
}

/**
 * Writes the content to disk
 *
 * @param {String} name
 * @param {String} content
 */
function saveToFile(name, content) {
  var file = outputDir + '/' + name + '.json';

  if(fs.existsSync(file)) {
    fs.unlinkSync(file);
  }

  fs.writeFileSync(file, content);
}

/**
 * Returns a array containing all files found
 * recursively in the given directory
 *
 * @param {String} dir
 * @return {Array}
 */
function getFiles(dir) {
  var files = [];

  if(fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function(filename) {
      var file = dir + '/' + filename;

      if(fs.statSync(file).isDirectory()) {
        saveToFile(filename, JSON.stringify(getFiles(dir + '/' + filename)));
      } else {
        if(fileTypes.indexOf(path.extname(filename)) !== -1) {
          var readFile = fs.readFileSync(file);
          var base64String = new Buffer(readFile).toString('base64');

          files.push({
            file: base64String
          });
        }
      }
    });
  }

  return files;
}

getFiles(sourceDir);
