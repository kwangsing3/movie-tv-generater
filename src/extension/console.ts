import * as core from '@actions/core';
const isAction = process.env['isAction'] ?? false;

const originalLog = console.log;
// 定義擴充的 log 函數
console.log = (...args) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${args.join(' ')}`;

  if (isAction) {
    core.setFailed(logMessage);
  } else {
    originalLog(logMessage);
  }
};
