const bcrypt = require("bcryptjs");
const { CreateUserDto, LoginUserDto, LoggedInUserResponseDto, UserDto} = require("../dtos/user-dto");
const { basicEncode } = require('../auth');

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
            const role = "user";
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

            const isMatch = await bcrypt.compare(loginUserDto.password, user.password_hash);

            if (!isMatch) {
                return res.status(401).send('Nieprawidłowy email lub hasło.');
            }

            const basic = basicEncode(user.id, user.role);
            const responseDto = new LoggedInUserResponseDto({ basic, user: { id: user.id, username: user.username, email: user.email, role: user.role }})

            try {
                res.status(200).json(responseDto);
            } catch (err) {
                res.status(400).send(err.message);
            }
        });
    };

    // Endpoint do usuwania użytkownika
    const deleteUser = (req, res) => {
        const userEmailToDelete = req.params.email;

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

    // Endpoint for getting user email
    const getUserEmail = async (req, res) => {
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

// Endpoint for getting user nick
    const getUserNick = async (req,res) => {
        const { email } = req.body;

        if(!email){
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

    return { newUser, login, deleteUser, getUserEmail, getUserNick };
};

module.exports = { userEndpoints };