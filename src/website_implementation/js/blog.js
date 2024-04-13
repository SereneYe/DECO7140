import fakeDataList from "./blogFakeData.js";

// Initiate Masonry
const masonry = document.querySelector(".container-photo");
const divider1 = masonry.querySelector(".divider1");

// variables
let pageSize = 12;
let cardCount = 0;
let colHeights = [0, 0, 0, 0]; // each column's height
let observer; // intersection observer

function loadCard() {
  for (let i = 0; i < pageSize; i++) {
    createCard(i);
  }
}

function observe(card) {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      if (entries.length === 1 && entries[0].isIntersecting) {
        loadCard();
        observer.unobserve(entries[0].target);
      }
    });
  }
  observer.observe(card);
}

function createCard(i) {
  const fakeData = fakeDataList[i];
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.setAttribute("tabindex", "0");
  // hide card at beginning
  cardElement.style.position = "fixed";
  cardElement.style.top = 0;
  cardElement.style.left = 0;
  cardElement.style.visibility = "hidden";

  const cardMarkup = `
      <img src="${fakeData.imgSrc}" class="card-img" alt=${fakeData.imageDescription} />
      <div class="card-content">
        
          <p class="card-attribute">
            <span>${fakeData.comment}</span>
            
          </p>
          <a class="blog-link" href="#">👉See Event👈</a>
          <p class="card-username">${fakeData.username}</p>
      </div>
  `;

  cardElement.innerHTML = cardMarkup;
  document.body.append(cardElement);

  const cardIndex = cardCount;
  const colIndex = (cardIndex + 1) % 3;
  let cardHeight = cardElement.clientHeight;
  if (cardHeight < 400) {
    cardHeight = 400;
  }
  colHeights[colIndex] += cardHeight;
  setMasonryHeight();
  masonry.insertBefore(cardElement, divider1);
  cardCount++;

  cardElement.style.position = "";
  cardElement.style.visibility = "";
  cardElement.classList.add("show");

  // Listen for the end of the animation
  cardElement.addEventListener("animationend", () => {
    // Remove the 'show' class and add the 'hover' class
    cardElement.classList.remove("show");
    cardElement.classList.add("card-hover");
  });

  if (i === pageSize - 1) {
    observe(cardElement);
  }
}

function updateCardHeight(imgElement) {
  return new Promise((resolve) => {
    const cardElement = imgElement.parentElement;
    const contentElement = cardElement.querySelector(".card-content");
    const imgHeight = imgElement.clientHeight;
    const contentHeight = contentElement.clientHeight;
    cardElement.style.height = `${imgHeight + contentHeight}px`;
    resolve();
  });
}

function setMasonryHeight() {
  masonry.style.height = Math.max(...colHeights) + "px";
}

// handle window resize
function resetMasonryHeight() {
  colHeights = [0, 0, 0, 0];
  document.querySelectorAll(".card").forEach((card, index) => {
    const cardHeight = card.clientHeight;
    const colIndex = (index + 1) % 3;
    colHeights[colIndex] += cardHeight;
  });
  setMasonryHeight();
}

window.addEventListener("resize", resetMasonryHeight);
//////////
loadCard();
