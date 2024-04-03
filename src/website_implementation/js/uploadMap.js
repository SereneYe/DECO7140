"use strict";
import { state, loadEvent } from "./events/model.js";
import { getEventEmoji, formatDateTime } from "./helper.js";

class Event {
  date = new Date();
  id = Number((Date.now() + "").slice(-3));
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
const inputOrganizer = document.querySelector(".form__input--organizer");
const inputDescription = document.querySelector(".form__input--description");

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #events = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();
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

    this.#events.forEach((work) => {
      this._renderEventMarker(work);
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
      inputOrganizer.value =
      inputDescription.value =
        "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _newEvent(e) {
    const validInputs = (...inputs) => inputs.every((inp) => inp !== "");
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const name = inputName.value;
    const dateTime = inputTime.value;
    const organizer = inputOrganizer.value;
    const description = inputDescription.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let event;

    if (!validInputs(name, dateTime, type, organizer, description)) {
      return alert("All inputs have to be filled!");
    }

    event = new Event([lat, lng], name, dateTime, type, organizer, description);
    // Add new object to event array
    this.#events.push(event);

    // Render event on map as marker
    this._renderEventMarker(event);

    // Render Event on list
    this._renderEvent(event);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all Events
    this._setLocalStorage();
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
      <li class="event event--${event.type}" data-id="${event.id}">
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

    const event = this.#events.find((event) => event.id === eventEl.dataset.id);

    this.#map.setView(event.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the public interface
    // event.click();
  }

  _setLocalStorage() {
    localStorage.setItem("events", JSON.stringify(this.#events));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("events"));

    if (!data) return;

    this.#events = data;

    this.#events.forEach((event) => {
      this._renderEvent(event);
    });
  }

  async _adjustAPIData() {
    await loadEvent();
    const eventsArray = Object.values(state.events);
    eventsArray.forEach((event) => {
      const { id, coords, name, dateTime, type, organiser, description } =
        event;
      let newEvent = {
        date: new Date().toISOString(),
        id: id,
        coords: coords,
        name: name,
        dateTime: formatDateTime(dateTime),
        type: type,
        organizer: organiser,
        description: description,
        emoji: getEventEmoji(type),
      };

      this.#events.push(newEvent);
    });

    console.log(this.#events);
    this.#events.forEach((event) => {
      this._renderEvent(event);
    });
  }

  reset() {
    localStorage.removeItem("events");
    location.reload();
  }
}

const app = new App();
