function toggleForms() {
    document.getElementById("sign-in-form").style.display = 
        document.getElementById("sign-in-form").style.display === "none" ? "block" : "none";
    document.getElementById("login-form").style.display = 
        document.getElementById("login-form").style.display === "none" ? "block" : "none";
}

function signIn() {
    let username = document.getElementById("signInUsername").value;
    let password = document.getElementById("signInPassword").value;

    if (localStorage.getItem(username)) {
        alert("Username sudah terdaftar!");
    } else {
        localStorage.setItem(username, password);
        alert("Akun berhasil dibuat!");
        toggleForms();
    }
}

function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    if (localStorage.getItem(username) === password) {
        alert("Login berhasil!");
        window.location.href = "home.html"; // Ganti dengan halaman game nanti
    } else {
        alert("Username atau password salah!");
    }
}
