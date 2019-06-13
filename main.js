const fs = require("fs");
var glob = require("glob");
const { promisify } = require("util");

fs.statAsync = promisify(fs.stat);
fs.writeFileAsync = promisify(fs.writeFile);
globAsync = promisify(glob);
fs.saveJSONtoFileAsync = function(fileName, jsonData) {
  return fs.writeFileAsync(fileName, JSON.stringify(jsonData), "utf8");
};

Array.prototype.asyncMap = function(callback) {
  return Promise.all(this.map(callback));
};
async function saveListAllFilesRecursive(dirPath, fileOut) {
  console.log({ dirPath });
  var allSourceFilesJSON = {};
  var files = await globAsync(`${dirPath}/**`, {});
  await files.asyncMap(async fileName => {
    let stats = await fs.statAsync(fileName);
    const fileSizeInBytes = stats.size;
    allSourceFilesJSON[fileName] = {
      name: fileName,
      size: stats.size,
      isDirectory: stats.isDirectory()
    };
    return stats;
  });
  console.log("allSourceFilesJSON", allSourceFilesJSON);
  await fs.saveJSONtoFileAsync(fileOut, allSourceFilesJSON);
  console.log("function end");
}
async function main(params) {
  await saveListAllFilesRecursive(
    "/Users/narendrasisodiya/GoogleDriveNSCOM/Google Photos/",
    "allSourceFilesJSON.json"
  );
  console.log("File Saved allSourceFilesJSON.json");

  await saveListAllFilesRecursive(
    "/Users/narendrasisodiya/Google Drive/Google Photos/",
    "allDestinationFilesJSON.json"
  );
  console.log("File Saved allDestinationFilesJSON.json");
}
main();
