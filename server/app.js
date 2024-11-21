const { userEndpoints } = require('./routes/user');
const { departureEndpoints } = require('./routes/departure');
const { routeEndpoints } = require('./routes/route');
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
const { newUser, login, deleteUser, getUserEmail, getUserNick, getFilteredUsers } = userEndpoints(db);
app.post('/user', newUser);
app.post('/user/login', login);
app.delete('/user/:email', authenticateToken, deleteUser);
app.get('/user/email', getUserEmail);
app.get('/user/nick', getUserNick);
app.get('/user/:nameFilter', getFilteredUsers);

// Departure endpoints
const { fromToDeparture } = departureEndpoints(db);
app.get('/departure', fromToDeparture);

// Route endpoints
const { getFilteredRoutesByCarrier } = routeEndpoints(db);
app.get('/route/:carrierId', getFilteredRoutesByCarrier);

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});

module.exports = { db };