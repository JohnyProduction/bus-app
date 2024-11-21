const { Dto } = require('./dto');

class CreateRouteDto extends Dto {
    constructor({ carrier_id, begin_route_stop, end_route_stop }) {
        super();

        this.carrier_id = carrier_id;
        this.begin_route_stop = begin_route_stop;
        this.end_route_stop = end_route_stop;
    }

    validate() {
        if (!this.carrier_id) {
            throw new Error("Brak carrier_id");
        }

        if (!this.begin_route_stop) {
            throw new Error("Brak begin_route_stop");
        }

        if (!this.end_route_stop) {
            throw new Error("Brak end_route_stop");
        }
    }
}

module.exports = { CreateRouteDto };