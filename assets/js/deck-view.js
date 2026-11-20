import { decks } from "./decks.js";
import { hexToString } from "./colors.js";

const flashcardTemplate = document.querySelector("#flashcard-template");
const deckView = document.querySelector("#deck-view");
const homeDecksList = document.querySelector("#home .gallery__list");
const flashcardsList = deckView.querySelector(".gallery__list");
const deckTitle = deckView.querySelector(".gallery__title");
const practiceBtn = deckView.querySelector(".gallery__practice-btn");

function saveDecks() {
  localStorage.setItem("flashcards-decks", JSON.stringify(decks));
}

function createFlashcardEl(flashcard, deck) {
  const template = flashcardTemplate.content.cloneNode(true);
  const flashcardEl = template.querySelector(".card");
  const titleEl = template.querySelector(".card__title");
  const flipBtn = template.querySelector(".card__flip-btn");
  const deleteBtn = template.querySelector(".card__delete-btn");
  let showingQuestion = true;

  flashcardEl.classList.add(`card_color_${hexToString(deck.color) || "green"}`);
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
      const deckEl = homeDecksList.querySelector(`.card[data-id="${deck.id}"]`);
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
    flashcardsList.insertBefore(
      createFlashcardEl(flashcard, deck),
      newCardItem,
    );
  });

  const newCardBtn = newCardItem.querySelector(".gallery__new-card-btn");

  newCardBtn.onclick = () => {
    const question = window.prompt("Enter the flashcard question:")?.trim();
    if (!question) return;

    const answer = window.prompt("Enter the flashcard answer:")?.trim();
    if (!answer) return;

    const flashcard = { id: crypto.randomUUID(), question, answer };
    deck.cards.push(flashcard);
    saveDecks();

    flashcardsList.insertBefore(
      createFlashcardEl(flashcard, deck),
      newCardItem,
    );

    const deckEl = homeDecksList.querySelector(`.card[data-id="${deck.id}"]`);
    if (deckEl) {
      deckEl.querySelector(".card__count").textContent =
        `${deck.cards.length} Cards`;
    }
  };

  practiceBtn.onclick = () => {
    window.location.hash = `#carousel/${deck.id}`;
  };
}

export { renderDeckView };
