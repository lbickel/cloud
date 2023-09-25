window.addEventListener("load", () => {
    init();
});

function init() {
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", login);

    // load token from local storage
    const token = localStorage.getItem("token");
    if (token) {
        // if token exists, check if it is still valid
        if (checkToken(token)) {
            window.location.href = "/maintenance.html";
        }
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Token:", data);
            if (data.token) {
                hideLoginFailedMessage();
                localStorage.setItem("token", data.token);
                window.location.href = "/maintenance.html";
            } else {
                showLoginFailedMessage();
            }
        })
        .catch((error) => {
            console.error("Fehler beim Login:", error);
        });
}

function showLoginFailedMessage() {
    const loginFailedMessage = document.getElementById("login-failed-message");
    loginFailedMessage.classList.remove("hidden");
}

function hideLoginFailedMessage() {
    const loginFailedMessage = document.getElementById("login-failed-message");
    loginFailedMessage.classList.add("hidden");
}

function checkToken(token) {
    // TODO implement
    return true;
}