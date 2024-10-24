const express = require('express');
const bodyParser = require('body-parser');
const carrierRoutes = require('./routes/carrierRoutes');
const routeRoutes = require('./routes/routeRoutes');
const busRoutes  = require('./routes/busRoutes')
const routeDepartureRuleRoutes = require('./routes/routeDepartureRuleRoutes');
const routeStopRoutes = require('./routes/routeStopRoutes');
const departureTimeRoutes = require('./routes/departureTimeRoutes');
const stopRoutes = require('./routes/stopRoutes');
const cityRoutes = require('./routes/cityRoutes');
const userObservesCityRoutes = require('./routes/userObservesCityRoutes');
const userRoutes = require('./routes/userRoutes');
const activeDateSpanRoutes = require('./routes/activeDateSpanRoutes');
const departureWeekdayRoutes = require('./routes/departureWeekdayRoutes');
const recurringHolidayRoutes = require('./routes/recurringHolidayRoutes'); 
const inactiveDateSpanRoutes = require('./routes/inactiveDateSpanRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/carriers', carrierRoutes);
app.use('/routes', routeRoutes);
app.use('/buses', busRoutes);
app.use('/rules', routeDepartureRuleRoutes);
app.use('/route-stops', routeStopRoutes);
app.use('/departure-times', departureTimeRoutes);
app.use('/stops', stopRoutes);
app.use('/cities', cityRoutes);
app.use('/user-observes-city', userObservesCityRoutes);
app.use('/users', userRoutes);
app.use('/active-date-spans', activeDateSpanRoutes);
app.use('/departure-weekdays', departureWeekdayRoutes);
app.use('/recurring-holidays', recurringHolidayRoutes);
app.use('/inactive-datespans', inactiveDateSpanRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
