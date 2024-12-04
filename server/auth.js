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

const basicEncode = (userId, userRole, userUsername) => {
    const userString = `${userId}:${userRole}:${userUsername}`;
    const encodedUser = Buffer.from(userString).toString('base64');

    return encodedUser;
};

const basicDecode = (encodedUser) => {
    const decodedUser = Buffer.from(encodedUser, 'base64').toString('utf-8');
    const [id, role, username] = decodedUser.split(':');

    return { id, role, username };
};

module.exports = {
    authenticateToken,
    basicEncode, basicDecode
};