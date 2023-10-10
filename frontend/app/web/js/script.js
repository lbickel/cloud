const maintenanceReports = {};
const maintenanceObjects = {};

// flag to check if new entry or edit
let edit = false;
let editId = null;

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

    const addButton = document.getElementById("addButton");
    addButton.addEventListener("click", () => initAddModal());

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", (event) => saveData(event));

    const dropdown = document.getElementById("wartungsbericht");
    dropdown.addEventListener("change", (event) => changeMaintenanceReport(event));
}

function showLoginForm() {
    window.location.href = "/";
}

function checkToken(token) {
    // TODO implement
    return true;
}

function initAddModal() {
    // update modal title
    document.getElementById("wartungHinzufuegenModalLabel").textContent = "Wartung hinzufügen";
    // clear form
    document.getElementById("wartungsgegenstand").value = "";
    document.getElementById("vorname").value = "";
    document.getElementById("nachname").value = "";
    // set date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("datum").value = today;
}

function logoff(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}

function getData(token) {
    getMaintenanceReportCurrentYear(token);
    getMaintenanceReports(token);
    getMaintenanceObjects(token);
}

function changeMaintenanceReport(event) {
    event.preventDefault();
    const year = event.target.value;
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bitte loggen Sie sich ein.");
        return;
    }
    // clear table
    const tableBody = document.querySelector(".table tbody");
    tableBody.innerHTML = "";
    // get data for selected year
    getMaintenanceReportEntriesByYear(token, year);
}

