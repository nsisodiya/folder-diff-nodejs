Array.prototype.asyncMap = function(callback) {
  return Promise.all(this.map(callback));
};

function getSquareSync(i) {
  return i * i;
}
function getSquareAsync(i) {
  return new Promise(resolve => setTimeout(() => resolve(i * i), 2000));
}

async function run() {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var result1 = arr.map(getSquareSync);
  console.log("result1", result1);
  // result1 is [ 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 ]
  var result2 = await arr.asyncMap(getSquareAsync);
  console.log("After 2 seconds result2", result2);
  // result2 is [ 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 ]
}

run();
