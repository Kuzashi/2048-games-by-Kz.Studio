let board = Array(4).fill().map(() => Array(4).fill(0));
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;

document.addEventListener("DOMContentLoaded", () => {
    restartGame();
    addTouchControls(); // Tambahin swipe buat Android
});

document.addEventListener("touchstart", function(event) {
    event.preventDefault(); // Mencegah geser kanan/kiri ke menu browser
}, { passive: false });

// Fungsi buat detect swipe
function addTouchControls() {
    document.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
    });
}

function handleSwipe() {
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    let moved = false;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        moved = deltaX > 50 ? moveRight() : deltaX < -50 ? moveLeft() : false;
    } else {
        moved = deltaY > 50 ? moveDown() : deltaY < -50 ? moveUp() : false;
    }
    
if (moved) {
  console.log("Tile baru ditambahkan!");
  animateSwipe(deltaX, deltaY);
  const startTime = performance.now();
  setTimeout(() => {
    const endTime = performance.now();
    console.log(`Waktu yang dibutuhkan: ${endTime - startTime} milidetik`);
    addRandomTile();
    updateBoard(); // Update tampilan papan setelah tile baru muncul
  }, 5); // Atur waktu munculnya tile baru (dalam milidetik)
}
}

// Fungsi buat animasi swipe
function animateSwipe(deltaX, deltaY) {
  let cells = document.querySelectorAll(".cell");
  let dx = deltaX > 0 ? "20px" : deltaX < 0 ? "-20px" : "0px";
  let dy = deltaY > 0 ? "20px" : deltaY < 0 ? "-20px" : "0px";

  cells.forEach((cell) => {
    if (cell.textContent !== "") {
      cell.style.transform = `translate(${dx}, ${dy})`;
      setTimeout(() => {
        cell.style.transform = "";
      }, 200);
    }
  });
}

function addRandomTile() {
  let emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return;

  let highestTile = Math.max(...board.flat());
  let tileValues, probabilities;

  if (highestTile < 8) {
    tileValues = [2, 4];
    probabilities = [0.9, 0.1];
} else if (highestTile < 64) {
    tileValues = [2, 4, 8, 16];
    probabilities = [0.3, 0.3, 0.25, 0.15];  // Masih cukup banyak angka kecil
} else if (highestTile < 512) {
    tileValues = [2, 4, 8, 16, 32, 64];
    probabilities = [0.2, 0.2, 0.2, 0.2, 0.15, 0.05]; // Lebih seimbang
} else if (highestTile < 1024) {
    tileValues = [2, 4, 8, 16, 32, 64, 128];
    probabilities = [0.15, 0.15, 0.15, 0.2, 0.2, 0.1, 0.05]; // Masih ada 2 & 4 tapi lebih kecil
} else {
    tileValues = [2, 4, 8, 16, 32, 64, 128, 256];
    probabilities = [0.1, 0.1, 0.15, 0.2, 0.2, 0.15, 0.07, 0.03]; // 2 & 4 tetap ada, tapi makin jarang
}

  function getRandomTile() {
    let rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < tileValues.length; i++) {
      cumulative += probabilities[i];
      if (rand < cumulative) return tileValues[i];
    }
    return tileValues[tileValues.length - 1]; // fallback jika ada kesalahan
  }

  let randomValue = Math.random();
  if (randomValue < 0.98 || emptyCells.length === 1) {  
    // Tambah 1 tile jika chance < 98% atau hanya ada 1 sel kosong
    let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = getRandomTile();
  } else {
    // Tambah 2 tile jika chance >= 98%
    let idx1 = Math.floor(Math.random() * emptyCells.length);
    let { r: r1, c: c1 } = emptyCells[idx1];

    // Ambil sel lain yang berbeda
    let idx2;
    do {
      idx2 = Math.floor(Math.random() * emptyCells.length);
    } while (idx2 === idx1);

    let { r: r2, c: c2 } = emptyCells[idx2];

    board[r1][c1] = getRandomTile();
    board[r2][c2] = getRandomTile();
  }
}

// Update tampilan papan dengan animasi tile baru
function updateBoard() {
    let grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            if (board[r][c] !== 0) {
                cell.textContent = board[r][c];
                cell.setAttribute("data-value", board[r][c]);
                cell.classList.add("new-tile");
            }
            grid.appendChild(cell);
        }
    }

    if (isGameOver()) document.getElementById("game-over").style.display = "block";
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let newRow = board[r].filter(val => val !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow.splice(i + 1, 1);
                newRow.push(0);
            }
        }
        while (newRow.length < 4) newRow.push(0);
        if (board[r].toString() !== newRow.toString()) moved = true;
        board[r] = newRow;
    }
    updateBoard();
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let newRow = board[r].filter(val => val !== 0).reverse();
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow.splice(i + 1, 1);
                newRow.push(0);
            }
        }
        while (newRow.length < 4) newRow.push(0);
        newRow.reverse();
        if (board[r].toString() !== newRow.toString()) moved = true;
        board[r] = newRow;
    }
    updateBoard();
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        let newCol = [];
        for (let r = 0; r < 4; r++) if (board[r][c] !== 0) newCol.push(board[r][c]);
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol.splice(i + 1, 1);
                newCol.push(0);
            }
        }
        while (newCol.length < 4) newCol.push(0);
        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== newCol[r]) moved = true;
            board[r][c] = newCol[r];
        }
    }
    updateBoard();
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        let newCol = [];
        for (let r = 0; r < 4; r++) if (board[r][c] !== 0) newCol.push(board[r][c]);
        newCol.reverse();
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol.splice(i + 1, 1);
                newCol.push(0);
            }
        }
        while (newCol.length < 4) newCol.push(0);
        newCol.reverse();
        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== newCol[r]) moved = true;
            board[r][c] = newCol[r];
        }
    }
    updateBoard();
    return moved;
}

