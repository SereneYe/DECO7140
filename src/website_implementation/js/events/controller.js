import { state, loadEvent } from "./model.js";
import { ResultsView } from "./view2/resultsView.js";
import { EventView } from "./view2/eventView.js";
import EventController from "../controlEvent.js";

const controlSearchResults = async () => {
  try {
    // 1) Load search results
    await loadEvent();
    console.log(state.events);
    // 2) Render results on UI
    const resultsView = new ResultsView();
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
    const eventView = new EventView();
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
        const resultsView = new ResultsView();
        resultsView.render(state.events);
      });
  } catch (err) {
    console.error(err);
  }
};

//////////////////////////

const init = function () {
  controlSearchResults();
  controlEvents();
  controlSortedResults();
  window.addEventListener("hashchange", controlEvents);
  window.addEventListener("load", controlEvents);
};

/////////////////////////////
init();
