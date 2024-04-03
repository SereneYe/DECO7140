import { state, loadEvent } from "./createEvent.js";
import View from "./view/View.js";

loadEvent().then(() => {
  console.log(state.events);
});

class PreviewView extends View {
  _parentElement = "";

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

export default new PreviewView();
