// auth.js

const jwt = require("jsonwebtoken");
const SECRET_KEY = '3f2c1e4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d';

/**
 * Middleware do uwierzytelniania tokenu JWT.
 * Sprawdza, czy nagłówek Authorization zawiera poprawny token.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Logowanie nagłówka dla debugowania

    if (!authHeader) {
        return res.status(401).json({ error: 'Brak tokenu uwierzytelniającego.' });
    }

    const parts = authHeader.split(' ');
    console.log('Authorization Parts:', parts); // Logowanie części nagłówka

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Nieprawidłowy format tokenu.' });
    }

    const token = parts[1];
    console.log('Extracted Token:', token); // Logowanie wyciągniętego tokenu

    if (!token) {
        return res.status(401).json({ error: 'Brak tokenu.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err); // Logowanie błędu weryfikacji tokenu
            return res.status(403).json({ error: 'Token jest nieważny.' });
        }
        req.user = user; // Zapisanie danych użytkownika w obiekcie żądania
        next(); // Przejście do następnego middleware lub trasy
    });
};

/**
 * Funkcja do generowania tokenu JWT.
 * @param {string} userId - ID użytkownika.
 * @param {string} userRole - Rola użytkownika.
 * @param {string} userUsername - Nazwa użytkownika.
 * @returns {string} - Wygenerowany token JWT.
 */
const generateToken = (userId, userRole, userUsername) => {
    const payload = {
        id: userId,
        role: userRole,
        username: userUsername
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
};

/**
 * Funkcja do odświeżania tokenu JWT.
 * @param {string} oldToken - Stary token JWT.
 * @returns {string} - Nowy token JWT.
 * @throws {Error} - Jeśli odświeżenie tokenu się nie powiedzie.
 */
const refreshToken = (oldToken) => {
    try {
        const decoded = jwt.verify(oldToken, SECRET_KEY, { ignoreExpiration: true });
        const newToken = jwt.sign({
            id: decoded.id,
            role: decoded.role,
            username: decoded.username
        }, SECRET_KEY, { expiresIn: '1h' });
        return newToken;
    } catch (err) {
        console.error('Refresh Token Error:', err); // Logowanie błędu odświeżania tokenu
        throw new Error('Nie można odświeżyć tokenu.');
    }
};

/**
 * Middleware do autoryzacji na podstawie roli użytkownika.
 * @param {string} requiredRole - Wymagana rola do dostępu.
 * @returns {Function} - Middleware funkcja.
 */
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ error: 'Brak uprawnień.' });
        }
    };
};

/**
 * Funkcja do weryfikacji tokenu resetowania hasła.
 * @param {string} token - Token resetowania hasła.
 * @returns {Object} - Dekodowane dane tokenu.
 * @throws {Error} - Jeśli token jest nieprawidłowy lub wygasł.
 */
const verifyResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (err) {
        console.error('Verify Reset Token Error:', err); // Logowanie błędu weryfikacji tokenu resetowania
        throw new Error('Nieprawidłowy lub wygasły token resetowania hasła.');
    }
};

/**
 * Funkcja do generowania tokenu resetowania hasła.
 * @param {string} userId - ID użytkownika.
 * @returns {string} - Wygenerowany token resetowania hasła.
 */
const generateResetToken = (userId) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
    return token;
};

module.exports = {
    authenticateToken,
    generateToken,
    refreshToken,
    authorizeRole,
    verifyResetToken,
    generateResetToken
};
