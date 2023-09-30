window.addEventListener("load", () => {
    init();
});

function init() {
    // load token from local storage
    const token = localStorage.getItem("token");
    if (token) {
        // if token exists, check if it is still valid
        checkToken(token);
    } else {
        // if no token exists, show login form
        showLoginForm();
    }

    getData(token); 

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
     if (wartungsgegenstand && vorname && nachname && datum) {
         // Erstellen einer neuen Tabellenzeile
         const newRow = document.createElement("tr");
 
         // Erstellen der Zellen für die Zeile
         const cellWartungsgegenstand = document.createElement("td");
         const cellVorname = document.createElement("td");
         const cellNachname = document.createElement("td");
         const cellDatum = document.createElement("td");
 
         // Setzen der Textinhalte der Zellen
         cellWartungsgegenstand.textContent = wartungsgegenstand;
         cellVorname.textContent = vorname;
         cellNachname.textContent = nachname;
         cellDatum.textContent = datum;
 
         // Hinzufügen der Zellen zur Zeile
         newRow.appendChild(cellWartungsgegenstand);
         newRow.appendChild(cellVorname);
         newRow.appendChild(cellNachname);
         newRow.appendChild(cellDatum);
 
         // Hinzufügen der Zeile zur Tabelle
         const tableBody = document.querySelector(".table tbody");
         tableBody.appendChild(newRow);
 
         // Schließen des Modals
         $('#wartungHinzufuegenModal').modal('hide');
     } else {
         alert("Bitte füllen Sie alle Felder aus.");
     }

     
    const device = document.getElementById("device").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const date = document.getElementById("date").value;

    const formData = new FormData();
    formData.append("device", device);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("date", date);

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

function deleteRow(icon) {
    const row = icon.parentElement.parentElement;
    row.remove();
}