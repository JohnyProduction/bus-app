-- Save this as queries/search_connections.sql
WITH RECURSIVE route_path AS (
    -- Base case: start from the beginning route stop
    SELECT
        rs.id,
        r.id as route_id,
        rs.next,
        rs.minutes_from_prev_route_stop,
        rs.minutes_from_prev_route_stop as total_minutes,
        rs.prize_from_prev_route_stop as total_prize,
        s.name as stop_name,
        s.city_id,
        c.name as city_name,
        carr.name as carrier_name,
        rdr.id as route_departure_rule_id
    FROM route_stop rs
    JOIN route r ON r.begin_route_stop = rs.id
    JOIN stop s ON rs.stop_id = s.id
    JOIN city c ON s.city_id = c.id
    JOIN carrier carr ON r.carrier_id = carr.id
    JOIN route_departure_rule rdr ON r.id = rdr.route_id

    UNION ALL

    -- Recursive case: follow the path through next route stops
    SELECT
        rs.id,
        rp.route_id,
        rs.next,
        rs.minutes_from_prev_route_stop,
        rp.total_minutes + rs.minutes_from_prev_route_stop,
        rp.total_prize + rs.prize_from_prev_route_stop,
        s.name as stop_name,
        s.city_id,
        c.name as city_name,
        rp.carrier_name,
        rp.route_departure_rule_id
    FROM route_stop rs
    JOIN route_path rp ON rp.next = rs.id
    JOIN stop s ON rs.stop_id = s.id
    JOIN city c ON s.city_id = c.id
),
departure_times_expanded AS (
    SELECT 
        dt.hour_minute,
        rdr.route_id,
        dt.route_departure_rule_id,
        CAST(substr(dt.hour_minute, 1, 2) AS INTEGER) as departure_hour,
        CAST(substr(dt.hour_minute, 4, 2) AS INTEGER) as departure_minute
    FROM departure_time dt
    JOIN route_departure_rule rdr ON dt.route_departure_rule_id = rdr.id
),
date_validation AS (
    SELECT DISTINCT 
        rdr.id as route_departure_rule_id,
        EXISTS (
            SELECT 1 
            FROM active_datespan ad 
            WHERE ad.route_departure_rule_id = rdr.id
            AND :departure_date BETWEEN ad.start_date AND ad.end_date
        ) as is_active_date,
        
        NOT EXISTS (
            SELECT 1 
            FROM inactive_datespan id 
            WHERE id.route_departure_rule_id = rdr.id
            AND :departure_date BETWEEN id.start_date AND id.end_date
        ) as is_not_inactive_date,
        
        EXISTS (
            SELECT 1 
            FROM departure_weekday dw 
            WHERE dw.route_departure_rule_id = rdr.id
            AND dw.weekday = CAST(strftime('%w', :departure_date) AS INTEGER) + 1
        ) as is_valid_weekday,
        
        NOT EXISTS (
            SELECT 1 
            FROM recurring_holiday rh 
            WHERE rh.route_departure_rule = rdr.id
            AND rh.date = strftime('%m-%d', :departure_date)
        ) as is_not_holiday
    FROM route_departure_rule rdr
),
available_connections AS (
    SELECT 
        rp_start.route_id,
        rp_start.id as start_route_stop_id,
        rp_start.city_id as start_city_id,
        rp_start.city_name as start_city,
        rp_start.stop_name as start_stop,
        rp_end.id as end_route_stop_id,
        rp_end.city_id as end_city_id,
        rp_end.city_name as end_city,
        rp_end.stop_name as end_stop,
        rp_start.carrier_name,
        dt.hour_minute as route_start_time,
        :departure_date as departure_date,
        time(
            dt.hour_minute, 
            '+' || rp_start.total_minutes || ' minutes'
        ) as start_route_stop_time,
        time(
            dt.hour_minute, 
            '+' || rp_end.total_minutes || ' minutes'
        ) as end_route_stop_time,
        rp_start.total_minutes as route_begin_to_start_route_stop_time,
        rp_end.total_minutes - rp_start.total_minutes as journey_time_minutes,
        rp_end.total_prize - rp_start.total_prize as journey_price,
        time('00:00', '+' || (rp_end.total_minutes - rp_start.total_minutes) || ' minutes') as journey_time,
        CAST(
            (julianday(:departure_date || ' ' || time(dt.hour_minute, '+' || rp_start.total_minutes || ' minutes')) 
             - julianday('now', 'localtime')) * 24 * 60 AS INTEGER
        ) as minutes_until_departure
    FROM route_path rp_start
    JOIN route_path rp_end ON 
        rp_end.route_id = rp_start.route_id AND 
        rp_end.total_minutes > rp_start.total_minutes
    JOIN departure_times_expanded dt ON dt.route_departure_rule_id = rp_start.route_departure_rule_id
    JOIN date_validation dv ON 
        dv.route_departure_rule_id = rp_start.route_departure_rule_id
        AND dv.is_active_date 
        AND dv.is_not_inactive_date
        AND dv.is_valid_weekday
        AND dv.is_not_holiday
)
SELECT
    carrier_name,
    start_city,
    start_stop,
    end_city,
    end_stop,
    departure_date,
    start_route_stop_time,
    end_route_stop_time,
    journey_price,
    CASE 
        WHEN minutes_until_departure < 0 THEN 'Departed'
        ELSE 
            CASE
                WHEN minutes_until_departure >= 1440 
                    THEN (minutes_until_departure / 1440) || ' days ' ||
                         ((minutes_until_departure % 1440) / 60) || ' hours ' ||
                         (minutes_until_departure % 60) || ' minutes'
                WHEN minutes_until_departure >= 60 
                    THEN (minutes_until_departure / 60) || ' hours ' ||
                         (minutes_until_departure % 60) || ' minutes'
                ELSE minutes_until_departure || ' minutes'
            END
    END as time_until_departure
FROM available_connections
WHERE start_city = :start_city_name 
AND end_city = :end_city_name
AND start_route_stop_time BETWEEN :filter_start_time AND :filter_end_time
ORDER BY 
    departure_date,
    start_route_stop_time,
    journey_time_minutes;