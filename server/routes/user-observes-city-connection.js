const { ConnectionObservationDto } = require("../dtos/user-observes-city-connection-dto");

const userObservesCityConnectionEndpoints = (db) => {
    const observeCityConnection = async (req, res) => {
        const connectionObservationDto = new ConnectionObservationDto(req.body);

        try {
            connectionObservationDto.validate();
        } catch (err) {
            return res.status(400).send(err.message);
        }

        const { username, departure_city, destination_city } = connectionObservationDto; // Przyjmujemy nazwy miast
        
        // Zapytanie SQL do pobrania ID miast na podstawie ich nazw
        const getCityIdsSql = `
            SELECT 
                (SELECT id FROM city WHERE name = ?) AS departure_city_id,
                (SELECT id FROM city WHERE name = ?) AS destination_city_id
        `;

        db.get(getCityIdsSql, [departure_city, destination_city], (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching city IDs", error: err.message });
            }

            if (!row.departure_city_id || !row.destination_city_id) {
                return res.status(404).json({ message: "One or both cities not found" });
            }

            // Wstawienie danych do tabeli user_observes_city_connection
            const insertSql = `
                INSERT INTO user_observes_city_connection (username, departure_city_id, destination_city_id)
                VALUES (?, ?, ?);
            `;

            db.run(insertSql, [username, row.departure_city_id, row.destination_city_id], function (err) {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                res.status(200).json({ message: "Successfully made this connection as favourite one" });
            });
        });
    };

    const unobserveCityConnection = async (req, res) => {
        const connectionObservationDto = new ConnectionObservationDto(req.body);

        try {
            connectionObservationDto.validate();
        } catch (err) {
            return res.status(400).send(err.message);
        }

        const { username, departure_city, destination_city } = connectionObservationDto; // Przyjmujemy nazwy miast

        // Zapytanie SQL do pobrania ID miast na podstawie ich nazw
        const getCityIdsSql = `
            SELECT 
                (SELECT id FROM city WHERE name = ?) AS departure_city_id,
                (SELECT id FROM city WHERE name = ?) AS destination_city_id
        `;

        db.get(getCityIdsSql, [departure_city, destination_city], (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching city IDs", error: err.message });
            }

            if (!row.departure_city_id || !row.destination_city_id) {
                return res.status(404).json({ message: "One or both cities not found" });
            }

            // Usunięcie danych z tabeli user_observes_city_connection
            const deleteSql = `
                DELETE FROM user_observes_city_connection
                WHERE username = ? AND departure_city_id = ? AND destination_city_id = ?;
            `;

            db.run(deleteSql, [username, row.departure_city_id, row.destination_city_id], function (err) {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                res.status(200).json({ message: "Successfully removed this connection as favourite one" });
            });
        });
    };

    const getObservedRoutes = async (req, res) => {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Zapytanie SQL do pobrania ulubionych tras użytkownika
        const sql = `
            SELECT 
                c1.name AS departure_city,
                c2.name AS destination_city
            FROM user_observes_city_connection uocc
            JOIN city c1 ON uocc.departure_city_id = c1.id
            JOIN city c2 ON uocc.destination_city_id = c2.id
            WHERE uocc.username = ?;
        `;

        db.all(sql, [username], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching observed routes", error: err.message });
            }

            res.status(200).json(rows);
        });
    };

    return { observeCityConnection, unobserveCityConnection, getObservedRoutes };
};

module.exports = { userObservesCityConnectionEndpoints };
