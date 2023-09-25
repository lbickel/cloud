window.addEventListener("load", () => {
    init();
});

function init() {
    const maintenanceForm = document.getElementById("maintenance-form");
    maintenanceForm.addEventListener("submit", (event) => submitForm(event));

    //setDatePickerToToday();

    // load token from local storage
    const token = localStorage.getItem("token");
    if (token) {
        // if token exists, check if it is still valid
        checkToken(token);
    } else {
        // if no token exists, show login form
        showLoginForm();
    }

    const logoffButton = document.getElementById("logoffButton");
    logoffButton.addEventListener("click", (event) => logoff(event));

}

function setDatePickerToToday() {
    const date = new Date();
    const today = date.toISOString().substr(0, 10);
    document.getElementById("date").value = today;
}

function submitForm(event) {
    event.preventDefault();
    const device = document.getElementById("device").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const date = document.getElementById("date").value;

    const formData = new FormData();
    formData.append("device", device);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("date", date);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInRlbmFudCI6InRlbmFudDEiLCJpYXQiOjE2OTQzNTg0MDcsImV4cCI6MTY5NDM2MjAwN30.raLQSBzpkh8VzB_LP_J7tCVwgTlUCvc9iOyFqrImGNw";

    fetch("/api/schreibedaten", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Daten erfolgreich gespeichert:", data);
        })
        .catch((error) => {
            console.error("Fehler beim Speichern der Daten:", error);
        });
}

function checkToken(token) {
    // TODO implement
    return true;
}

function showLoginForm() {
    window.location.href = "/";
}

function logoff(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}