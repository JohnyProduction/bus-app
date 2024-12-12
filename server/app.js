const { userEndpoints } = require('./routes/user');
const { departureEndpoints } = require('./routes/departure');
const { authenticateToken } = require('./auth');
const { connectionEndpoints } = require('./routes/connection');
const { userObservesCityConnectionEndpoints } = require('./routes/user-observes-city-connection');
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
const { newUser, login, logout, deleteUser, getUserEmail, getUserNick, getAllUsers, changeUserRole } = userEndpoints(db);
app.post('/user', newUser);
app.post('/user/login', login);
app.post('/user/logout', logout);
app.delete('/user/:email', deleteUser);
app.get('/user/email', getUserEmail);
app.get('/user/nick', getUserNick);
app.get('/users', getAllUsers);
app.put('/user/role', changeUserRole);

// Observed city connection endpoints
const { observeCityConnection, unobserveCityConnection, getObservedRoutes  } = userObservesCityConnectionEndpoints(db);
app.post('/user/observed-route',  observeCityConnection);
app.delete('/user/observed-route', unobserveCityConnection);
app.get('/user/observed-routes', getObservedRoutes);

// Connection endpoints
const { search } = connectionEndpoints(db);
app.get('/connections/search', search);

// Departure endpoints
const { fromToDeparture } = departureEndpoints(db);
app.get('/departure', fromToDeparture);

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});

module.exports = { db };
