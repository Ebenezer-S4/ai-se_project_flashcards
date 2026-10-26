import { hexToString, removeColorClasses } from "./colors.js";
export function 
renderCarouselView(deck) {
    const carousel = 
    document.querySelector(".carousel");

    carousel.style.display = "";
    let currentCardIndex = 0;
    let showingQuestion = true;
    function showCard() {
    const card = deck.cards[currentCardIndex];

    const carouselTitle = carousel.querySelector(".carousel__title");
    carouselTitle.textContent = `${deck.name} ${currentCardIndex + 1} / ${deck.cards.length}`;

    const cardElement = carousel.querySelector(".carousel__card");
    const cardText = carousel.querySelector(".carousel__card-text");
    removeColorClasses(cardElement);
    
    cardElement.classList.add(`carousel__card_color_${hexToString(deck.color) || "green"}`);
    
    if (showingQuestion) {
        cardText.textContent = card.question;
        cardElement.classList.remove("carousel__card_color_white");
    
    } else {
        cardText.textContent = card.answer;
        cardElement.classList.add("carousel__card_color_white");
    }

}

    const previousBtn = 
    carousel.querySelector(".previous-btn");
    const nextBtn = 
    carousel.querySelector(".next-btn");

    previousBtn.onclick = () => {
        if (currentCardIndex > 0) {
        currentCardIndex--;
        showingQuestion = true;
        showCard();
    
      }
    };

    nextBtn.onclick = () => {
        if (currentCardIndex < deck.cards.length - 1) {
        currentCardIndex++;
        showingQuestion = true;
        showCard();
    
      }
    };

    const flipBtn = carousel.querySelector(".carousel__flip-btn");
    
    flipBtn.onclick = () => {
        showingQuestion = !showingQuestion;
        showCard();
    
    
    };


        showCard();
}
