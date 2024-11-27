const {ConnectionObservationDto} = require("../dtos/user-observes-city-connection-dto");
const {UserDto} = require("../dtos/user-dto");

const userObservesCityConnectionEndpoints = (db) => {
    const observeCityConnection = async (req, res) => {
        const connectionObservationDto = new ConnectionObservationDto(req.body);

        try {
            connectionObservationDto.validate();
        } catch (err) {
            return res.status(400).send(err.message);
        }

        const { departure_city_id, destination_city_id } = connectionObservationDto;
        const { user } = req.user;
        const sql = `
            INSERT INTO
                user_observes_city_connection (username, departure_city, destination_city)
                VALUES (?, ?, ?);`;

        db.run(sql, [user.username, departure_city_id, destination_city_id], function(err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            try {
                return res.status(200).json({ message: 'Successfully made this connection as favourite one'});
            } catch(err) {
                return res.status(400).json({ message: err.message });
            }
        });
    };

    const unobserveCityConnection = async (req, res) => {
        const connectionObservationDto = new ConnectionObservationDto(req.body);

        try {
            connectionObservationDto.validate();
        } catch (err) {
            return res.status(400).send(err.message);
        }

        const { departure_city_id, destination_city_id } = connectionObservationDto;
        const { user } = req.user;
        const sql = `
            DELETE
                FROM user_observes_city_connection
                WHERE username = ? AND departure_city = ? AND destination_city = ?
        `;

        db.run(sql, [user.username, departure_city_id, destination_city_id], function(err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            try {
                return res.status(200).json({ message: 'Successfully removed this connection as favourite one'});
            } catch(err) {
                return res.status(400).json({ message: err.message });
            }
        });
    };

    return { observeCityConnection, unobserveCityConnection };
};

module.exports = { userObservesCityConnectionEndpoints };