import { state, loadEvent } from "./createEvent.js";
import View from "./view/View.js";

loadEvent().then(() => {
  console.log(state.events);
});

class PreviewView extends View {
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
            <a class="preview__link ${
              this._data.id === id ? "preview__link--active" : ""
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.photo}" alt="${this._data.name}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.name}</h4>
                <p class="preview__publisher">${this._data.organiser}</p>    
              </div>
            </a>
          </li>
    `;
  }
}

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No event found for your query! Please try again!";
  _message = "";

  _generateMarkup() {
    const resultsArray = Object.values(this._data);
    return resultsArray
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

const resultsView = new ResultsView();

const previewView = new PreviewView();

const renderAllEvents = async () => {
  await loadEvent();

  await loadEvent();
  resultsView.render(state.events);
  // const eventsArray = Object.values(state.events);
  // eventsArray.forEach((event) => {
  //   resultsView.render(event);
  // });
};

renderAllEvents();
