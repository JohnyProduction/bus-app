const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config('.');

const app = express();

// Middleware do parsowania JSON
app.use(express.json());

// Połączenie z bazą danych SQLite
let db = new sqlite3.Database('./baza.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Połączono z bazą danych SQlite.');
});


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Token w formacie 'Bearer TOKEN'

    if (!token) {
        return res.status(401).json({ error: 'Brak tokenu.' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token jest nieważny.' });
        }
        req.user = user; // Zapisanie użytkownika w obiekcie żądania
        next(); // Przejdź do następnego middleware lub trasy
    });
};

app.post('/newUser', async (req, res) => {
    const { username, email, password } = req.body; // Odczytanie danych z żądania

    // Sprawdzenie, czy hasło jest podane
    if (!password) {
        return res.status(400).json({ error: 'Hasło jest wymagane.' });
    }

    try {
        // Haszowanie hasła
        const hashedPassword = await bcrypt.hash(password, 12); // 12 to liczba "rounds" soli
        const role = "user";

        // Zapytanie SQL do wstawienia nowego użytkownika
        const sql = `INSERT INTO user (username, email, password_hash, role) VALUES (?, ?, ?, ?)`;
        
        // Wstawienie danych do bazy danych
        db.run(sql, [username, email, hashedPassword, role], function(err) {
            if (err) {
                return res.status(400).json({ error: err.message }); // Zwrócenie błędu
            }
            // Zwrócenie ID nowo wstawionego użytkownika
            res.status(201).json({ id: this.lastID, username, email, role });
        });
    } catch (error) {
        console.error('Błąd podczas haszowania hasła:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas rejestracji.' });
    }
});




// Endpoint do logowania użytkownika
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Odczytanie danych z żądania

    // Zapytanie SQL do znalezienia użytkownika
    const sql = `SELECT * FROM user WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        // Porównanie hasła
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        // Generowanie tokenu JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Zwrócenie tokenu i danych użytkownika
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    });
});

// Endpoint do usuwania użytkownika
app.delete('/user/:email', authenticateToken, (req, res) => {
    const userEmailToDelete = req.params.email;
    
    // Sprawdzenie, czy użytkownik ma rolę admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Nie masz uprawnień do usunięcia użytkownika.' });
    }

    const sql = `DELETE FROM user WHERE email = ?`;

    db.run(sql, [userEmailToDelete], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message }); // Zwrócenie błędu
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Użytkownik nie został znaleziony.' });
        }
        res.status(200).json({ message: 'Użytkownik został usunięty.' });
    });
});

app.get('/user/mail', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Nazwa użytkownika jest wymagana.' });
    }

    
    const sql = `SELECT email FROM user WHERE username = ?`;

    
    db.get(sql, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Nie ma takiego użytkownika.' });
        }

        // Return only the email in JSON format
        res.json({ email: row.email });
    });
});

app.get('/user/nick',async(req,res) =>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({ error: 'Email jest wymagany.' });
    }

    const sql = `SELECT username FROM user WHERE email = ?`;

    db.get(sql, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Nie ma takiego emaila.' });
        }

        // Return only the email in JSON format
        res.json({ email: row.username });
    });
});






const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});


