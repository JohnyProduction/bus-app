const { userEndpoints } = require('./routes/user');
const { userObservesCityConnectionEndpoints } = require('./routes/user-observes-city-connection');
const { departureEndpoints } = require('./routes/departure');
const { authenticateToken } = require('./auth');
const { db } = require('./db');

const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 3003;

const dotenv = require('dotenv');
dotenv.config('.');

app.use(express.json());
app.use(cors());

// User endpoints
const { newUser, login, deleteUser, getUserEmail, getUserNick } = userEndpoints(db);
app.post('/user', newUser);
app.post('/user/login', login);
app.delete('/user/:email', authenticateToken, deleteUser);
app.get('/user/email', getUserEmail);
app.get('/user/nick', getUserNick);

// User observes city connection
const { observeCityConnection, unobserveCityConnection } = userObservesCityConnectionEndpoints(db);
app.post('/user/observe-city-connection', authenticateToken, observeCityConnection);
app.post('/user/unobserve-city-connection', authenticateToken, unobserveCityConnection);

// Departure endpoints
const { fromToDeparture } = departureEndpoints(db);
app.get('/departure', fromToDeparture);

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});

module.exports = { db };