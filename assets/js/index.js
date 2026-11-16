import { decks, getDeckbyID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colors.js";
import { renderDeckView } from "./deck-view.js";

const deckTemplate = document.querySelector("#deck-template");
const homeSelection = document.querySelector("#home");
const deckView = document.querySelector("#deck-view");
const carousel = document.querySelector("#carousel");
const notFoundSelection = document.querySelector("#not-found");
const homeDecksList = homeSelection.querySelector(".gallery__list");
const newDeckBtn = homeSelection.querySelector(".gallery__new-card-btn");

function saveDecks() {
  localStorage.setItem("flashcards-decks", JSON.stringify(decks));
}

function createDeckEl(deck) {
  const template = deckTemplate.content.cloneNode(true);
  const deckEl = template.querySelector(".card");
  const titleEl = template.querySelector(".card__title");
  const countEl = template.querySelector(".card__count");
  const deleteBtn = template.querySelector(".card__delete-btn");
  const deckLink = template.querySelector(".card__link");

  deckEl.dataset.id = deck.id;
  const colorName = hexToString(deck.color);
  deckEl.classList.add(`card_color_${colorName || "green"}`);
  deckLink.href = `#deck/${deck.id}`;
  titleEl.textContent = deck.name;
  countEl.textContent = `${deck.cards.length} Cards`;

  deleteBtn.addEventListener("click", () => {
    const deckIndex = decks.findIndex((item) => item.id === deck.id);

    if (deckIndex !== -1) {
      decks.splice(deckIndex, 1);
      saveDecks();
      deckEl.remove();
    }
  });

  return deckEl;
}

function renderDeckEl(deck) {
  homeDecksList.prepend(createDeckEl(deck));
}

function renderHomeView() {
  homeDecksList.querySelectorAll(".card").forEach((card) => card.remove());
  decks.forEach(renderDeckEl);
}

function hideViews() {
  [homeSelection, deckView, carousel, notFoundSelection].forEach((view) => {
    view.style.display = "none";
  });
}

function router() {
  const hash = window.location.hash;

  hideViews();

  if (hash === "#home" || hash === "" || hash === "#") {
    renderHomeView();
    homeSelection.style.display = "flex";
    return;
  }

  if (hash.startsWith("#deck/")) {
    const deck = getDeckbyID(hash.slice("#deck/".length));

    if (deck) {
      renderDeckView(deck);
      deckView.style.display = "block";
      return;
    }
  } else if (hash.startsWith("#carousel/")) {
    const deck = getDeckbyID(hash.slice("#carousel/".length));

    if (deck) {
      renderCarouselView(deck);
      carousel.style.display = "flex";
      return;
    }
  }

  notFoundSelection.style.display = "block";
}

newDeckBtn.addEventListener("click", () => {
  const newDeck = {
    id: Date.now(),
    name: "New Deck",
    cards: [],
  };
  decks.push(newDeck);
  renderDeckEl(newDeck);
  saveDecks();
});

router();
window.addEventListener("hashchange", router);
