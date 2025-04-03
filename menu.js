const audio = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");
const settingsContainer = document.getElementById("settingsContainer");
const settingsBtn = document.getElementById("settingsBtn");
const bgMusicCheckbox = document.getElementById("bgMusic");

function playMusic() {
    if (audio.paused) {
        audio.play().catch((error) => {
            console.log("Autoplay dicegah, klik tombol musik untuk memulai.", error);
        });
        musicBtn.innerText = "🔊"; // Tampilkan suara
    } else {
        audio.pause();
        musicBtn.innerText = "🔇"; // Tampilkan diam
    }
}

function toggleSettings() {
    // Menampilkan atau menyembunyikan pengaturan
    settingsContainer.style.display = settingsContainer.style.display === "block" ? "none" : "block";
    document.getElementById("donation").innerHTML = "dukung kami dengan donasi.<br> Dana:<br> 0813-6170-5396";
}

function toggleMusic() {
    // Menyalakan atau mematikan musik berdasarkan checkbox
    if (bgMusicCheckbox.checked) {
        audio.play();
        musicBtn.innerText = "🔊";
    } else {
        audio.pause();
        musicBtn.innerText = "🔇";
    }
}

function openLogin() {
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
            width += 10;
            progressBar.style.width = width + "%";
        }
    }, 300);
}

function exit() {
    window.close();
}

function openWa() {
    let loadingContainer = document.getElementById("loading");
    let progressBar = document.getElementById("progressBar");
    loadingContainer.style.display = "block";

    let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            loadingContainer.style.display = "none";
            window.location.href = "https://wa.me/6282162107307";
        } else {
            width += 10;
            progressBar.style.width = width + "%";
        }
    }, 300);
}
