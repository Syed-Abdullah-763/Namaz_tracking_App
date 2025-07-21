import { auth, createUserWithEmailAndPassword, collection, doc, db, setDoc, addDoc} from "../firebase/firebase.js";

const signupHandlerBtn = document.getElementById("signupHandlerBtn");

const routeCheck = () => {
  const uid = localStorage.getItem("uid")

  if(uid) {
    window.location.replace("../Home/home.html")
  }
}

const signupHandler = async () => {
  try {
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const authResponse = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const today = new Date()
    const userObj = {
      firstName,
      lastName,
      email,
      password,
      uid: authResponse.user.uid,
      date: `${today.getDate()} - ${today.getMonth() + 1} - ${today.getFullYear()}`,
      time: `${today.getHours()}:${today.getMinutes()}`,
    };
    

    const todaysDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
    const namazHistory = {
      [todaysDate] : {
        fajar: false,
        zohar: false,
        asar: false,
        maghrib: false,
        isha: false,
      } 
    }

    const user = await setDoc(doc(db, "users", authResponse.user.uid), userObj);
    const namazRes = await setDoc(doc(db, "namazHistory", authResponse.user.uid), namazHistory)
    
    
    window.localStorage.setItem("uid" ,authResponse.user.uid)
    window.location.replace("../Home/home.html")
  } catch (error) {
    console.log(error);
  }
};


window.addEventListener("load", routeCheck)
signupHandlerBtn.addEventListener("click", signupHandler)