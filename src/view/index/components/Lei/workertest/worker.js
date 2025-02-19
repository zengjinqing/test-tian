// worker.js

self.onmessage = function (event) {
  const result = processData(event.data);  // 执行数据处理操作
  console.log("result", result, event);
  postMessage(result); // 将处理后的数据发送回主线程
};


// 执行数据处理操作
function processData(data) {
  // 在这里进行数据处理操作
  let sum = 0;
  for (let i = 0; i < 200000; i++) {
    for (let i = 0; i < 10000; i++) {
      sum += Math.random()
    }
  }
  return '处理结果: ' + data + '/' + sum;
}