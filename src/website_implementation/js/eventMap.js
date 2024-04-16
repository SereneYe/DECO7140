"use strict";

import { state, loadEvent } from "./events/model.js";
import { getEventEmoji, formatDateTime } from "./helper.js";
import { postEvent } from "./services/postEvent.js";

class Event {
  constructor(id, coords, name, dateTime, type, organizer, description) {
    // this.date = ...
    this.id = id;
    this.coords = coords; // [lat, lng]
    this.name = name;
    this.dateTime = dateTime;
    this.type = type;
    this.organizer = organizer;
    this.description = description;
    this.emoji = getEventEmoji(this.type);
  }
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector(".form");
const containerEvents = document.querySelector(".events");
const inputName = document.querySelector(".form__input--name");
const inputType = document.querySelector(".form__input--type");
const inputTime = document.querySelector(".form__input--dateTime");
const inputOrganiser = document.querySelector(".form__input--organiser");
const inputDescription = document.querySelector(".form__input--description");
const inputPhoto = document.querySelector(".form__input--photo");

class App {
  #map;
  #mapZoomLevel = 14;
  #mapEvent;
  #events = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._adjustAPIData();

    // Attach event handlers
    form.addEventListener("submit", this._newEvent.bind(this));
    // inputType.addEventListener("change", this._toggleElevationField);
    containerEvents.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));

    this.#events.forEach((event) => {
      this._renderEventMarker(event);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputName.focus();
  }

  _hideForm() {
    // Empty inputs
    inputName.value =
      inputTime.value =
      inputOrganiser.value =
      inputDescription.value =
      inputPhoto.value =
        "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  async _newEvent(e) {
    const validInputs = (...inputs) => inputs.every((inp) => inp !== "");
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const name = inputName.value;
    const dateTime = inputTime.value;
    const organizer = inputOrganiser.value;
    const description = inputDescription.value;
    const photo = inputPhoto.files[0];
    const { lat, lng } = this.#mapEvent.latlng;
    const latLngString = `${lat}, ${lng}`;
    let event;

    if (!validInputs(name, dateTime, type, organizer, description)) {
      return alert("All inputs have to be filled!");
    }

    const pushCloudEvent = {
      name: name,
      organiser: organizer,
      location: latLngString,
      event_type: type,
      description: description,
      date_time: dateTime,
      photo: photo,
    };

    const returnedEvent = await postEvent(pushCloudEvent);

    console.log("return: ", returnedEvent);

    event = new Event(
      returnedEvent.id,
      [lat, lng],
      returnedEvent.name,
      formatDateTime(returnedEvent.date_time),
      returnedEvent.event_type,
      returnedEvent.organiser,
      returnedEvent.description
    );

    // Add new object to event array
    this.#events.push(event);

    // Render event on map as marker
    this._renderEventMarker(event);

    // Render Event on list
    this._renderEvent(event);

    // Hide form + clear input fields
    this._hideForm();
  }

  _renderEventMarker(event) {
    L.marker(event.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${event.type}-popup`,
        })
      )

      .setPopupContent(`${event.emoji}  ${event.name}`)
      .openPopup();
  }

  _renderEvent(event) {
    let html = `
      <li class="event event--${event.type}" data-id="${event.id}" tabindex="0">
        <h2 class="event__title">${event.name}</h2>
        
        <div class="event__details">
          <span class="event__icon">${event.emoji}</span>
          <span class="event__value">${event.type}</span>
        </div>

        <div class="event__details">
          <span class="event__icon">📅</span>
          <span class="event__value">${event.dateTime}</span>
        </div>

        <div class="event__details">
          <span class="event__icon">🙎🏼</span>
          <span class="event__value">${event.organizer}</span>
          
        </div>

        <div class="event__details">
        <span class="event__icon">👉 </span>
          <a class="event__link" href="events.html#${event.id}" target="_blank">
              <span class="event__value">See the Event</span>
            </a> 
        </div>
        
        
    
      <div class="event__details-description">
          <span class="event__icon">📍</span>
          <span class="event__value">${event.description}</span>
        </div>
     
        </li>
      `;

    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(e) {
    if (!this.#map) return;

    const eventEl = e.target.closest(".event");

    if (!eventEl) return;
    console.log(this.#events);

    const event = this.#events.find((event) => {
      return event.id == eventEl.dataset.id;
    });

    this.#map.setView(event.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the public interface
    event.click();
  }

  async _adjustAPIData() {
    await loadEvent();
    const eventsArray = Object.values(state.events);
    eventsArray.forEach((event) => {
      const { id, coords, name, dateTime, type, organiser, description } =
        event;

      const newEvent = new Event(
        id,
        coords,
        name,
        formatDateTime(dateTime),
        type,
        organiser,
        description
      );

      this.#events.push(newEvent);
    });

    console.log(this.#events);
    this.#events.forEach((event) => {
      this._renderEvent(event);
    });
  }
}

const app = new App();
