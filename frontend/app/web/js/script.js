const maintenanceReports = {};
const maintenanceObjects = {};

// flag to check if new entry or edit
let edit = false;
let editId = null;

window.addEventListener("load", () => {
    init();
});

async function init() {
    const token = localStorage.getItem("token");
    checkToken(token);
    initButtons();
    await updateMaintenanceReports(token);
    await updateMaintenanceObjects(token);
    const year = document.getElementById("maintenance-report").value;
    await updateMaintenanceReportEntryTable(token, year);
}

function initButtons() {
    const logoffButton = document.getElementById("logoffButton");
    logoffButton.addEventListener("click", (event) => logoff(event));

    const addButton = document.getElementById("addButton");
    addButton.addEventListener("click", () => initAddModal());

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", (event) => saveData(event));

    const saveObjectButton = document.getElementById("saveObjectButton");
    saveObjectButton.addEventListener("click", (event) => saveObject(event));

    const saveReportButton = document.getElementById("add-maintenance-report-button");
    saveReportButton.addEventListener("click", (event) => saveReport(event));

    const editReportsButton = document.getElementById("editReportsButton");
    editReportsButton.addEventListener("click", () => initEditReportsModal());

    const editObjectsButton = document.getElementById("editObjectsButton");
    editObjectsButton.addEventListener("click", () => initEditObjectsModal());

    const dropdown = document.getElementById("maintenance-report");
    dropdown.addEventListener("change", (event) => changeMaintenanceReport(event));
}

function showLoginForm() {
    window.location.href = "/";
}

function checkToken(token) {
    if (!token) {
        alert("Bitte loggen Sie sich ein.");
        logoff();
        return false;
    }
    return true;
}

function initAddModal() {
    // update modal title
    document.getElementById("add-maintenance-modal-label").textContent = "Wartung hinzufügen";
    // clear form
    document.getElementById("maintenance-object").value = "";
    document.getElementById("first-name").value = "";
    document.getElementById("last-name").value = "";
    // set date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;
}

async function initEditObjectsModal() {
    // update modal title
    document.getElementById("add-maintenance-object-modal-label").textContent = "Wartungsobjekte verwalten";
    // clear form
    document.getElementById("objekt").value = "";
    const token = localStorage.getItem("token");
    checkToken(token);

    const data = await getMaintenanceObjects(token);
    // add to table sorted by name with delete icon
    const tableBody = document.getElementById("edit-objects-table").querySelector("tbody");
    tableBody.innerHTML = "";
    data.sort((a, b) => a.name.localeCompare(b.name));
    data.forEach(maintenanceObject => {
        const newRow = document.createElement("tr");

        const cellName = document.createElement("td");
        const cellAction = document.createElement("td");
        const cellId = document.createElement("td");

        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.innerHTML = "&#128465;"
        deleteIcon.style.cursor = "pointer";
        deleteIcon.addEventListener("click", () => deleteMaintenanceObject(deleteIcon));

        cellName.textContent = maintenanceObject.name;
        cellAction.appendChild(deleteIcon);
        cellId.textContent = maintenanceObject.id;

        // make cellid invisible
        cellId.style.display = "none";

        newRow.appendChild(cellName);
        newRow.appendChild(cellAction);
        newRow.appendChild(cellId);

        tableBody.appendChild(newRow);
    });
}

async function initEditReportsModal() {
    const token = localStorage.getItem("token");
    checkToken(token);

    const data = await getMaintenanceReports(token);
    // add to table sorted by year with delete icon
    const tableBody = document.getElementById("edit-reports-table").querySelector("tbody");
    tableBody.innerHTML = "";
    if (!data || data.length === 0) {
        // show message that no maintenance reports exist
        const newRow = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = "Keine Wartungsberichte vorhanden";
        newRow.appendChild(cell);
        tableBody.appendChild(newRow);
        return;
    }
    data.sort((a, b) => a.year - b.year);
    data.forEach(maintenanceReport => {
        const newRow = document.createElement("tr");

        const cellYear = document.createElement("td");
        const cellAction = document.createElement("td");
        const cellId = document.createElement("td");

        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.innerHTML = "&#128465;"
        deleteIcon.style.cursor = "pointer";
        deleteIcon.addEventListener("click", () => deleteMaintenanceReport(deleteIcon));

        cellYear.textContent = maintenanceReport.year;
        cellAction.appendChild(deleteIcon);
        cellId.textContent = maintenanceReport.id;

        // make cellid invisible
        cellId.style.display = "none";

        newRow.appendChild(cellYear);
        newRow.appendChild(cellAction);
        newRow.appendChild(cellId);

        tableBody.appendChild(newRow);
    });
}

function logoff(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}

async function changeMaintenanceReport(event) {
    event.preventDefault();
    const year = event.target.value;
    const token = localStorage.getItem("token");
    checkToken(token);
    await updateMaintenanceReportEntryTable(token, year);
}

