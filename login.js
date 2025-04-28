function toggleForms() {
  document.getElementById("sign-in-form").style.display = document.getElementById("sign-in-form").style.display === "none" ? "block" : "none";
  document.getElementById("login-form").style.display = document.getElementById("login-form").style.display === "none" ? "block" : "none";
}

const audio = new Audio("efekTekan.mp3");

function efekTekan() {
  let sound = audio;
  sound.currentTime = 0;
  sound.volume = 1;
  sound.play().catch(error => console.error("Error playing audio:", error));
}

function signIn() {
  efekTekan();
  let username = document.getElementById("signInUsername").value;
  let password = document.getElementById("signInPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let existingUser = users.find(user => user.username === username);
  if (existingUser) {
    alert("Gagal membuat akun. Username mungkin sudah dipakai.");
  } else {
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Akun berhasil dibuat!");
    toggleForms();
  }
}

function login() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  // Akun khusus: data hanya di sessionStorage
  if (username === "Kuz.dev" && password === "мила") {
    sessionStorage.setItem('rubel', 99999);
    sessionStorage.setItem('customUser', true);
    location.replace("menu.html");
    return;
  } else if (username === "beta.test" && password === "KZ") {
    sessionStorage.setItem('rubel', 99999);
    sessionStorage.setItem('customUser', true);
    location.replace("menu.html");
    return;
  }

  // Akun dari user biasa
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(user => user.username === username && user.password === password);
  if (user) {
    efekTekan();
    sessionStorage.removeItem('customUser'); // pastikan tidak ada data custom nyangkut
    window.location.href = "menu.html";
  } else {
    alert("Username atau password salah!");
  }
}

function exit() {
  location.replace("choose-login.html");
}