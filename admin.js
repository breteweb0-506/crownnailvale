const ADMIN_EMAIL = "breteweb0@gmail.com";

firebase.auth().onAuthStateChanged((user) => {
  const loginBox = document.getElementById("loginBox");
  const panel = document.getElementById("adminPanel");
  if (user && user.email === ADMIN_EMAIL) {
    if (loginBox) loginBox.style.display = "none";
    if (panel) panel.style.display = "block";
    if (typeof loadAdmin === "function") loadAdmin();
  } else {
    if (loginBox) loginBox.style.display = "block";
    if (panel) panel.style.display = "none";
  }
});

function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch((e) => alert(e.message));
}

function logout() {
  firebase.auth().signOut();
}
