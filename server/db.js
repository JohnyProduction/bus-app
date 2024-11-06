const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./baza.db', (err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
        return;
    }

    console.log('Połączono z bazą danych SQlite.');
});

module.exports = {
    db
};