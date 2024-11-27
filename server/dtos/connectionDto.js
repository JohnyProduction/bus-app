const { Dto } = require('./dto');

class ConnectionSearchDto extends Dto {
    constructor({ startCity, endCity, departureDate, startTime, endTime }) {
        super();
        this.startCity = startCity;
        this.endCity = endCity;
        this.departureDate = departureDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    validate() {
        if (!this.startCity || typeof this.startCity !== 'string') {
            throw new Error('Niepoprawne miasto początkowe');
        }

        if (!this.endCity || typeof this.endCity !== 'string') {
            throw new Error('Niepoprawne miasto docelowe');
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!this.departureDate || !dateRegex.test(this.departureDate)) {
            throw new Error('Niepoprawny format daty (YYYY-MM-DD)');
        }

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!this.startTime || !timeRegex.test(this.startTime)) {
            throw new Error('Niepoprawny format czasu początkowego (HH:mm)');
        }

        if (!this.endTime || !timeRegex.test(this.endTime)) {
            throw new Error('Niepoprawny format czasu końcowego (HH:mm)');
        }
    }
}

class ConnectionDto extends Dto {
    constructor({ carrier_name, start_city, start_stop, end_city, end_stop, 
                 departure_date, start_route_stop_time, end_route_stop_time, 
                 journey_price, time_until_departure }) {
        super();
        this.carrier = carrier_name;
        this.departure = {
            city: start_city,
            stop: start_stop,
            date: departure_date,
            time: start_route_stop_time
        };
        this.arrival = {
            city: end_city,
            stop: end_stop,
            time: end_route_stop_time
        };
        this.price = journey_price;
        this.timeUntilDeparture = time_until_departure;
    }

    validate() {
        if (!this.carrier) {
            throw new Error('Brak przewoźnika');
        }

        if (!this.departure.city || !this.departure.stop || 
            !this.departure.date || !this.departure.time) {
            throw new Error('Niepełne dane odjazdu');
        }

        if (!this.arrival.city || !this.arrival.stop || !this.arrival.time) {
            throw new Error('Niepełne dane przyjazdu');
        }

        if (typeof this.price !== 'number') {
            throw new Error('Niepoprawna cena');
        }
    }
}

class ConnectionsResponseDto extends Dto {
    constructor(connections) {
        super();
        this.totalConnections = connections.length;
        this.connections = connections.map(conn => new ConnectionDto(conn));
    }

    validate() {
        if (typeof this.totalConnections !== 'number') {
            throw new Error('Niepoprawna liczba połączeń');
        }

        try {
            this.connections.forEach(connection => connection.validate());
        } catch (err) {
            throw new Error(`Błąd walidacji połączenia: ${err.message}`);
        }
    }
}

module.exports = { ConnectionSearchDto, ConnectionDto, ConnectionsResponseDto };