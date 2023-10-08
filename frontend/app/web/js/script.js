window.addEventListener("load", () => {
    init();
});

function init() {
    // load token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
        // if no token exists, show login form
        showLoginForm();
        return;
    }

    // if token exists, check if it is still valid
    checkToken(token);
    getData(token);
    initButtons();
}

function initButtons() {
    const logoffButton = document.getElementById("logoffButton");
    logoffButton.addEventListener("click", (event) => logoff(event));

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", (event) => saveData(event));
}

function showLoginForm() {
    window.location.href = "/";
}

function checkToken(token) {
    // TODO implement
    return true;
}

function logoff(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}

function getData(token) {
    fetch("/api/maintenance-report-entry", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Hier kannst du die Daten verarbeiten, sobald sie erhalten wurden
            console.log(data);
            data.forEach(maintenanceReportEntry => {
                addRow(maintenanceReportEntry);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function saveData(event) {
    event.preventDefault();
    // Holen der Eingabewerte aus dem Formular
    const wartungsgegenstand = document.getElementById("wartungsgegenstand").value;
    const vorname = document.getElementById("vorname").value;
    const nachname = document.getElementById("nachname").value;
    const datum = document.getElementById("datum").value;

    // Überprüfung, ob alle Felder ausgefüllt sind
    if (!wartungsgegenstand || !vorname || !nachname || !datum) {
        alert("Bitte füllen Sie alle Felder aus.");
        return;
    }

    const maintenanceReportEntry = {
        maintenanceObject: wartungsgegenstand,
        maintainer: vorname + " " + nachname,
        date: datum,
        id: uuidv4()
    };

    addRow(maintenanceReportEntry);

    // Schließen des Modals
    $('#wartungHinzufuegenModal').modal('hide');

    const formData = new FormData();
    formData.append("name", wartungsgegenstand);
    formData.append("maintainer", vorname);
    formData.append("lastName", nachname);
    formData.append("date", datum);

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bitte loggen Sie sich ein.");
        return;
    }

    fetch("/api/maintenance-report-entry", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
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

function addRow(maintenanceReportEntry) {
    const tableBody = document.querySelector(".table tbody");

    const newRow = document.createElement("tr");

    const cellDevice = document.createElement("td");
    const cellMaintainer = document.createElement("td");
    const cellDate = document.createElement("td");
    const cellId = document.createElement("td");
    const cellDelete = document.createElement("td");

    const icon = document.createElement("span");
    icon.classList.add("delete-icon");
    icon.innerHTML = "&#128465;"
    icon.style.cursor = "pointer";
    icon.addEventListener("click", () => deleteRow(icon));

    cellDevice.textContent = maintenanceReportEntry.maintenanceObject;
    cellMaintainer.textContent = maintenanceReportEntry.maintainer;
    cellDate.textContent = maintenanceReportEntry.date;
    cellId.textContent = maintenanceReportEntry.id;

    cellDelete.appendChild(icon);

    newRow.appendChild(cellDevice);
    newRow.appendChild(cellMaintainer);
    newRow.appendChild(cellDate);
    newRow.appendChild(cellId);
    newRow.appendChild(cellDelete);

    tableBody.appendChild(newRow);
}

function deleteRow(icon) {
    // show confirmation dialog
    const result = confirm("Wollen Sie den Eintrag wirklich löschen?");
    if (!result) {
        return;
    }
    const row = icon.parentElement.parentElement;
    row.remove();
}