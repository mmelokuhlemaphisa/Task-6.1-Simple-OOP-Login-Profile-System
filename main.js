let users = (this.currentUser =JSON.parse(localStorage.getItem("currentUser")) || null);;
if (users) {
  if (users.loggedIn && !window.location.href.includes("profile.html")) {
    window.location.href = "profile.html";
  }
}

class UserAuth {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  }
  signup(username, email, password) {
    const exists = this.users.find(
      (u) => u.username === username || u.email === email
    );
    if (exists) {
      alert("User already exists!");
      return false;
    }
    const newUser = {
      username,
      email,
      password,
      createdAt: new Date().toLocaleString(),
      loggedIn: false,
    };
    this.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(this.users));
    alert("Signup successful! Please login.");
    window.location.href = "index.html";
    return true;
  }
  login(username, password) {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      alert("Invalid username or password!");
      return false;
    }
    user.loggedIn = true;
    this.currentUser = user;
    localStorage.setItem("users", JSON.stringify(this.users));
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "profile.html";
    return true;
  }
  logout() {
    if (this.currentUser) {
      const user = this.users.find(
        (u) => u.username === this.currentUser.username
      );
      if (user) user.loggedIn = false;
      this.currentUser = null;
      localStorage.setItem("users", JSON.stringify(this.users));
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    }
  }
  getProfile() {
    return this.currentUser;
  }
}
// DOM Handling
const auth = new UserAuth();
// Signup page
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    auth.signup(username, email, password);
  });
}
// Login page
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    auth.login(username, password);
  });
}
// Profile page
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  const profile = auth.getProfile();
  if (!profile) {
    window.location.href = "index.html";
  } else {
    document.getElementById("profileUsername").innerText = profile.username;
    document.getElementById("profileEmail").innerText = profile.email;
    document.getElementById("profileCreated").innerText = profile.createdAt;
    document.getElementById("profileStatus").innerText = profile.loggedIn
      ? `✔️`
      : `❌`;
    logoutBtn.addEventListener("click", () => auth.logout());
  }
}
