import View from "./view/View.js";
import previewView from "./generatePreview.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No event found for your query! Please try again!";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
