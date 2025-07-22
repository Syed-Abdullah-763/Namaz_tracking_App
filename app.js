import { auth, signInWithEmailAndPassword } from "../firebase/firebase.js";

const loginHandlerBtn = document.getElementById("loginHandlerBtn");

const routeCheck = () => {
  const uid = localStorage.getItem("uid");

  if (uid) {
    window.location.replace("./Home/home.html");
  }
};

const loginHandler = async () => {
  try {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    const response = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("uid", response.user.uid);

    email = "";
    password = "";

    window.location.replace("./Home/home.html");
  } catch (error) {
    console.log(error.message);
  }
};

window.addEventListener("load", routeCheck);
loginHandlerBtn.addEventListener("click", loginHandler);
