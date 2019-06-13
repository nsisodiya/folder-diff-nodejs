const fs = require("fs");
var glob = require("glob");
const { promisify } = require("util");
const loopObject = require("loopobject");

fs.statAsync = promisify(fs.stat);
fs.writeFileAsync = promisify(fs.writeFile);
fs.readFileAsync = promisify(fs.readFile);

async function run() {
  //read source fileList
  var src =
    "/Users/narendrasisodiya/rivigoCode/filetransfer/allSourceFilesJSON.json";
  var dest =
    "/Users/narendrasisodiya/rivigoCode/filetransfer/allDestinationFilesJSON.json";
  var srcData = JSON.parse(await fs.readFileAsync(src));
  var destData = JSON.parse(await fs.readFileAsync(dest));
  var filesToDelete = "";
  loopObject(srcData, sourceFile => {
    if (sourceFile.isDirectory === false) {
      var destFile =
        destData[sourceFile.name.replace("GoogleDriveNSCOM", "Google Drive")];
      if (destFile !== undefined) {
        if (destFile.size === sourceFile.size) {
          filesToDelete = filesToDelete + "\n" + sourceFile.name;
        }
        // console.log(
        //   "destination file exist",
        //   destFile.name,
        //   ["", "source file is small"][+(sourceFile.size < destFile.size)],
        //   ["", "Both file are same"][+(destFile.size === sourceFile.size)]
        // );
      }
    }
    //console.log("source filename", file);
  });
  console.log(filesToDelete);
}

run();
