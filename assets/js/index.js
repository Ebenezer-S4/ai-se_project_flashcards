import { decks, getDeckbyID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import {  hexToString  } from "./colors.js";

const deckTemplate = document.querySelector("#deck-template");
const decksList = document.querySelector(".decks__list");
const newDeckBtn = document.querySelector(".decks__new-deck-btn");

const homeSelection = document.querySelector("#home");
const notFoundSelection = document.querySelector("#not-found");

function createDeckEl(item) {
   
    const template = deckTemplate.content.cloneNode(true);
    const deckEl = template.querySelector(".deck");
    const titleEl = template.querySelector(".deck__title");
    const countEl = template.querySelector(".deck__count");
    const deleteBtn = template.querySelector(".deck__delete-btn");
    const deckLink = template.querySelector(".deck__link");

    deckEl.dataset.id = item.id;
    const colorName = hexToString(item.color);
    deckEl.classList.add(`deck_color_${colorName}`);
    deckLink.href = `#carousel/${item.id}`;

    titleEl.textContent = item.name;
    countEl.textContent = `${item.cards.length} Cards`;
    
    deleteBtn.addEventListener("click", () => {
    const deckIndex = 
    decks.findIndex((deck) => deck.id === item.id);
    
    if (deckIndex !== -1) {
        decks.splice(deckIndex, 1);
        localStorage.setItem("flashcards-decks", JSON.stringify(decks));
        decksList.removeChild(deckEl);
    }
    });

     
    return deckEl;
}
    function renderDeckEl(item) {
        const deckEl = createDeckEl(item);
        decksList.prepend(deckEl);

}
const GitBasics = decks.find(deck => deck.id === "git-basics");

if (GitBasics) {
    const savedDecks = JSON.parse(localStorage.getItem("flashcards-decks") || "[]");
    if (!savedDecks.some(deck => deck.id === GitBasics.id)) {
        savedDecks.push(GitBasics);
        localStorage.setItem("flashcards-decks", JSON.stringify(savedDecks));
    }
}
decks.forEach(renderDeckEl);
newDeckBtn.addEventListener("click", () => {
    const newDeck = {
        id: Date.now(),
        name: "New Deck",
        cards: []
    };
    decks.push(newDeck);
    renderDeckEl(newDeck);
    localStorage.setItem("flashcards-decks", JSON.stringify(decks));
});

function handleRoute() {
    const hash = window.location.hash;
    if (hash === "#home" || hash === "" || hash === "#") {
        document.querySelector(".carousel").style.display = "none";
        homeSelection.style.display = "";
        notFoundSelection.style.display = "none";
    } else if (hash.startsWith("#carousel/")) {
        const deck = hash.split("/")[1];
        const deckData = getDeckbyID(deck);
        console.log(deckData);
        if (deckData) {
        homeSelection.style.display = "none";
        notFoundSelection.style.display =  "none";
        renderCarouselView(deckData);
        } else {
            document.querySelector(".carousel").style.display = "none";
            homeSelection.style.display = "none";
            notFoundSelection.style.display = "";
        }
    }
}

handleRoute();
window.addEventListener("hashchange", handleRoute);