// Fungsi mengecek apakah masih bisa bermain (Game Over)
function isGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return false; // Masih ada tempat kosong
            if (c < 3 && board[r][c] === board[r][c + 1]) return false; // Bisa geser kanan
            if (r < 3 && board[r][c] === board[r + 1][c]) return false; // Bisa geser bawah
        }
    }
    
    // Game over -> hentikan musik
    bgMusic.pause();
    musicBtn.innerText = "🔇";
    
    return true; // Tidak ada gerakan yang bisa dilakukan
}
let highestTile = 0; // Simpan skor tertinggi

function checkWin() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 2048) {
        document.getElementById("win-message").style.display = "block";
        bgMusic.pause();
        musicBtn.innerText = "🔇";
        return true;
      }
    }
  }
  return false;
}

function updateScore() {
  let maxTile = Math.max(...board.flat()); // Cari angka terbesar di board
  highestTile = Math.max(highestTile, maxTile); // Update kalau lebih besar
  
  document.getElementById("score").innerText = `Blok Tertinggi: ${highestTile}`;
}

function updateBoard() {
  let grid = document.getElementById("grid");
  grid.innerHTML = "";
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      if (board[r][c] !== 0) {
        cell.textContent = board[r][c];
        cell.setAttribute("data-value", board[r][c]);
        cell.classList.add("new-tile");
      }
      grid.appendChild(cell);
    }
  }
  
  updateScore(); // Update skor tiap kali papan diperbarui
  
  if (isGameOver()) {
    document.getElementById("game-over").style.display = "block";
  } else {
    checkWin();
  }
}

// Fungsi untuk restart game
function restartGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile();
    addRandomTile(); // Pastikan ada dua angka awal
    updateBoard();
    document.getElementById("game-over").style.display = "none";

    // Reset musik agar bisa dimainkan lagi
    bgMusic.currentTime = 0;
}

// Pastikan game mulai dengan angka awal
document.addEventListener("DOMContentLoaded", () => {
    restartGame();
    addTouchControls(); // Tambahin kontrol swipe buat Android
});

 const bgMusic = document.getElementById("bg-music");
 const musicBtn = document.getElementById("musicBtn");

// Fungsi untuk memutar musik setelah interaksi pertama
function playMusic() {
    bgMusic.play().then(() => {
        console.log("Musik diputar otomatis setelah interaksi.");
        document.removeEventListener("click", playMusic);
        document.removeEventListener("keydown", playMusic);
        document.removeEventListener("touchstart", playMusic);
    }).catch(err => {
        console.error("Gagal memutar musik:", err);
    });
}

// Tambahkan event listener untuk menangkap interaksi pertama
document.addEventListener("click", playMusic);
document.addEventListener("keydown", playMusic);
document.addEventListener("touchstart", playMusic);

// Loop musik saat selesai
bgMusic.addEventListener("ended", () => {
    bgMusic.currentTime = 0; // Kembali ke awal
    bgMusic.play(); // Mainkan lagi
});

// Fungsi tombol musik
musicBtn.addEventListener("touchend", () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.innerText = "🔊";
    } else {
        bgMusic.pause();
        musicBtn.innerText = "🔇";
    }
});

const restartBtn = document.getElementById("restartBtn"); // Ambil tombol restart
const gameBoard = document.getElementById("game-board"); // Ambil elemen permainan

restartBtn.addEventListener("touchend", () => {
    resetGame();
});

function resetGame() {
board = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile();
    addRandomTile(); // Pastikan ada dua angka awal
    updateBoard();
    document.getElementById("game-over").style.display = "none";


bgMusic.currentTime = 0;
    startGame();
}

function startGame() {
    console.log("Game dimulai ulang!");
addRandomTile();
addRandomTile();

bgMusic.currentTime = 0;
}

const canvas = document.getElementById("games");
const ctx = canvas.getContext("2d");

// Atur ukuran canvas sesuai layar
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 150; // Jumlah bintang

// Inisialisasi bintang
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,  // Posisi X acak
        y: Math.random() * canvas.height, // Posisi Y acak
        radius: Math.random() * 2,       // Ukuran acak (0.5 - 2 px)
        speed: Math.random() * 1   // Kecepatan jatuh (0.5 - 2.5 px)
    });
}

// Animasi bintang dan bentuk bintang
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Gerakkan bintang ke bawah
        star.y += star.speed;

        // Jika keluar layar, kembalikan ke atas
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }

    requestAnimationFrame(animateStars);
}

animateStars(); // Jalankan animasi
                    
