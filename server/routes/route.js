const {CreateRouteDto} = require("../dtos/route-dto");
const {UserDto} = require("../dtos/user-dto");
const routeEndpoints = (db) => {
    const getFilteredRoutesByCarrier = (req, res) => {
        const { carrierId } = req.params;
        let sql = 'SELECT * FROM route';

        if (carrierId) {
            // To avoid SQL Injection, used Number casting
            sql += ` WHERE carrier_id = ${Number(carrierId)}%`;
        }

        db.get(sql, [], (err, routes) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            res.status(200).json({ routes: routes ?? [] });
        });
    };

    const newRoute = (req, res) => {
        const newRoute = req.body;
        const dto = new CreateRouteDto(newRoute);

        try {
            dto.validate();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }

        const sql = `INSERT INTO route (carrier_id, begin_route_stop, end_route_stop) VALUES (?, ?, ?)`;

        db.run(sql, [newRoute.carrier_id, newRoute.begin_route_stop, newRoute.end_route_stop], function(err, route) {
            if (err) {
                return res.status(400).send(err.message);
            }

            return res.status(201).json(route);
        });
    };

    const replaceRoute = (req, res) => {};

    const updateRoute = (req, res) => {};

    const deleteRoute = (req, res) => {};

    return { getFilteredRoutesByCarrier, newRoute, replaceRoute, updateRoute, deleteRoute };
};

module.exports = { routeEndpoints };