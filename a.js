var getTime = (() => {
  var e = Date.now();
  return () => (Date.now() - e) / 1e3;
})();

Array.prototype.asyncMapP = function(t) {
  return Promise.all(this.map(t));
};

Array.prototype.asyncMapPool = async function(t, poolSize) {
  var fullpool = [];
  var isCompleted = this.map(() => false);
  var length = this.length;
  var self = this;

  return new Promise(function(resolve, reject) {
    function addNewToPool() {
      if (i < length) {
        var copyI = i;
        fullpool.push(
          t(self[i], i, self).then(function(v) {
            isCompleted[copyI] = true;
            if (isCompleted.filter(v => v === false).length === 0) {
              resolve(Promise.all(fullpool));
            }
            addNewToPool(); //add a new to pool.
            return v;
          })
        );
      }
      i++;
    }
    for (var i = 0; i < poolSize; ) {
      addNewToPool();
    }
  });
};

Array.prototype.asyncMapS = async function(t) {
  for (var r = [], a = 0; a < this.length; a++)
    r.push(await t(this[a], a, this));
  return r;
};

Array.prototype.asyncReduce = async function(t, r) {
  for (var a = r, n = 0; n < this.length; n++) a = await t(a, this[n], n, this);
  return a;
};

function getSquare(v, i, arr) {
  console.log(`executing getSquare at ${getTime()} , ${v}, ${i}`);
  return v * v;
}

function getSquareAsync(v, i, arr) {
  return new Promise(resolve =>
    setTimeout(() => {
      console.log(`executing getSquareAsync at ${getTime()}, ${v}, ${i}`);
      resolve(v * v);
    }, 2000)
  );
}
function getArraySumAsync(accumulator, v, i, arr) {
  return new Promise(resolve =>
    setTimeout(() => resolve(accumulator + v), 2000)
  );
}

function getArraySum(accumulator, v, i, arr) {
  console.log(`executing getArraySum at ${getTime()}`, accumulator, v, i);
  return accumulator + v;
}
function getArraySumAsync(accumulator, v, i, arr) {
  return new Promise(resolve =>
    setTimeout(() => {
      console.log(
        `executing getArraySumAsync at ${getTime()}`,
        accumulator,
        v,
        i
      );
      resolve(accumulator + v);
    }, 2000)
  );
}

async function run() {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var result1 = arr.map(getSquare);
  console.log(`result1 @ ${getTime()}`, result1);
  var result2 = await arr.asyncMapPool(getSquareAsync, 1);

  console.log(`result2 @ ${getTime()}`, result2);

  // var result3 = await arr.asyncMapS(getSquareAsync);
  // console.log(`result3 @ ${getTime()}`, result3);

  // var result4 = arr.reduce(getArraySum, 0);
  // console.log(`result4 @ ${getTime()} - Sum is`, result4);

  // var result5 = await arr.asyncReduce(getArraySumAsync, 0);
  // console.log(`result5 @ ${getTime()} - Sum is`, result5);
}

run();
