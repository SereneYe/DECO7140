// view.js
import View from "./View.js";

export class PreviewView extends View {
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
                <p class="preview__organizer">${this._data.organiser}</p>    
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
    const previewView = new PreviewView();
    return resultsArray
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
