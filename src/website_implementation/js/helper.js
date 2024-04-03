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
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month} ${hours}:${minutes}`;
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
