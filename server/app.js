const { userEndpoints } = require('./routes/user');
const { departureEndpoints } = require('./routes/departure');
const { routeEndpoints } = require('./routes/route');
const { busEndpoints } = require('./routes/bus');
const { activeDateSpanRoutes } = require('./routes/activeDateSpanRoutes');
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
const { getFilteredRoutesByCarrier, newRoute, replaceRoute, updateRoute, deleteRoute } = routeEndpoints(db);
app.get('/route/:carrierId', getFilteredRoutesByCarrier);
app.post('/route', newRoute);
app.put('/route/:id', replaceRoute);
app.patch('/route/:id', updateRoute);
app.delete('/route/:id', deleteRoute);

// Bus endpoints
const { getBusById, getBuses, newBus, updateBus, deleteBus } = busEndpoints(db);
app.get('/buses/:id', getBusById);
app.get('/buses', getBuses);
app.post('/buses', newBus);
app.put('/buses/:id', updateBus);
app.delete('/buses/:id', deleteBus);

const { getActiveDateSpansById, getActiveDateSpans, newActiveDateSpans, updateActiveDateSpan, deleteActiveDateSpan } = activeDateSpanRoutes(db);
app.get('/active-date-spans/:id', getActiveDateSpansById);
app.get('/active-date-spans', getActiveDateSpans);
app.post('/active-date-spans', newActiveDateSpans);
app.put('/active-date-spans/:id', updateActiveDateSpan);
app.delete('/active-date-spans/:id', deleteActiveDateSpan);

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});

module.exports = { db };