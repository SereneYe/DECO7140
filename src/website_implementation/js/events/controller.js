import { state, loadEvent } from "./model.js";
import { ResultsView } from "./view2/resultsView.js";
import { EventView } from "./view2/eventView.js";

const controlSearchResults = async () => {
  try {
    // 1) Load search results
    await loadEvent();
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
    console.log(id);
    if (!id) return;
    const eventsArray = Object.values(state.events);
    console.log(eventsArray);
    const Event = eventsArray.find((event) => event.id.toString() === id);
    console.log(Event);
    eventView.render(Event);
  } catch (err) {
    console.error(err);
  }
};

//////////////////////////

const init = function () {
  controlSearchResults();
  controlEvents();
  window.addEventListener("hashchange", controlEvents);
  window.addEventListener("load", controlEvents);
};

/////////////////////////////
init();
