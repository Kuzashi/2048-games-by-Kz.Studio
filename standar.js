let board = Array.from({ length: 4 }, () => Array(4).fill(0));
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
      }, 5);
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

  if (highestTile < 16) {
    tileValues = [2, 4];
    probabilities = [0.8, 0.2];
} else if (highestTile < 128) {
    tileValues = [2, 4, 8, 16, 32];
    probabilities = [0.35, 0.3, 0.2, 0.1, 0.05];
} else if (highestTile < 512) {
    tileValues = [4, 8, 16, 32, 64, 128];
    probabilities = [0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
} else if (highestTile < 1024) {
    tileValues = [4, 8, 16, 32, 64, 128, 256];
    probabilities = [0.2, 0.2, 0.2, 0.15, 0.1, 0.1, 0.05];
} else if (highestTile < 2048) {
    tileValues = [8, 16, 32, 64, 128, 256, 512];
    probabilities = [0.15, 0.2, 0.2, 0.15, 0.15, 0.1, 0.05];
} else {
    tileValues = [16, 32, 64, 128, 256, 512, 1024];
    probabilities = [0.15, 0.2, 0.2, 0.15, 0.15, 0.1, 0.05];  
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
if (randomValue < 1) { 
  // Tambah 1 tile
  let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[r][c] = getRandomTile();
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

const naudio = new Audio ("efekGeser.mp3");

function efekGeser() {
  let sound = naudio;
  sound.currentTime = 0;
  sound.volume = 0.7;
  sound.play();
}

function moveLeft() {
  efekGeser();
    let moved = false;
    let animations = [];

    for (let r = 0; r < 4; r++) {
        let newRow = board[r].filter(val => val !== 0);
        let positions = newRow.map((_, i) => i);

        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow.splice(i + 1, 1);
                newRow.push(0);
                animations.push({ row: r, from: positions[i + 1], to: i, merge: true });
            }
        }

        while (newRow.length < 4) newRow.push(0);

        for (let c = 0; c < 4; c++) {
            if (board[r][c] !== newRow[c]) {
                moved = true;
                animations.push({ row: r, from: c, to: newRow.indexOf(board[r][c]), merge: false });
            }
            board[r][c] = newRow[c];
        }
    }

    if (moved) playAnimation(animations, updateBoard);
    return moved;
}

function moveRight() {
  efekGeser();
    let moved = false;
    let animations = [];

    for (let r = 0; r < 4; r++) {
        let newRow = board[r].filter(val => val !== 0).reverse();
        let positions = newRow.map((_, i) => 3 - i);

        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow.splice(i + 1, 1);
                newRow.push(0);
                animations.push({ row: r, from: positions[i + 1], to: 3 - i, merge: true });
            }
        }

        while (newRow.length < 4) newRow.push(0);
        newRow.reverse();

        for (let c = 0; c < 4; c++) {
            if (board[r][c] !== newRow[c]) {
                moved = true;
                animations.push({ row: r, from: c, to: 3 - newRow.indexOf(board[r][c]), merge: false });
            }
            board[r][c] = newRow[c];
        }
    }

    if (moved) playAnimation(animations, updateBoard);
    return moved;
}

function moveUp() {
  efekGeser();
    let moved = false;
    let animations = [];

    for (let c = 0; c < 4; c++) {
        let newCol = [];
        let positions = [];

        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== 0) {
                newCol.push(board[r][c]);
                positions.push(r);
            }
        }

        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol.splice(i + 1, 1);
                newCol.push(0);
                animations.push({ col: c, from: positions[i + 1], to: i, merge: true });
            }
        }

        while (newCol.length < 4) newCol.push(0);

        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== newCol[r]) {
                moved = true;
                animations.push({ col: c, from: r, to: newCol.indexOf(board[r][c]), merge: false });
            }
            board[r][c] = newCol[r];
        }
    }

    if (moved) playAnimation(animations, updateBoard);
    return moved;
}

function moveDown() {
  efekGeser();
    let moved = false;
    let animations = [];

    for (let c = 0; c < 4; c++) {
        let newCol = [];
        let positions = [];

        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== 0) {
                newCol.push(board[r][c]);
                positions.push(r);
            }
        }

        newCol.reverse();
        positions.reverse();

        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol.splice(i + 1, 1);
                newCol.push(0);
                animations.push({ col: c, from: positions[i + 1], to: 3 - i, merge: true });
            }
        }

        while (newCol.length < 4) newCol.push(0);
        newCol.reverse();

        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== newCol[r]) {
                moved = true;
                animations.push({ col: c, from: r, to: 3 - newCol.indexOf(board[r][c]), merge: false });
            }
            board[r][c] = newCol[r];
        }
    }

    if (moved) playAnimation(animations, updateBoard);
    return moved;
}

function playAnimation(animations, callback) {
    let tiles = document.querySelectorAll(".tile");

    animations.forEach(({ row, from, to }) => {
        let tile = tiles[row * 4 + from]; // Cari tile yang mau dipindahkan
        if (tile) {
            let distance = (to - from) * 100; // 100px per grid
            tile.style.transform = `translateX(${distance}px)`;
            setTimeout(() => {
                tile.style.transform = "translateX(0)"; // Balikin setelah animasi
            }, 200);
        }
    });

    setTimeout(callback, 5); // Pastikan updateBoard() dipanggil setelah animasi selesai
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
  bgMusic.volume = 0.8;
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
const numStars = 50;
let flashOpacity = 0;
let flashing = false;

// Inisialisasi bintang
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5
    });
}

// Load suara petir
const thunderSounds = [
    new Audio("thunder1.mp3"),
    new Audio("thunder2.mp3"),
];

// Fungsi untuk memainkan suara petir secara acak
function playThunderSoundShort() {
    let sound = thunderSounds[0];
    sound.currentTime = 0; // Restart suara dari awal
    sound.volume = 0.8;
    sound.play();
}

function playThunderSoundLong() {
    let sound = thunderSounds[1];
    sound.currentTime = 0; // Restart suara dari awal
    sound.volume = 0.8;
    sound.play();
}

// Fungsi petir cepat
function triggerLightning() {
    if (!flashing) {
      playThunderSoundShort(); // Mainkan suara petir
        flashing = true;
        flashOpacity = 0.8;

        let fadeOut = setInterval(() => {
            flashOpacity -= 0.1;
            if (flashOpacity <= 0) {
                flashOpacity = 0;
                flashing = false;
                clearInterval(fadeOut);
            }
        }, 50);
    }
}

// Fungsi petir berulang
function triggerLightningRepeat() {
    if (!flashing) {
        flashing = true;
        let sequence = [0.8, 0.3, 1, 0.6, 0];
        let index = 0;

        playThunderSoundLong(); // Mainkan suara petir

        let interval = setInterval(() => {
            flashOpacity = sequence[index++];
            if (index >= sequence.length) {
                flashing = false;
                clearInterval(interval);
            }
        }, 150);
    }
}

// Animasi bintang dan efek petir
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }

    // Efek petir
    if (flashing) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(animateStars);
}

// Jalankan animasi
animateStars();

// Jadwal acak petir
setInterval(() => {
    let rand = Math.random();
    if (rand > 0.8) triggerLightningRepeat();
    else if (rand > 0.6) triggerLightning();
}, 6000);
