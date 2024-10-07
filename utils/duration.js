const formattedDuration = (duration) => {
  if (duration < 60) {
    return `${duration} seconds`;
  } else if (duration < 3600) {
    return `${duration / 60} minutes`;
  } else if (duration < 86400) {
    return `${duration / 3600} hours`;
  } else {
    const days = Math.floor(duration / 86400);
    const remainingSeconds = duration % 86400;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    let result = `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) {
      result += `, ${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      result += `, ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (seconds > 0) {
      result += `, ${seconds} second${seconds > 1 ? "s" : ""}`;
    }
    return result;
  }
};

exports.formattedDuration = formattedDuration;
