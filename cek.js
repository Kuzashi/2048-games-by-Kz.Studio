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
    probabilities = [0.85, 0.15];
} else if (highestTile < 128) {
    tileValues = [2, 4, 8, 16];
    probabilities = [0.4, 0.3, 0.2, 0.1];  
} else if (highestTile < 512) {
    tileValues = [2, 4, 8, 16, 32, 64];
    probabilities = [0.3, 0.25, 0.2, 0.15, 0.07, 0.03];
} else {
    tileValues = [2, 4, 8, 16, 32, 64, 128];
    probabilities = [0.2, 0.2, 0.2, 0.15, 0.15, 0.08, 0.02];
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