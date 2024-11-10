import * as core from '@actions/core';
const isAction = process.env['isAction'] ?? false;

const originalLog = console.log;
const originalError = console.error;
// 定義擴充的 log 函數
console.log = (...args) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${args.join(' ')}`;

  if (isAction) {
    core.info(logMessage);
  } else {
    originalLog(logMessage);
  }
};
console.error = (...args) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${args.join(' ')}`;

  if (isAction) {
    core.setFailed(logMessage);
  } else {
    originalError(logMessage);
  }
};
