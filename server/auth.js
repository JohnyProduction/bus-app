const jwt = require("jsonwebtoken");

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

module.exports = {
    authenticateToken
};