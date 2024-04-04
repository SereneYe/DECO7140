import View from "./View.js";

class AddEventView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Upload event successfully!";
  _popup = document.querySelector(".add-event-popup");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-event");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowPopup();
    this._addHandlerHidePopup();
  }

  togglePopup() {
    this._overlay.classList.toggle("hidden");
    this._popup.classList.toggle("hidden");
  }

  _addHandlerShowPopup() {
    this._btnOpen.addEventListener("click", this.togglePopup.bind(this));
  }

  _addHandlerHidePopup() {
    this._btnClose.addEventListener("click", this.togglePopup.bind(this));
    this._overlay.addEventListener("click", this.togglePopup.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddEventView();
