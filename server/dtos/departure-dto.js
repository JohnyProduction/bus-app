const { Dto } = require('./dto');

class DepartureRequestDto extends Dto {
    constructor({ from, to }) {
        super();

        this.from = from;
        this.to = to;
    }

    validate() {
        if (!this.from) {
            throw new Error('Brak przystanku początkowego');
        }

        if (!this.to) {
            throw new Error('Brak docelowego przystanku');
        }
    }
}

class DepartureResponseDto extends Dto {
    constructor(data) {
        super();

        this.data = data;
    }
}

module.exports = { DepartureRequestDto, DepartureResponseDto };