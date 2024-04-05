import { state, loadEvent, uploadEvent } from "./model.js";
import resultsView from "./view/resultsView.js";
import eventView from "./view/eventView.js";
import EventController from "../controlEvent.js";
import addEventView from "./view/addEventView.js";

const controlSearchResults = async () => {
  try {
    // 1) Load search results
    await loadEvent();
    console.log(state.events);
    // 2) Render results on UI
    resultsView.render(state.events);
  } catch (err) {
    console.error(err);
  }
};

const controlEvents = async () => {
  try {
    // 1) Load event
    await loadEvent();
    // 2) Render event on UI
    const id = window.location.hash.slice(1);
    if (!id) return;
    const eventsArray = Object.values(state.events);
    const Event = eventsArray.find((event) => event.id.toString() === id);
    eventView.render(Event);
  } catch (err) {
    console.error(err);
  }
};

const controlSortedResults = async () => {
  try {
    // 1) Load search results
    await loadEvent();
    // 2) Create Controller instance
    const eventController = new EventController(state.events);

    // 3) Listen for changes on the sort select
    document
      .getElementById("sortSelect")
      .addEventListener("change", function (e) {
        let sortBy = e.target.value;

        // Sort events
        let sortedEvents = eventController.sortEvents(sortBy);

        // Update state.events
        state.events = sortedEvents;

        // 4) Render results on UI
        resultsView.render(state.events);
      });
  } catch (err) {
    console.error(err);
  }
};

/////////////////////////
const controlAddEvent = async function (newEvent) {
  try {
    // Upload the new Event data
    await uploadEvent(newEvent);
    console.log(state.events);
    // Render events
    eventView.render(state.events);

    // Close form window
    setTimeout(function () {
      addEventView.togglePopup();
    }, 5 * 1000);
  } catch (err) {
    console.error("🥲🥲🥲", err);
    addEventView.renderError(err.message);
  }
};

//////////////////////////

const init = function () {
  controlSearchResults();
  controlSortedResults();
  eventView.addHandlerRender(controlEvents);
  addEventView.addHandlerUpload(controlAddEvent);
};

/////////////////////////////
init();