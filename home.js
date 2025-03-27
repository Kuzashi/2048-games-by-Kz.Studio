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

document.addEventListener("touchmove", function(event) {
    event.preventDefault(); // Mencegah scroll atau navigasi lain
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
        addRandomTile();
    }
}

// Fungsi buat animasi swipe
function animateSwipe(deltaX, deltaY) {
    let cells = document.querySelectorAll(".cell");
    let dx = deltaX > 0 ? "20px" : deltaX < 0 ? "-20px" : "0px";
    let dy = deltaY > 0 ? "20px" : deltaY < 0 ? "-20px" : "0px";

    cells.forEach(cell => {
        cell.style.setProperty("--dx", dx);
        cell.style.setProperty("--dy", dy);
        cell.classList.add("moving");
        setTimeout(() => cell.classList.remove("moving"), 200);
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

    if (emptyCells.length > 0) {
        let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% angka 2, 10% angka 4
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

window.onload = () => {
    bgMusic.play().catch(() => {
        console.log("Autoplay dicegah, klik tombol musik untuk memulai.");
    });
};

// Loop musik saat selesai
bgMusic.addEventListener("ended", () => {
    bgMusic.currentTime = 0; // Kembali ke awal
    bgMusic.play(); // Mainkan lagi
});

musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.innerText = "🔊";
    } else {
        bgMusic.pause();
        musicBtn.innerText = "🔇";
    }
});

               
