export function GetCurrentTime(): string {
  const currenttime = new Date().getTime();

  return currenttime.toString();
}

export function GetReadalbeTime(str: string): string {
  if (str.includes('NOT SET')) {
    return str;
  }
  const currenttime = new Date(Number(str));
  const year = currenttime.getFullYear().toString();
  const month =
    currenttime.getMonth() < 10
      ? `0${currenttime.getMonth() + 1}`
      : currenttime.getMonth().toString(); // start from 0
  const date =
    currenttime.getDate() < 10
      ? `0${currenttime.getDate()}`
      : currenttime.getDate().toString();

  const hour = currenttime.getHours().toString();
  const minute = currenttime.getMinutes().toString();
  const second =
    currenttime.getSeconds() < 10
      ? `0${currenttime.getSeconds()}`
      : currenttime.getSeconds().toString();
  return `${month}/${date}/${year} ${hour}:${minute}:${second}`;
}

//TODO: Need to figure out:
//系統時間
//時區時間
//換日線時間
