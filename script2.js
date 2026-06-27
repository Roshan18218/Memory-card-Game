document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('card-grid');
    const movesDisplay = document.getElementById('Moves');
    const maxMovesDisplay = document.getElementById('Max-Moves');
    const matchesDisplay = document.getElementById('matches');
    const restartBtn = document.getElementById('restart-btn');
    const playAgainBtn = document.getElementById('Play-again-btn');
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayMessage = document.getElementById('overlay-message');

    // Game Configuration
    const MAX_MOVES = 20;
    const totalPairs = 8;
    
    // State
    let moves = 0;
    let matches = 0;
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let isGameOver = false;

    
    // Add image paths here (front/back will show the same image for matching)
    const images = [
        'static/1.jpg',
        'static/2.jpg',
        'static/3.jpg',
        'static/4.jpg',
        'static/5.jpg',
        'static/6.jpg',
        'static/7.jpg',
        'static/8.jpg'
    ];

    function initGame() {
        moves = 0;
        matches = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        isGameOver = false;

        
        movesDisplay.innerText = moves;
        maxMovesDisplay.innerText = MAX_MOVES;
        matchesDisplay.innerText = matches;
        overlay.classList.remove('show', 'win', 'lose');
        grid.innerHTML = '';

        // Create and Shuffle Cards
        const gameCards = [...images, ...images];
        shuffle(gameCards);

        gameCards.forEach((imgSrc) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imgSrc;

            const front = document.createElement('div');
            front.classList.add('card-face', 'card-front');
            front.innerHTML = '&#128214;';

            const back = document.createElement('div');
            back.classList.add('card-face', 'card-back');

            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = 'card image';
            img.classList.add('card-img');

            back.appendChild(img);

            card.appendChild(front);
            card.appendChild(back);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function flipCard() {
        if (lockBoard || isGameOver) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        incrementMoves();
        checkForMatch();
    }

    function incrementMoves() {
        moves++;
        movesDisplay.innerText = moves;

        // Check for Loss condition immediately after move
        if (moves >= MAX_MOVES && matches < totalPairs) {
            endGame(false);
        }
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        matches++;
        matchesDisplay.innerText = matches;

        resetBoard();

        if (matches === totalPairs) {
            setTimeout(() => endGame(true), 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function endGame(won) {
        isGameOver = true;
        overlay.classList.add('show');
        
        if (won) {
            overlay.classList.add('win');
            overlayTitle.innerText = "You Won! 🎉";
            overlayMessage.innerText = `Great job! You finished in ${moves} moves.`;
            playAgainBtn.innerText = "Play Again";
        } else {
            overlay.classList.add('lose');
            overlayTitle.innerText = "Game Over 😢";
            overlayMessage.innerText = `You ran out of moves! Try again.`;
            playAgainBtn.innerText = "Try Again";
        }
    }

    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    // Start game on load
    initGame();
});