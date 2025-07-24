import {
  db,
  getDoc,
  doc,
} from "../firebase/firebase.js";

const routeCheck = () => {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    window.location.replace("../index.html");
  }
};

document.getElementById("menuToggle").addEventListener("click", function () {
  const menu = document.getElementById("menu");
  const menuToggle = document.getElementById("menuToggle");

  if (menu.classList.contains("open")) {
    menu.classList.remove("open");
    menuToggle.textContent = "☰"; // Hamburger icon
  } else {
    menu.classList.add("open");
    menuToggle.textContent = "✖"; // Close icon
  }
});

const fetchData = async () => {
  try {
    const uid = localStorage.getItem("uid");
    const res = await getDoc(doc(db, "namazHistory", uid));
    if (!res.exists()) {
      console.error("No document found for the given UID");
      return;
    }

    const history = res.data();

    for (let key in history) {
      renderUi(key, history[key]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


const renderUi = (date, obj) => {
  const main = document.querySelector("main");

  const form = document.createElement("form");
  form.id = "prayerForm";
  form.innerHTML = `
    <label for="" style="font-weight:600;">Date:</label>
    <input type="date" id="prayerDate" name="prayerDate" required style="margin-bottom: 1.5rem; display:block; width:100%; max-width:250px;">
    <div class="prayer-list" id="parent">
        <div class="prayer-item" id="fajar">
            <span class="prayer-name">Fajr</span>
            <button type="button" class="prayer-done">Done</button>
            <button type="button" class="prayer-miss">Miss</button>
        </div>
        <div class="prayer-item" id="zohar">
            <span class="prayer-name">Dhuhr</span>
            <button type="button" class="prayer-done">Done</button>
            <button type="button" class="prayer-miss">Miss</button>
        </div>
        <div class="prayer-item" id="asar">
            <span class="prayer-name">Asr</span>
            <button type="button" class="prayer-done">Done</button>
            <button type="button" class="prayer-miss">Miss</button>
        </div>
        <div class="prayer-item" id="maghrib">
            <span class="prayer-name">Maghrib</span>
            <button type="button" class="prayer-done">Done</button>
            <button type="button" class="prayer-miss">Miss</button>
        </div>
        <div class="prayer-item" id="isha">
            <span class="prayer-name">Isha</span>
            <button type="button" class="prayer-done">Done</button>
            <button type="button" class="prayer-miss">Miss</button>
        </div>
    </div>
  `;

  main.appendChild(form);

  setValues(date, obj, form);
};

const setValues = (date, todaysNamaz, form) => {
  const prayerDate = form.querySelector("#prayerDate");
  const newDate = new Date(transformDateToDMY(date));
  prayerDate.value = formatDate(newDate);
  prayerDate.disabled = true;

  const prayerItems = form.querySelectorAll(".prayer-item");

  prayerItems.forEach((item) => {
    const prayerName = item.id;
    const doneButton = item.querySelector(".prayer-done");
    const missButton = item.querySelector(".prayer-miss");

    if (!doneButton || !missButton) {
      console.error("Buttons not found for prayer item:", prayerName);
      return;
    }

    if (todaysNamaz.hasOwnProperty(prayerName)) {
      if (todaysNamaz[prayerName] === true) {
        doneButton.classList.add("done");
        doneButton.disabled = true;
        missButton.disabled = true;
      } else if (todaysNamaz[prayerName] === false) {
        missButton.classList.add("miss");
        doneButton.disabled = true;
        missButton.disabled = true;
      }
    } else {
      doneButton.classList.remove("done");
      missButton.classList.remove("miss");
      doneButton.disabled = false;
      missButton.disabled = false;
    }
  });
};



const clearUi = () => {
  const prayerItems = document.querySelectorAll(".prayer-item");

  prayerItems.forEach((item) => {
    const doneButton = item.querySelector(".prayer-done");
    const missButton = item.querySelector(".prayer-miss");

    // Reset buttons and remove classes
    doneButton.classList.remove("done");
    missButton.classList.remove("miss");
    doneButton.disabled = false;
    missButton.disabled = false;
  });

};

const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const transformDateToDMY = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${parseInt(day)}-${parseInt(month)}-${year}`;
};

window.addEventListener("load", () => {
  routeCheck();
  fetchData();
});
