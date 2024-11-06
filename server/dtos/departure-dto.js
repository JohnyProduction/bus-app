const { Dto } = require('./dto');

class DepartureRequestDto extends Dto {
    constructor({ from, to, fromDate, toDate }) {
        super();

        this.from = from;
        this.to = to;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
}

module.exports = { DepartureRequestDto };