async function updateMaintenanceReportEntryTable(token, year) {
    // clear table
    const tableBody = document.querySelector(".table tbody");
    tableBody.innerHTML = "";
    // get data for selected year
    const entries = await getMaintenanceReportEntriesByYear(token, year);
    if (!entries || entries.length === 0) {
        // show message that no entries exist
        const newRow = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "Keine Einträge vorhanden";
        newRow.appendChild(cell);
        tableBody.appendChild(newRow);
        return;
    }
    entries.forEach(maintenanceReportEntry => {
        addRow(maintenanceReportEntry);
    });
    // update dropdown
    const dropdown = document.getElementById("maintenance-report");
    dropdown.value = year;
}

async function getMaintenanceReport(token, year) {
    try {
        const response = await fetch(`/api/maintenance-report/?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

async function createMaintenanceReport(token, year) {
    try {
        const response = await fetch("/api/maintenance-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                year: year
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
    }
}

async function getMaintenanceReports(token) {
    try {
        const response = await fetch("/api/maintenance-report", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

async function updateMaintenanceReports(token) {

    // clear dropdown
    const dropdown = document.getElementById("maintenance-report");
    dropdown.innerHTML = "";

    // clear global maintenanceReports
    Object.keys(maintenanceReports).forEach(key => {
        delete maintenanceReports[key];
    });

    const data = await getMaintenanceReports(token);
    if (!data || data.length === 0) {
        // show message that no maintenance reports exist
        const dropdown = document.getElementById("maintenance-report");
        dropdown.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Keine Wartungsberichte vorhanden";
        dropdown.appendChild(option);
        return;
    }

    // add to dropdown sorted by year
    data.sort((a, b) => a.year - b.year);
    data.forEach(maintenanceReport => {
        const option = document.createElement("option");
        option.value = maintenanceReport.year;
        option.textContent = maintenanceReport.year;
        dropdown.appendChild(option);
    });

    // save id of each maintenance report
    data.forEach(maintenanceReport => {
        maintenanceReports[maintenanceReport.year] = maintenanceReport.id;
    });

    // set selected year to current year if exists
    const currentYear = new Date().getFullYear();
    if (maintenanceReports[currentYear]) {
        dropdown.value = currentYear;
    } else {
        // set selected year to first year
        dropdown.value = data[0].year;
    }
}

async function updateMaintenanceObjects(token) {
    const data = await getMaintenanceObjects(token);
    addMaintenanceObjectsToDropdown(data);
    // save id of each maintenance object
    data.forEach(maintenanceObject => {
        maintenanceObjects[maintenanceObject.name] = maintenanceObject.id;
    });

    initEditObjectsModal();
}

async function getMaintenanceReportEntriesByYear(token, year) {
    try {
        const response = await fetch(`/api/maintenance-report/?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data.entries;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

async function getMaintenanceObjects(token) {
    try {
        const response = await fetch("/api/maintenance-object", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
    }
}

function addMaintenanceObjectsToDropdown(data) {
    const dropdown = document.getElementById("maintenance-object");
    // clear dropdown
    dropdown.innerHTML = "";

    data.forEach(maintenanceObject => {
        // add to dropdown
        const option = document.createElement("option");
        option.value = maintenanceObject.name;
        option.textContent = maintenanceObject.name;
        dropdown.appendChild(option);
    });
}

async function saveData(event) {
    event.preventDefault();
    // Holen der Eingabewerte aus dem Formular
    const maintenanceObject = document.getElementById("maintenance-object").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const date = document.getElementById("date").value;

    // Überprüfung, ob alle Felder ausgefüllt sind
    if (!maintenanceObject || !firstName || !lastName || !date) {
        alert("Bitte füllen Sie alle Felder aus.");
        return;
    }

    // date is yyyy-mm-dd, but input expects dd-mm-yyyy
    const dateParts = date.split("-");
    const dateInput = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    // get maintenance object id
    const maintenanceObjectId = maintenanceObjects[maintenanceObject];
    // get maintenance report id
    const year = dateParts[0];
    let maintenanceReportId = maintenanceReports[year];
    const token = localStorage.getItem("token");
    if (!maintenanceReportId) {
        checkToken(token);
        await createMaintenanceReport(token, Number(year));
        await updateMaintenanceReports(token);
        maintenanceReportId = maintenanceReports[year];
    }

    const maintenanceReportEntry = {
        maintainer: firstName + " " + lastName,
        date: dateInput,
        maintenanceObjectId: maintenanceObjectId,
        maintenanceReportId: maintenanceReportId
    };

    // Schließen des Modals
    $('#add-maintenance-modal').modal('hide');

    checkToken(token);
    if (edit) {
        updateMaintenanceReportEntry(token, maintenanceReportEntry);
        return;
    }

    await createMaintenanceReportEntry(token, maintenanceReportEntry);
    await updateMaintenanceReportEntryTable(token, year);
}

async function createMaintenanceReportEntry(token, maintenanceReportEntry) {
    try {
        const response = await fetch("/api/maintenance-report-entry", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(maintenanceReportEntry),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
    }
}

async function updateMaintenanceReportEntry(token, maintenanceReportEntry) {
    maintenanceReportEntry.id = editId;
    try {
        const response = await fetch(`/api/maintenance-report-entry/${editId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(maintenanceReportEntry),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        updateTable(editId, data);
        return data;
    } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
    } finally {
        edit = false;
        editId = null;
    }
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

async function saveObject(event) {
    event.preventDefault();
    // Holen der Eingabewerte aus dem Formular
    const maintenanceObject = document.getElementById("objekt").value;

    // Überprüfung, ob alle Felder ausgefüllt sind
    if (!maintenanceObject) {
        alert("Bitte füllen Sie das Feld aus.");
        return;
    }

    const maintenanceObjectEntry = {
        name: maintenanceObject,
    };

    const token = localStorage.getItem("token");
    checkToken(token);
    await createMaintenanceObjectEntry(token, maintenanceObjectEntry);
    await updateMaintenanceObjects(token);
}

async function createMaintenanceObjectEntry(token, maintenanceObjectEntry) {
    try {
        const response = await fetch("/api/maintenance-object", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(maintenanceObjectEntry),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
    }
}

async function saveReport(event) {
    event.preventDefault();
    // Holen der Eingabewerte aus dem Formular
    const year = document.getElementById("add-maintenance-report").value;

    // Überprüfung, ob alle Felder ausgefüllt sind
    if (!year) {
        alert("Bitte füllen Sie das Feld aus.");
        return;
    }

    // check if year is valid 4 digit number
    if (isNaN(year) || year.length !== 4) {
        alert("Bitte geben Sie eine gültige Jahreszahl ein.");
        return;
    }

    // check if report already exists
    if (maintenanceReports[year]) {
        alert("Ein Wartungsbericht für das Jahr " + year + " existiert bereits.");
        return;
    }

    const token = localStorage.getItem("token");
    checkToken(token);
    await createMaintenanceReport(token, Number(year));
    await updateMaintenanceReportList(token);
}

async function updateMaintenanceReportList(token) {
    const data = await getMaintenanceReports(token);
    // save id of each maintenance report
    data.forEach(maintenanceReport => {
        maintenanceReports[maintenanceReport.year] = maintenanceReport.id;
    });

    initEditReportsModal();
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

    document.getElementById("maintenance-object").value = device;
    document.getElementById("first-name").value = maintainer.split(" ")[0];
    document.getElementById("last-name").value = maintainer.split(" ")[1];
    document.getElementById("date").value = dateInput;

    // update modal title
    document.getElementById("add-maintenance-modal-label").textContent = "Wartung bearbeiten";

    $('#add-maintenance-modal').modal('show');
}

async function deleteRow(icon) {
    // show confirmation dialog
    const result = confirm("Wollen Sie den Eintrag wirklich löschen?");
    if (!result) {
        return;
    }
    const row = icon.parentElement.parentElement;

    const token = localStorage.getItem("token");
    checkToken(token);

    // remove from database
    const id = row.children[3].textContent;
    const success = await deleteMaintenanceReportEntryFromDatabase(token, id);
    if (!success) {
        alert("Der Eintrag konnte nicht gelöscht werden.");
        return;
    }
    row.remove();
    updateMaintenanceReportEntryTable(token, document.getElementById("maintenance-report").value);
}

async function deleteMaintenanceReportEntryFromDatabase(token, id) {
    try {
        const response = await fetch(`/api/maintenance-report-entry/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        return null;
    }
}

async function deleteMaintenanceReport(deleteIcon) {
    // show confirmation dialog
    const result = confirm("Wollen Sie den Eintrag wirklich löschen?");
    if (!result) {
        return;
    }

    const row = deleteIcon.parentElement.parentElement;
    row.remove();

    // remove from database
    const year = row.children[0].textContent;
    const id = maintenanceReports[year];

    if (!id) {
        alert("Kein Eintrag für das Jahr " + year + " gefunden.");
        return;
    }
    const token = localStorage.getItem("token");
    checkToken(token);
    await deleteMaintenanceReportFromDatabase(token, id);
    await updateMaintenanceReports(token);
    const yearNew = document.getElementById("maintenance-report").value;
    await updateMaintenanceReportEntryTable(token, yearNew);
}

async function deleteMaintenanceReportFromDatabase(token, id) {
    try {
        const response = await fetch(`/api/maintenance-report/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
    }
}

async function deleteMaintenanceObject(deleteIcon) {
    // show confirmation dialog
    const result = confirm("Wollen Sie den Eintrag wirklich löschen?");
    if (!result) {
        return;
    }

    const row = deleteIcon.parentElement.parentElement;

    // remove from database
    const name = row.children[0].textContent;
    const id = maintenanceObjects[name];

    if (!id) {
        alert("Kein Eintrag für das Objekt " + name + " gefunden.");
        return;
    }
    const token = localStorage.getItem("token");
    checkToken(token);
    const success = await deleteMaintenanceObjectFromDatabase(token, id);
    if (!success) {
        alert("Das Objekt " + name + " konnte nicht gelöscht werden. Möglicherweise wird es noch verwendet.");
        return;
    }
    row.remove();

    await updateMaintenanceObjects(token);
}

async function deleteMaintenanceObjectFromDatabase(token, id) {
    try {
        const response = await fetch(`/api/maintenance-object/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        return null;
    }
}