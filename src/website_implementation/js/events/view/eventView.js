import View from "./View.js";

class EventView extends View {
  _parentElement = document.querySelector(".event");
  _errorMessage = "We could not find that event. Please try another one!";
  _message = "";

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) => {
      window.addEventListener(ev, handler);
    });
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
          
     
     <div class="event__info-row">
          <h2 class="heading--2">⭐️ Event Type :  </h2>
            <span class="event__info-data"
              >${this._data.type}</span>
        </div>

        
          <div class="event__info-row">
            <h2 class="heading--2">📅 Start Time :  </h2>
            <span class="event__info-data">${this._data.dateTime}</span>
           
          </div>

          <div class="event__info-column">
          <h2 class="heading--2">📍 Holding Location: </h2>
  
            <span class="event__info-data">${this._data.address}</span>
            <a class="event__info-data event__info-buttons" href="eventMap.html" target="_blank">
              <span>See on the map</span>
            </a> 
          </div>
          
        <div class="event__info-column">
          <h2 class="heading--2">📝 Description : </h2>
          <p class="event__info-text">
            ${this._data.description}.
           Hold by 
          <span class="event__organizer">${this._data.organiser}</span></p>
          
        </div>  

        <div class="event__info-row">
          <h2 class="heading--2">👩🏼‍🦱 User Comments  :</h2>
          <a class="event__info-data event__info-buttons" href="blog.html" target="_blank">
              <span>See blogs here</span>
            </a> 
          
        </div>  
    `;
  }
}

export default new EventView();
