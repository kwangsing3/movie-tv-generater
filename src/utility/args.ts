// 分析帶入的標頭屬性

/**
 * example code:
 * const args: {[x: string]: string}  = GetArgs();
 */
 export function GetArgs() {
  const args: {[x: string]: string} = {};
  process.argv.slice(2).map(element => {
    const matches = element.match('--([a-zA-Z0-9]+)=(.*)');
    if (matches) {
      args[matches[1]] = matches[2].replace(/^['"]/, '').replace(/['"]$/, '');
    }
  });
  return args;
}
