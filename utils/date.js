// for passing date to solidity args we should convert the date from milliseconds to seconds
export const dateToSeconds = (targetDate) => {
  const date = new Date(targetDate);
  const convertedDate = Math.floor(date.getTime() / 1000);
  return convertedDate;
};

export const countDownTimer = (startTime, endTime) => {
  let countDown, message;
  if (!isEnded(startTime)) {
    (countDown = startTime), (message = "starts");
  } else if (!isEnded(endTime)) {
    countDown = endTime;
    message = "ends";
  } else {
    return false;
  }

  const now = new Date().getTime() / 1000;

  const difference = countDown - now;

  const days = Math.floor(difference / (60 * 60 * 24));
  const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((difference % (60 * 60)) / 60);
  const seconds = Math.floor(difference % 60);

  return { days, hours, minutes, seconds, message };
};

// to check passed time is smaller than current date
export const isEnded = (time) => {
  // convert argument from  seconds to milliseconds
  time = time * 1000;
  const targetDate = new Date(time).getTime();
  const now = new Date().getTime();

  return now > targetDate ? true : false;
};
