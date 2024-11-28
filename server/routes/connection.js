const fs = require('fs').promises;
const path = require('path');
const { ConnectionSearchDto, ConnectionsResponseDto } = require('../dtos/connectionDto');

// Utility function to run SQL queries
const runQuery = (db, query, params) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const connectionEndpoints = (db) => {
    const search = async (req, res) => {
        try {
            console.log('Received search request:', req.query);

            // Validate input with DTO
            const searchDto = new ConnectionSearchDto({
                startCity: req.query.startCity,
                endCity: req.query.endCity,
                departureDate: req.query.departureDate,
                startTime: req.query.startTime,
                endTime: req.query.endTime
            });
            searchDto.validate();
            console.log('Search DTO validated:', searchDto);

            // First check if cities exist
            const citiesQuery = `SELECT id, name FROM city WHERE name IN (?, ?)`;
            const cities = await runQuery(db, citiesQuery, [searchDto.startCity, searchDto.endCity]);
            console.log('Found cities:', cities);

            if (cities.length !== 2) {
                return res.status(404).json({
                    error: 'Nie znaleziono jednego lub obu miast w bazie danych'
                });
            }

            // Load the main search query
            const searchQueryFile = await fs.readFile(
                path.join(__dirname, '../queries/search_connections.sql'),
                'utf-8'
            );

            // Run the main search query
            const connections = await runQuery(db, searchQueryFile, {
                ':start_city_name': searchDto.startCity,
                ':end_city_name': searchDto.endCity,
                ':departure_date': searchDto.departureDate,
                ':filter_start_time': searchDto.startTime,
                ':filter_end_time': searchDto.endTime
            });

            console.log(`Found ${connections.length} connections`);

            // If no connections found, let's check why
            if (connections.length === 0) {
                // Check route existence
                const routeCheck = await runQuery(db, `
                    SELECT DISTINCT r.id, c.name as carrier
                    FROM route r
                    JOIN carrier c ON r.carrier_id = c.id
                    JOIN route_stop rs_start ON r.begin_route_stop = rs_start.id
                    JOIN route_stop rs_end ON r.end_route_stop = rs_end.id
                    JOIN stop s_start ON rs_start.stop_id = s_start.id
                    JOIN stop s_end ON rs_end.stop_id = s_end.id
                    JOIN city c_start ON s_start.city_id = c_start.id
                    JOIN city c_end ON s_end.city_id = c_end.id
                    WHERE c_start.name = ? AND c_end.name = ?
                `, [searchDto.startCity, searchDto.endCity]);

                console.log('Route check results:', routeCheck);

                // Check date rules
                const dateCheck = await runQuery(db, `
                    SELECT 
                        rd.id,
                        EXISTS (
                            SELECT 1 FROM active_datespan ad 
                            WHERE ad.route_departure_rule_id = rd.id
                            AND ? BETWEEN ad.start_date AND ad.end_date
                        ) as is_active_date,
                        EXISTS (
                            SELECT 1 FROM departure_weekday dw 
                            WHERE dw.route_departure_rule_id = rd.id
                            AND dw.weekday = CAST(strftime('%w', ?) AS INTEGER) + 1
                        ) as is_valid_weekday
                    FROM route_departure_rule rd
                `, [searchDto.departureDate, searchDto.departureDate]);

                console.log('Date validation results:', dateCheck);
            }

            const responseDto = {
                totalConnections: connections.length,
                connections: connections
            };

            res.json(responseDto);

        } catch (error) {
            console.error('Error in connection search:', error);
            res.status(error.status || 500).json({
                error: error.message || 'Nieoczekiwany błąd serwera',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    };

    const searchAll = async (req, res) => {
        try {
            console.log('Received search request:', req.query);

            // Validate input with DTO
            const startCity = req.query;

            // First check if cities exist
            const citiesQuery = `SELECT id, name FROM city WHERE name IN (?)`;
            const cities = await runQuery(db, citiesQuery, [startCity]);

            // Load the main search query
            const searchQueryFile = await fs.readFile(
                path.join(__dirname, '../queries/search_connections.sql'),
                'utf-8'
            );

            // Run the main search query
            const connections = await runQuery(db, searchQueryFile, {
                ':start_city_name': startCity
            });

            console.log(`Found ${connections.length} connections`);

            const responseDto = {
                totalConnections: connections.length,
                connections: connections
            };

            res.json(responseDto);

        } catch (error) {
            console.error('Error in connection search:', error);
            res.status(error.status || 500).json({
                error: error.message || 'Nieoczekiwany błąd serwera',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    };

    return { search, searchAll };
};

module.exports = { connectionEndpoints };