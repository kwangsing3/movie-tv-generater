import * as core from '@actions/core';
export function log(msg: string) {
  if (process.env['isAction']) {
    core.debug(`${msg}`);
  } else {
    console.log(msg);
  }
}
export function warn(msg: string) {
  if (process.env['isAction']) {
    core.warning(`${msg}`);
  } else {
    console.warn(msg);
  }
}

export function error(msg: string | unknown) {
  if (process.env['isAction']) {
    core.error(`${msg}`);
  } else {
    console.error(msg);
  }
}

export function assert(msg: string) {
  if (process.env['isAction']) {
    core.setFailed(`${msg}`);
  } else {
    console.assert(msg);
  }
}
