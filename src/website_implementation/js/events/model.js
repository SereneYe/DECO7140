import { fetchEvents } from "../services/fetchEvents.js";
import { getAddressFromCoords } from "../services/geoCoding.js";
import { formatDateTimeYear, getEventEmoji } from "../helper.js";
import { postEvent } from "../services/postEvent.js";

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

////////////////////////////////////////////////////
export const uploadEvent = async function (newEvent) {
  try {
    console.log("model:", newEvent);
    const coords = newEvent.coords.split(",").map(Number);
    const [lat, lng] = coords;
    const address = await getAddressFromCoords({
      latitude: lat,
      longitude: lng,
    });
    const emoji = getEventEmoji(newEvent.type);

    const pushCloudEvent = {
      name: newEvent.name,
      organiser: newEvent.organiser,
      location: newEvent.coords,
      event_type: newEvent.type,
      description: newEvent.description,
      date_time: newEvent.dateTime,
      photo: newEvent.photo,
      websiteCode: newEvent.websiteCode,
    };

    console.log("push: ", pushCloudEvent);

    const returnedEvent = await postEvent(pushCloudEvent);

    console.log("return: ", returnedEvent);

    const newRenderEvent = {
      id: returnedEvent.id,
      name: returnedEvent.name,
      organiser: returnedEvent.organiser,
      coords: coords,
      address: address,
      type: returnedEvent.event_type,
      emoji: emoji,
      description: returnedEvent.description,
      dateTime: formatDateTimeYear(returnedEvent.date_time),
      photo: returnedEvent.photo,
    };

    state.events[newRenderEvent.id] = newRenderEvent;
  } catch (err) {
    throw err;
  }
};

////////////////////////////////////////////////////
