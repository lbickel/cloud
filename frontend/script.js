const token = localStorage.getItem('token');

        if (token) {
            fetch('http://localhost:3000/geschuetzt', {
                headers: {
                    'Authorization': token
                }
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.message;
            });
        } else {
            window.location.href = '/login.html'; // Weiterleitung zur Login-Seite, falls nicht eingeloggt
        }

addEventListener("submit", (event) => {
    event.preventDefault();

    var formData = new FormData(this);

    fetch('/api/schreibedaten', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Daten erfolgreich gespeichert:', data);
    })
    .catch(error => console.error('Fehler beim Speichern der Daten:', error));
});
