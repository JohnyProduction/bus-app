const { Dto } = require('./dto');

class ConnectionObservationDto extends Dto {
    constructor({ departure_city_id, destination_city_id }) {
        super();

        this.departure_city_id = departure_city_id;
        this.destination_city_id = destination_city_id;
    }

    validate() {
        if (!this.departure_city_id) {
            throw new Error("Brak departure_city_id");
        }

        if (!this.destination_city_id) {
            throw new Error('Brak destination_city_id');
        }
    }
}

module.exports = { ConnectionObservationDto };