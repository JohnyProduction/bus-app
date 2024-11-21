const routeEndpoints = (db) => {
    const getFilteredRoutesByCarrier = (req, res) => {
        const { carrierId } = req.params;
        let sql = 'SELECT * FROM route';

        if (carrierId) {
            // To avoid SQL Injection, used Number casting
            sql += ` WHERE carrierId = ${Number(carrierId)}%`;
        }

        db.get(sql, [], (err, routes) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            res.status(200).json({ routes: routes ?? [] });
        });
    };

    return { getFilteredRoutesByCarrier };
};

module.exports = { routeEndpoints };