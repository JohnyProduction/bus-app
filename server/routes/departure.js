const { DepartureRequestDto } = require('../dtos/departure-dto');

const departureEndpoints = (db) => {
    const fromToDeparture = async (req, res) => {
        const requestDto = new DepartureRequestDto(req.body);

        const sql = `SELECT * FROM route;`;

        db.run(sql, (err, data) => {
            console.log(data);
        });
    };

    return { fromToDeparture };
};

module.exports = { departureEndpoints };