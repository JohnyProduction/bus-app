const { DepartureRequestDto, DepartureResponseDto } = require('../dtos/departure-dto');

const departureEndpoints = (db) => {
    const fromToDeparture = async (req, res) => {
        const requestDto = new DepartureRequestDto(req.body);

        try {
            requestDto.validate();
        } catch (err) {
            throw err;
        }

        const sql = `
            WITH RECURSIVE route_path AS (
                -- Część początkowa: Start od przystanku start_stop_id
                SELECT 
                    rs.id AS route_stop_id,
                    rs.previous,
                    rs.next,
                    rs.stop_id,
                    rs.minutes_from_prev_route_stop,
                    rs.prize_from_prev_route_stop
                FROM route_stop rs
                WHERE rs.stop_id = ?  -- Startowy przystanek
            
                UNION ALL
            
                -- Rekursywna część: Szukamy kolejnych przystanków
                SELECT 
                    rs.id AS route_stop_id,
                    rs.previous,
                    rs.next,
                    rs.stop_id,
                    rs.minutes_from_prev_route_stop,
                    rs.prize_from_prev_route_stop
                FROM route_stop rs
                JOIN route_path rp ON rp.next = rs.id
                WHERE rs.stop_id != ?  -- Zapobiegamy cyklom w przypadku powrotu do tego samego przystanku
            )
            
            -- Zwrócenie wyników dla przystanku docelowego
            SELECT *
            FROM route_path
            WHERE stop_id = ?;  -- Przystanek docelowy
        `;

        db.run(`SELECT * FROM route;`, (err, data) => { console.log(data); });

        db.run(sql, [requestDto.from, requestDto.from, requestDto.to], (err, data) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            const departureResponseDto = new DepartureResponseDto(data);

            return res.status(200).json(departureResponseDto);
        });
    };

    return { fromToDeparture };
};

module.exports = { departureEndpoints };