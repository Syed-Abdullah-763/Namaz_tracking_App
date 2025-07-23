import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
} from "../firebase/firebase.js";

const routCheck = () => {
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

let todaysNamaz;
const fetcData = async () => {
  try {
    const uid = localStorage.getItem("uid");
    const date = new Date();
    const todaysDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    const namazData = await getDoc(doc(db, "namazHistory", uid));
    const namazHistory = namazData.data();

    if (!namazHistory[todaysDate]) {
      createNamazData();

      return;
    }

    todaysNamaz = namazHistory[todaysDate];

    const prayerDate = document.querySelector("#prayerDate");
    prayerDate.value = formatDate(date);
    renderUi(todaysNamaz);
  } catch (error) {
    console.log(error);
  }
};

const createNamazData = async () => {
  try {
    const uid = localStorage.getItem("uid");
    const today = new Date();
    const todaysDate = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;

    const namazData = await getDoc(doc(db, "namazHistory", uid));
    const namazHistory = namazData.data();

    const namazObj = {
      fajar: "pending",
      zohar: "pending",
      asar: "pending",
      maghrib: "pending",
      isha: "pending",
    };

    const response = await updateDoc(doc(db, "namazHistory", uid), {
      ...namazHistory,
      [todaysDate]: namazObj,
    });

    todaysNamaz = namazHistory[todaysDate];
    const prayerDate = document.querySelector("#prayerDate");
    prayerDate.value = formatDate(today);

    renderUi(todaysNamaz);
  } catch (error) {
    console.log(error.message);
  }
};

const prayerDate = document.querySelector("#prayerDate");
const calenderHandler = async () => {
  try {
    let dateSelected = transformDateToDMY(prayerDate.value);
    const uid = localStorage.getItem("uid");

    if (!dateSelected) {
      return;
    }

    const createDate = new Date(prayerDate.value);
    const date = formatDate(createDate);

    const namazData = await getDoc(doc(db, "namazHistory", uid));
    const namazHistory = namazData.data();

    clearUi(dateSelected);

    if (namazHistory[dateSelected]) {
      todaysNamaz = namazHistory[dateSelected];
      renderUi(todaysNamaz);

      return
    } 

    const namazObj = {
        fajar: "pending",
        zohar: "pending",
        asar: "pending",
        maghrib: "pending",
        isha: "pending",
      };

      await updateDoc(doc(db, "namazHistory", uid), {
        ...namazHistory,
        [dateSelected]: namazObj,
      });

      todaysNamaz = namazObj;
      renderUi(todaysNamaz);

  } catch (error) {
    console.log(error);
  }
};


const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

document.getElementById("parent").addEventListener("click", function (e) {
  if (e.target.classList.contains("prayer-done")) {
    updateUi(e);
  } else if (e.target.classList.contains("prayer-miss")) {
    updateUi(e);
  }
});

const updateUi = async (btn) => {
  const selectBtn = btn.target;
  const btnSelection = btn.target.textContent;
  const btnParent = btn.target.closest("div");
  const prayerName = btnParent.id;

  const status = btnSelection == "Done" ? true : false;

  todaysNamaz = {
    ...todaysNamaz,
    [prayerName]: status,
  };

  renderUi(todaysNamaz);

  try {
    const uid = localStorage.getItem("uid");
    let dateSelected = transformDateToDMY(prayerDate.value);

    await updateDoc(doc(db, "namazHistory", uid), {
      [dateSelected]: todaysNamaz,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const renderUi = (todaysNamaz) => {
  const prayerItems = document.querySelectorAll(".prayer-item");

  prayerItems.forEach((item) => {
    const prayerName = item.id;
    const doneButton = item.querySelector(".prayer-done");
    const missButton = item.querySelector(".prayer-miss");

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
      // Reset buttons if no data is available
      doneButton.classList.remove("done");
      missButton.classList.remove("miss");
      doneButton.disabled = false;
      missButton.disabled = false;
    }
  });
};

const clearUi = (dateSelected) => {
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

  // Update UI for the selected date
  updateForCustomDate(dateSelected);
};

const updateForCustomDate = async (dateSelected) => {
  try {
    const uid = localStorage.getItem("uid");
    const namazData = await getDoc(doc(db, "namazHistory", uid));
    const namazHistory = namazData.data();
    todaysNamaz = namazHistory[dateSelected];
    renderUi(todaysNamaz);
  } catch (error) {
    console.log(error);
  }
};

const setYearRestriction = async () => {
  try {
    const uid = localStorage.getItem("uid");
    const response = await getDoc(doc(db, "users", uid));
    const user = response.data();

    // Assuming user.date is in "year-month-day" format
    const formatDate = transformDateToDMY(user.date);
    const userDate = new Date(formatDate);

    // Use UTC to ensure consistency across time zones
    const today = new Date();
    const todayUTC = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );

    // Format the dates to "YYYY-MM-DD" for the input attributes
    const minDate = userDate.toISOString().split("T")[0];
    const maxDate = todayUTC.toISOString().split("T")[0]; // Ensure this is today's date in UTC

    prayerDate.setAttribute("min", minDate);
    prayerDate.setAttribute("max", maxDate); // Set max to today's date
  } catch (error) {
    console.log(error.message);
  }
};

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const transformDateToDMY = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${parseInt(day)}-${parseInt(month)}-${year}`;
};

// const debouncedCalenderHandler = debounce(calenderHandler, 1000);
prayerDate.addEventListener("change", calenderHandler);
window.addEventListener("load", () => {
  routCheck();
  fetcData();
  setYearRestriction();
});
