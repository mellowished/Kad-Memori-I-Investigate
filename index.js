const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let matches = 0; // Track the number of matched pairs
let totalPairs; // Total pairs in the game

// Array of fun facts
const funFacts = [
  "Tahukah anda? Jurutera sering bekerja dalam pasukan interdisipliner, membolehkan mereka belajar dan mempengaruhi bidang seperti sains alam sekitar dan kelestarian.",
  "Tahukah anda? Sesetengah ahli arkeologi menggunakan radar menembusi tanah untuk mengesan struktur yang terkubur tanpa menggali, menjadikan proses itu lebih cekap dan kurang invasif.",
  "Tahukah anda? Saintis forensik boleh menggunakan aktiviti serangga untuk menentukan masa kematian dalam kes pembunuhan, satu bidang yang dikenali sebagai entomologi forensik.",
  "Tahukah anda? Ramai saintis mempunyai 'projek kegemaran' yang mereka kerjakan dalam masa lapang, yang membawa kepada penemuan tidak dijangka yang boleh mengubah fokus penyelidikan utama mereka.",
  "Tahukah anda? Sesetengah doktor mengamalkan 'perubatan gaya hidup,' yang memberi tumpuan kepada pencegahan penyakit melalui diet, senaman, dan perubahan gaya hidup lain daripada hanya merawat gejala.",
  "Tahukah anda? Teknik 'debugging itik getah' melibatkan penerangan kod dengan kuat kepada objek tidak bernyawa, membantu pengaturcara mengesan isu yang mungkin mereka terlepas pandang.",
  "Tahukah anda? Detektif kadang-kadang menggunakan analisis tingkah laku untuk mencipta profil suspek, menggunakan psikologi untuk memahami tingkah laku jenayah.",
  "Tahukah anda? Ramai psikologi menggunakan teknik kreatif, seperti terapi seni atau muzik, untuk membantu klien mengekspresikan emosi dan memproses pengalaman.",
  "Tahukah anda? Peguam sering mempunyai kemahiran rangkaian yang unik, menggunakan hubungan yang dibina sepanjang kerjaya mereka untuk membantu klien menavigasi sistem undang-undang yang kompleks.",
];

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    totalPairs = cards.length / 2; // Initialize totalPairs
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matches++; // Increment the match counter
  // Check for game over
  if (matches === totalPairs) {
    gameOver();
  } else {
    resetBoard();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function gameOver() {
  setTimeout(() => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    alert(`Tahniah! Anda berjaya menyelesaikan permainan ini! Markah: ${score}\nFakta: ${randomFact}`);
    restart(); // Optional: Restart the game after showing the message
  }, 500); // Delay to allow the last match to be visible
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
