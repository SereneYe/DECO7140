import { state, loadEvent } from "./model.js";
import { ResultsView, PreviewView } from "./view2/resultsView.js";
import { EventView } from "./view2/eventView.js";

const controlSearchResults = async () => {
  try {
    // 1) Load search results
    await loadEvent();
    // 2) Render results on UI
    const previewView = new PreviewView();
    const resultsView = new ResultsView();
    resultsView.render(state.events);
  } catch (err) {
    console.error(err);
  }
};

const controlEvent = async () => {
  try {
    // 1) Load event
    await loadEvent();
    // 2) Render event on UI
    const eventView = new EventView();
    const eventsArray = Object.values(state.events);
    const firstEvent = eventsArray[0];
    eventView.render(firstEvent);
  } catch (err) {
    console.error(err);
  }
};
//////////////////////////

const init = function () {
  controlSearchResults();
  controlEvent();
};

/////////////////////////////
init();
