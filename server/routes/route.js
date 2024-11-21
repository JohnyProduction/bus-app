const {CreateRouteDto, RouteDto} = require("../dtos/route-dto");

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

    const replaceRoute = (req, res) => {
        const route = req.body;
        const { id } = req.params;

        db.run(`SELECT COUNT(*) FROM route WHERE id = ${id}`, function(err, count) {
            if (err) {
                return res.status(400).send(err.message);
            }

            if (count === 0) {
                const { carrier_id, begin_route_stop, end_route_stop } = route;
                const sql = `INSERT INTO route (carrier_id, begin_route_stop, end_route_stop) VALUES (?, ?, ?)`;

                db.run(sql, [newRoute.carrier_id, newRoute.begin_route_stop, newRoute.end_route_stop], function(err, route) {
                    if (err) {
                        return res.status(400).send(err.message);
                    }

                    return res.status(201).json(route);
                });
            } else {
                const dto = new RouteDto(route);

                try {
                    dto.validate();
                } catch (e) {
                    res.status(400).json({ error: e.message });
                }

                const sql = `
                    UPDATE route 
                    SET
                        carrier_id = ${dto.carrier_id},
                        begin_route_stop = ${dto.begin_route_stop},
                        end_route_stop = ${dto.end_route_stop}
                    WHERE
                        id = ${dto.id};
                `;

                db.run(sql, [newRoute.carrier_id, newRoute.begin_route_stop, newRoute.end_route_stop], function(err, route) {
                    if (err) {
                        return res.status(400).send(err.message);
                    }

                    return res.status(201).json(route);
                });
            }
        });
    };

    const updateRoute = (req, res) => {
        const route = req.body;
        const { id } = req.params;

        db.run(`SELECT COUNT(*) FROM route WHERE id = ${id}`, function(err, count) {
            if (err) {
                return res.status(400).send(err.message);
            }

            if (count === 1) {
                const entries = Object.entries(route);
                const setQuery = entries.reduce((acc, curr) => acc + `, ${curr[0]} = ${curr[1]}`, '').slice(2);
                const sql = `UPDATE route SET ${setQuery} WHERE id = ${id}`;

                db.run(`SELECT COUNT(*) FROM route WHERE id = ${id}`, function(err, data) {
                    if (err) {
                        return res.status(400).send(err.message);
                    }

                    return res.send(200);
                });
            } else {
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
            }
        });
    };

    const deleteRoute = (req, res) => {
        const { id } = req.params;
        const sql = `DELETE route WHERE id = ${id};`;

        db.run(sql, function(err, data) {
            if (err) {
                return res.status(400).send(err.message);
            }

            return res.status(204).send();
        });
    };

    return { getFilteredRoutesByCarrier, newRoute, replaceRoute, updateRoute, deleteRoute };
};

module.exports = { routeEndpoints };