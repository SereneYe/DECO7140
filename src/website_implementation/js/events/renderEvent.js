import { state, loadEvent } from "./createEvent.js";
import View from "./view/View.js";

loadEvent().then(() => {
  console.log(state.events);
});

class EventView extends View {
  _parentElement = document.querySelector(".event");
  _errorMessage = "We could not find that event. Please try another one!";
  _message = "";

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  _generateMarkup() {
    return `
        <figure class="event__fig">
          <img src="${this._data.photo}" alt="${this._data.name}" class="event__img"/>
          <h1 class="event__title">
            <span>${this._data.name}</span>
          </h1>
        </figure>

     <div class="event__details">
          <div class="event__info">
          <span class="event__info-text">Event Type: </span>
            <span class="event__info-data event__info-data--minutes"
              >${this._data.type}</span>
          </div>

        
          <div class="event__info">
            <span class="event__info-text">Start Time: </span>
            <span class="event__info-data event__info-data--minutes">${this._data.dateTime}</span>
           
          </div>

          <div class="event__info full-width">
            <h2 class="heading--2">Holding Location: </h2>
            <span class="event__info-data event__info-data--minutes">${this._data.address}</span>
            <a class="btn--small event__btn" href="uploadMap.html" target="_blank">
              <span>See on the map</span>
            </a>
          </div>
          
        <div class="event__directions full-width">
          <h2 class="heading--2">Description: </h2>
          <p class="event__directions-text">
            ${this._data.description}.
           Hold by 
          <span class="event__publisher">${this._data.organiser}</span></p>
          
        </div>  
    `;
  }
}

const eventView = new EventView();

loadEvent().then(() => {
  const eventsArray = Object.values(state.events);
  const firstEvent = eventsArray[0];
  eventView.render(firstEvent);
});
