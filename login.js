function toggleForms() {
document.getElementById("sign-in-form").style.display =
document.getElementById("sign-in-form").style.display === "none" ? "block" : "none";
document.getElementById("login-form").style.display =
document.getElementById("login-form").style.display === "none" ? "block" : "none";
}

const audio = new Audio ("efekTekan.mp3");
    
    function efekTekan() {
      let sound = audio;
      sound.currentTime = 0;
      sound.volume = 1;
      sound.play();
    }

function signIn() {
  efekTekan();
    let username = document.getElementById("signInUsername").value;
    let password = document.getElementById("signInPassword").value;

    // Simulasikan proses pendaftaran (tidak perlu kirim ke server karena kita akan simpan ke localStorage)
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Periksa apakah username sudah ada
    let existingUser = users.find(user => user.username === username);

    if (existingUser) {
        alert("Gagal membuat akun. Username mungkin sudah dipakai.");
    } else {
        // Simpan akun baru ke localStorage
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Akun berhasil dibuat!");
        toggleForms();
    }
}

function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek jika username dan password cocok
    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
      efekTekan();
                window.location.href = "menu.html"; 
    } else {
        alert("Username atau password salah!");
    }
}
