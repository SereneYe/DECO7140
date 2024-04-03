import { fetchEvents } from "../services/fetchEvents.js";
import { getAddressFromCoords } from "../services/geoCoding.js";
import { formatDateTimeYear, getEventEmoji } from "../helper.js";

export const state = {
  events: {},
};

const createEventObject = async function (event) {
  const coords = event.location.split(",").map(Number);
  const [lat, lng] = coords;
  const address = await getAddressFromCoords({ latitude: lat, longitude: lng });
  const emoji = getEventEmoji(event.event_type);

  return {
    id: event.id,
    name: event.name,
    organiser: event.organiser,
    coords: coords,
    address: address,
    type: event.event_type,
    emoji: emoji,
    description: event.description,
    dateTime: formatDateTimeYear(event.date_time),
    photo: event.photo,
  };
};

export const loadEvent = async function () {
  try {
    const events = await fetchEvents();
    const eventObjects = await Promise.all(events.map(createEventObject));
    eventObjects.forEach((eventObject) => {
      state.events[eventObject.id] = eventObject;
    });
  } catch (err) {
    console.error(`${err} 🥲`);
    throw err;
  }
};
