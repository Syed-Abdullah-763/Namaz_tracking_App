
const routCheck = () => {
    const uid = localStorage.getItem("uid")

    if(!uid) {
        window.location.replace("../index.html")
    }
}

const logoutBtn = document.querySelector("#logoutBtn")

const logoutHandler = () => {
    localStorage.removeItem("uid")

    window.location.replace("../index.html")
}

logoutBtn.addEventListener("click", logoutHandler)
window.addEventListener("load", routCheck)