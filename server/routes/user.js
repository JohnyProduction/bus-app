// routes/user.js
const express = require('express');
const { authenticateToken, generateToken } = require('../auth');
const bcrypt = require("bcryptjs");
const { CreateUserDto, LoginUserDto, LoggedInUserResponseDto, UserDto } = require("../dtos/user-dto");

const userEndpoints = (db) => {
    // Endpoint do tworzenia użytkownika
    const newUser = async (req, res) => {
        const createUserDto = new CreateUserDto(req.body);

        try {
            createUserDto.validate();
        } catch (err) {
            return res.status(400).send(err.message);
        }

        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
            // Ustawienie roli: jeśli użytkownik jest adminem i poda rolę, użyj jej; inaczej ustaw na 'user'
            const role = req.body.role && req.user.role === 'admin' ? req.body.role : 'user';

            const sql = `INSERT INTO user (username, email, password_hash, role) VALUES (?, ?, ?, ?)`;

            db.run(sql, [createUserDto.username, createUserDto.email, hashedPassword, role], function(err) {
                if (err) {
                    return res.status(400).send(err.message);
                }

                const userDto = new UserDto({
                    id: this.lastID,
                    username: createUserDto.username,
                    email: createUserDto.email,
                    role
                });

                try {
                    return res.status(201).json(userDto);
                } catch(err) {
                    return res.status(400).send(err.message);
                }
            });
        } catch (error) {
            console.error('Błąd podczas haszowania hasła:', error);
            res.status(500).send('Wystąpił błąd podczas rejestracji.');
        }
    }

    // Endpoint do logowania użytkownika
    const login = async (req, res) => {
        const loginUserDto = new LoginUserDto(req.body);

        // Walidacja danych wejściowych
        try {
            loginUserDto.validate();
        } catch (err) {
            return res.status(400).send(err.message);
        }

        const sql = `SELECT * FROM user WHERE email = ?`;

        db.get(sql, [loginUserDto.email], async (err, user) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (!user) {
                return res.status(401).send('Nieprawidłowy email lub hasło.');
            }

            // Porównanie zahaszowanego hasła
            const isMatch = await bcrypt.compare(loginUserDto.password, user.password_hash);
            if (!isMatch) {
                return res.status(401).send('Nieprawidłowy email lub hasło.');
            }

            // Generowanie tokenu JWT
            const token = generateToken(user.id, user.role, user.username);

            // Tworzenie odpowiedzi z tokenem i danymi użytkownika
            const responseDto = new LoggedInUserResponseDto({
                token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            });

            try {
                res.status(200).json(responseDto);
            } catch (err) {
                res.status(400).send(err.message);
            }
        });
    };

    const logout = (req, res) => {
        // W przypadku JWT nie trzeba usuwać sesji po stronie serwera
        res.status(200).json({ message: 'Pomyślnie wylogowano.' });
    };

    // Endpoint do usuwania użytkownika
    const deleteUser = (req, res) => {
        const userEmailToDelete = req.params.email;

        // Użyj middleware authenticateToken przed tym endpointem, aby mieć dostęp do req.user
        if (req.user.role !== 'admin') {
            return res.status(403).send('Nie masz uprawnień do usunięcia użytkownika.');
        }

        const sql = `DELETE FROM user WHERE email = ?`;

        db.run(sql, [userEmailToDelete], function(err) {
            if (err) {
                return res.status(400).send(err.message);
            }

            if (this.changes === 0) {
                return res.status(404).send('Użytkownik nie został znaleziony.');
            }

            res.status(200).send('Użytkownik został usunięty.');
        });
    };

    // Endpoint do pobierania emaila użytkownika
    const getUserEmail = (req, res) => {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send('Nazwa użytkownika jest wymagana.');
        }

        const sql = `SELECT email FROM user WHERE username = ?`;

        db.get(sql, [username], (err, row) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            if (!row) {
                return res.status(404).send('Nie ma takiego użytkownika.');
            }

            return res.status(200).json({ email: row.email });
        });
    };

    // Endpoint do pobierania nazwy użytkownika
    const getUserNick = (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send('Email jest wymagany.');
        }

        const sql = `SELECT username FROM user WHERE email = ?`;

        db.get(sql, [email], (err, row) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            if (!row) {
                return res.status(404).send('Nie ma takiego emaila.');
            }

            res.status(200).json({ username: row.username });
        });
    };

    // Endpoint do pobierania wszystkich użytkowników
    const getAllUsers = (req, res) => {
        if (!req.user) {
            return res.status(401).send('Nieautoryzowany dostęp.');
        }

        if (req.user.role !== 'admin') {
            return res.status(403).send('Nie masz uprawnień do wyświetlania użytkowników.');
        }

        const sql = `SELECT * FROM user`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            res.status(200).json(rows);
        });
    };

    return { newUser, login, logout, deleteUser, getUserEmail, getUserNick, getAllUsers };
};

module.exports = { userEndpoints };
