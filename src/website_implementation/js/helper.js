export function getEventEmoji(eventType) {
  eventType = eventType.toLowerCase();
  switch (eventType) {
    case "workshop":
      return "🛠️";
    case "seminar":
      return "📚";
    case "group activity":
      return "💃";
    case "webinar":
      return "💻";
    default:
      return "🧘";
  }
}

export function formatDateTime(dateTime) {
  // Split the date and time
  const [datePart, timePart] = dateTime.split(" ");
  // Split the date into day, month, year
  const [day, month, year] = datePart.split("/");
  // Create a new date string in the format MM/DD/YYYY
  const newDateStr = `${month}/${day}/${year} ${timePart}`;
  const date = new Date(newDateStr);
  const dayStr = String(date.getDate()).padStart(2, "0");
  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayStr}/${monthStr} ${hours}:${minutes}`;
}

export function formatDateTimeYear(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
