export const dateCountdown = (value: Date | string) => {
  const dueDate = new Date(value).getTime();

  // Get the current date and time
  const currentDate = new Date().getTime();

  // Calculate the time remaining
  const timeRemaining = dueDate - currentDate;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  // Display the time remaining based on remaining time
  if (days >= 1) {
    return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
  } else if (hours >= 1) {
    return `${hours} ชั่วโมง ${minutes} นาที`;
  } else if (minutes >= 1) {
    return `${minutes} นาที`;
  }
  return "";
};
