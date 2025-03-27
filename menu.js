function openHome() {
      // Tampilkan loading
    let loadingContainer = document.getElementById("loading");
    let progressBar = document.getElementById("progressBar");
    loadingContainer.style.display = "block";
let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            loadingContainer.style.display = "none";
window.location.href = "home.html";
} else {
            width += 10; // Kecepatan naik
            progressBar.style.width = width + "%";
        }
    }, 300); 
}
function exit() {
  window.location.href = "https://google.com"
  
}

 function openWa() {
    // Tampilkan loading
    let loadingContainer = document.getElementById("loading");
    let progressBar = document.getElementById("progressBar");
    loadingContainer.style.display = "block";

    // Animasi bar progres naik secara bertahap
    let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            loadingContainer.style.display = "none";
            // Selesai loading, buka WhatsApp
            window.location.href = "https://wa.me/6282162107307";
        } else {
            width += 10; // Kecepatan naik
            progressBar.style.width = width + "%";
        }
    }, 300); // 0.3 detik per kenaikan 10%
}