function getMaintenanceReportCurrentYear(token) {
    const year = new Date().getFullYear();
    fetch(`/api/maintenance-report/?year=${year}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            const year = new Date().getFullYear();
            createMaintenanceReport(token, year);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        data.entries.forEach(maintenanceReportEntry => {
            addRow(maintenanceReportEntry);
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}

function createMaintenanceReport(token, year) {
    fetch("/api/maintenance-report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            year: year
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Error:', error);
    });
}

function getMaintenanceReports(token) {
    fetch("/api/maintenance-report", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        // add to dropdown sorted by year
        const dropdown = document.getElementById("wartungsbericht");
        data.sort((a, b) => a.year - b.year);
        data.forEach(maintenanceReport => {
            const option = document.createElement("option");
            option.value = maintenanceReport.year;
            option.textContent = maintenanceReport.year;
            dropdown.appendChild(option);
        });
        // select current year
        const year = new Date().getFullYear();
        dropdown.value = year;

        // save id of each maintenance report
        data.forEach(maintenanceReport => {
            maintenanceReports[maintenanceReport.year] = maintenanceReport.id;
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}

function getMaintenanceReportEntries(token) {
    fetch("/api/maintenance-report-entry", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        data.forEach(maintenanceReportEntry => {
            addRow(maintenanceReportEntry);
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}

function getMaintenanceReportEntriesByYear(token, year) {
    fetch(`/api/maintenance-report/?year=${year}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        // add data entries to table
        data.entries.forEach(maintenanceReportEntry => {
            addRow(maintenanceReportEntry);
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}

function getMaintenanceObjects(token) {
    fetch("/api/maintenance-object", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        data.forEach(maintenanceObject => {
            // add to dropdown
            const dropdown = document.getElementById("wartungsgegenstand");
            const option = document.createElement("option");
            option.value = maintenanceObject.name;
            option.textContent = maintenanceObject.name;
            dropdown.appendChild(option);
        });
        // save id of each maintenance object
        data.forEach(maintenanceObject => {
            maintenanceObjects[maintenanceObject.name] = maintenanceObject.id;
        });

    }).catch(error => {
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

    // date is yyyy-mm-dd, but input expects dd-mm-yyyy
    const dateParts = datum.split("-");
    const dateInput = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    // get maintenance object id
    const maintenanceObjectId = maintenanceObjects[wartungsgegenstand];
    // get maintenance report id
    const year = document.getElementById("wartungsbericht").value;
    const maintenanceReportId = maintenanceReports[year];

    const maintenanceReportEntry = {
        maintenanceObject: wartungsgegenstand,
        maintainer: vorname + " " + nachname,
        date: dateInput,
        maintenanceObjectId: maintenanceObjectId,
        maintenanceReportId: maintenanceReportId
    };

    // Schließen des Modals
    $('#wartungHinzufuegenModal').modal('hide');

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bitte loggen Sie sich ein.");
        return;
    }

    if (edit) {
        updateMaintenanceReportEntry(token, maintenanceReportEntry);
        return;
    }
    createMaintenanceReportEntry(token, maintenanceReportEntry);
}

function createMaintenanceReportEntry(token, maintenanceReportEntry) {
    fetch("/api/maintenance-report-entry", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(maintenanceReportEntry),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Daten erfolgreich gespeichert:", data);
            addRow(data);
        })
        .catch((error) => {
            console.error("Fehler beim Speichern der Daten:", error);
        });
}

function updateMaintenanceReportEntry(token, maintenanceReportEntry) {
    maintenanceReportEntry.id = editId;
    fetch(`/api/maintenance-report-entry/${editId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(maintenanceReportEntry),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Daten erfolgreich gespeichert:", data);
            updateTable(editId, data);
        })
        .catch((error) => {
            console.error("Fehler beim Speichern der Daten:", error);
        }).finally(() => {
            edit = false;
            editId = null;
        });
}

function updateTable(id, data) {
    const tableBody = document.querySelector(".table tbody");
    const rows = tableBody.children;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].children[3].textContent === id) {
            rows[i].children[0].textContent = data.maintenanceObject;
            rows[i].children[1].textContent = data.maintainer;
            rows[i].children[2].textContent = data.date;
            break;
        }
    }
}

function addRow(data) {
    const tableBody = document.querySelector(".table tbody");

    const newRow = document.createElement("tr");

    const cellDevice = document.createElement("td");
    const cellMaintainer = document.createElement("td");
    const cellDate = document.createElement("td");
    const cellId = document.createElement("td");
    const cellAction = document.createElement("td");

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = "&#128465;"
    deleteIcon.style.cursor = "pointer";
    deleteIcon.addEventListener("click", () => deleteRow(deleteIcon));

    const editIcon = document.createElement("span");
    editIcon.classList.add("edit-icon");
    editIcon.innerHTML = "&#9998;"
    editIcon.style.cursor = "pointer";
    editIcon.addEventListener("click", () => editRow(editIcon));

    cellDevice.textContent = data.maintenanceObject;
    cellMaintainer.textContent = data.maintainer;
    cellDate.textContent = data.date;
    cellId.textContent = data.id;

    cellAction.appendChild(editIcon);
    cellAction.appendChild(deleteIcon);

    newRow.appendChild(cellDevice);
    newRow.appendChild(cellMaintainer);
    newRow.appendChild(cellDate);
    newRow.appendChild(cellId);
    newRow.appendChild(cellAction);

    tableBody.appendChild(newRow);
}

function editRow(icon) {
    edit = true;
    editId = icon.parentElement.parentElement.children[3].textContent;

    const row = icon.parentElement.parentElement;
    const device = row.children[0].textContent;
    const maintainer = row.children[1].textContent;
    const date = row.children[2].textContent;
    // date is dd-mm-yyyy, but input expects yyyy-mm-dd
    const dateParts = date.split("-");
    const dateInput = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    document.getElementById("wartungsgegenstand").value = device;
    document.getElementById("vorname").value = maintainer.split(" ")[0];
    document.getElementById("nachname").value = maintainer.split(" ")[1];
    document.getElementById("datum").value = dateInput;

    // update modal title
    document.getElementById("wartungHinzufuegenModalLabel").textContent = "Wartung bearbeiten";

    $('#wartungHinzufuegenModal').modal('show');
}

function deleteRow(icon) {
    // show confirmation dialog
    const result = confirm("Wollen Sie den Eintrag wirklich löschen?");
    if (!result) {
        return;
    }
    const row = icon.parentElement.parentElement;
    row.remove();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bitte loggen Sie sich ein.");
        return;
    }

    // remove from database
    const id = row.children[3].textContent;
    fetch(`/api/maintenance-report-entry/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Daten erfolgreich gelöscht:", data);
        })
        .catch((error) => {
            console.error("Fehler beim Löschen der Daten:", error);
        });
}