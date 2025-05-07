
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const perPage = 6;
let currentPage = 0;
let correctSound = new Audio("correct.mp3");
const sounds = {};

letters.forEach(letter => {
    sounds[letter] = new Audio(letter + ".m4a");
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderPage() {
    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = "";

    const start = currentPage * perPage;
    const end = Math.min(start + perPage, letters.length);
    const currentLetters = letters.slice(start, end);

    const uppercaseDiv = document.createElement("div");
    uppercaseDiv.className = "uppercase";
    currentLetters.forEach(letter => {
        const btn = document.createElement("div");
        btn.className = "letter";
        btn.textContent = letter;
        btn.onclick = () => sounds[letter].play();
        btn.dataset.letter = letter;
        uppercaseDiv.appendChild(btn);
    });

    const lowercaseDiv = document.createElement("div");
    lowercaseDiv.className = "lowercase";
    const shuffled = [...currentLetters.map(l => l.toLowerCase())];
    shuffle(shuffled);
    shuffled.forEach(lower => {
        const btn = document.createElement("div");
        btn.className = "letter";
        btn.textContent = lower;
        btn.draggable = true;
        btn.ondragstart = (e) => e.dataTransfer.setData("text", lower);
        lowercaseDiv.appendChild(btn);
    });

    gameDiv.appendChild(uppercaseDiv);
    gameDiv.appendChild(lowercaseDiv);

    document.querySelectorAll(".uppercase .letter").forEach(target => {
        target.ondragover = (e) => e.preventDefault();
        target.ondrop = (e) => {
            e.preventDefault();
            const dragged = e.dataTransfer.getData("text");
            const expected = target.dataset.letter.toLowerCase();
            if (dragged === expected) {
                correctSound.play();
                target.style.backgroundColor = "#90ee90";
            } else {
                target.style.backgroundColor = "#f08080";
            }
        };
    });
}

function nextPage() {
    if ((currentPage + 1) * perPage < letters.length) {
        currentPage++;
        renderPage();
    }
}
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    }
}

window.onload = renderPage;
