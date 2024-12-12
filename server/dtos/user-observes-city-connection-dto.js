const { Dto } = require('./dto');

class ConnectionObservationDto extends Dto {
    constructor({ username,departure_city, destination_city }) {
        super();
        this.username = username;
        this.departure_city = departure_city;
        this.destination_city = destination_city;
    }

    validate() {
        if (!this.username) {
            throw new Error("Brak username");
        }
        if (!this.departure_city) {
            throw new Error("Brak departure_city");
        }

        if (!this.destination_city) {
            throw new Error('Brak destination_city');
        }
    }
}

module.exports = { ConnectionObservationDto };