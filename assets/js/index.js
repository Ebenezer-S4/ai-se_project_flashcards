import { decks, getDeckbyID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colors.js";

const deckTemplate = document.querySelector("#deck-template");
const flashcardTemplate = document.querySelector("#flashcard-template");
const homeSelection = document.querySelector("#home");
const deckView = document.querySelector("#deck-view");
const carousel = document.querySelector("#carousel");
const notFoundSelection = document.querySelector("#not-found");
const homeDecksList = homeSelection.querySelector(".gallery__list");
const flashcardsList = deckView.querySelector(".gallery__list");
const deckTitle = deckView.querySelector(".gallery__title");
const newDeckBtn = homeSelection.querySelector(".gallery__new-card-btn");
const practiceBtn = deckView.querySelector(".gallery__practice-btn");

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

function createFlashcardEl(flashcard, deck) {
  const template = flashcardTemplate.content.cloneNode(true);
  const flashcardEl = template.querySelector(".card");
  const titleEl = template.querySelector(".card__title");
  const flipBtn = template.querySelector(".card__flip-btn");
  const deleteBtn = template.querySelector(".card__delete-btn");
  let showingQuestion = true;

  flashcardEl.classList.add(
    `card_color_${hexToString(deck.color) || "green"}`,
  );
  titleEl.textContent = flashcard.question;

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    titleEl.textContent = showingQuestion
      ? flashcard.question
      : flashcard.answer;
  });

  deleteBtn.addEventListener("click", () => {
    const flashcardIndex = deck.cards.findIndex(
      (item) => item.id === flashcard.id,
    );

    if (flashcardIndex !== -1) {
      deck.cards.splice(flashcardIndex, 1);
      saveDecks();
      flashcardEl.remove();
      const deckEl = homeDecksList.querySelector(
        `.card[data-id="${deck.id}"]`,
      );
      if (deckEl) {
        deckEl.querySelector(".card__count").textContent =
          `${deck.cards.length} Cards`;
      }
    }
  });

  return flashcardEl;
}

function renderDeckView(deck) {
  deckTitle.textContent = deck.name;
  flashcardsList.querySelectorAll(".card").forEach((card) => card.remove());
  const newCardItem = flashcardsList.querySelector(".gallery__new-deck-item");

  deck.cards.forEach((flashcard) => {
    flashcardsList.insertBefore(createFlashcardEl(flashcard, deck), newCardItem);
  });

  practiceBtn.onclick = () => {
    window.location.hash = `#carousel/${deck.id}`;
  };
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

const GitBasics = decks.find((deck) => deck.id === "git-basics");

if (GitBasics) {
  const savedDecks = JSON.parse(
    localStorage.getItem("flashcards-decks") || "[]",
  );
  if (!savedDecks.some((deck) => deck.id === GitBasics.id)) {
    savedDecks.push(GitBasics);
    localStorage.setItem("flashcards-decks", JSON.stringify(savedDecks));
  }
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
