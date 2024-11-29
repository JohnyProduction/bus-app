-- Szwagropol and Flixbus
-- Cities
INSERT INTO city (id, name) VALUES
(1, 'Kraków'),
(2, 'Myślenice'),
(3, 'Skomielna Biała'),
(4, 'Rabka Zdrój'),
(5, 'Nowy Targ'),
(6, 'Szaflary'),
(7, 'Bańska Niżna'),
(8, 'Biały Dunajec'),
(9, 'Poronin'),
(10, 'Zakopane');

-- Stops
INSERT INTO stop (id, city_id, name) VALUES
(1, 1, 'MDA'),
(2, 1, 'AGH/UR'),
(3, 1, 'Jubilat'),
(4, 1, 'Rondo Matecznego'),
(5, 1, 'Borek Fałęcki'),
(6, 2, 'Estakada'),
(7, 3, 'Skrzyżowanie'),
(8, 4, 'Rabka-Zabornia'),
(9, 5, 'Niwa I'),
(10, 5, 'Dworzec Autobusowy'),
(11, 6, 'Centrum'),
(12, 7, 'Termy'),
(13, 8, 'Kościół'),
(14, 8, 'Górny'),
(15, 9, 'PKP'),
(16, 10, 'Dworzec');

---------------------------------
-- Szwagropol
-- Carrier (Szwagropol)
INSERT INTO carrier (id, name) VALUES
(1, 'Szwagropol');

-- Route stops Kraków -> Zakopane Szwagropol (Szwagropol)
INSERT INTO route_stop (id, previous, next, stop_id, minutes_from_prev_route_stop, prize_from_prev_route_stop) VALUES
(1, NULL, 2, 1, 0, 0),           -- MDA
(2, 1, 3, 2, 5, 2),             -- AGH/UR
(3, 2, 4, 3, 5, 2),             -- Jubilat
(4, 3, 5, 4, 5, 2),             -- Rondo Matecznego
(5, 4, 6, 5, 5, 2),             -- Borek Fałęcki
(6, 5, 7, 6, 20, 8),            -- Estakada
(7, 6, 8, 7, 15, 6),            -- Skrzyżowanie
(8, 7, 9, 8, 15, 6),            -- Rabka-Zabornia
(9, 8, 10, 9, 10, 4),           -- Niwa I
(10, 9, 11, 10, 5, 2),          -- Dworzec Autobusowy
(11, 10, 12, 11, 10, 4),        -- Centrum
(12, 11, 13, 12, 5, 2),         -- Termy
(13, 12, 14, 13, 5, 2),         -- Kościół
(14, 13, 15, 14, 5, 2),         -- Górny
(15, 14, 16, 15, 5, 2),         -- PKP
(16, 15, NULL, 16, 5, 4);       -- Dworzec

-- Route stops Zakopane -> Kraków (Szwagropol)
INSERT INTO route_stop (id, previous, next, stop_id, minutes_from_prev_route_stop, prize_from_prev_route_stop) VALUES
(17, NULL, 18, 16, 0, 0),       -- Dworzec
(18, 17, 19, 15, 5, 2),         -- PKP
(19, 18, 20, 14, 5, 2),         -- Górny
(20, 19, 21, 13, 5, 2),         -- Kościół
(21, 20, 22, 12, 5, 2),         -- Termy
(22, 21, 23, 11, 10, 4),        -- Centrum
(23, 22, 24, 10, 5, 2),         -- Dworzec Autobusowy
(24, 23, 25, 9, 10, 4),         -- Niwa I
(25, 24, 26, 8, 20, 8),         -- Rabka-Zabornia
(26, 25, 27, 7, 15, 6),         -- Skrzyżowanie
(27, 26, 28, 6, 15, 6),         -- Estakada
(28, 27, 29, 5, 10, 4),         -- Borek Fałęcki
(29, 28, 30, 4, 10, 4),         -- Rondo Matecznego
(30, 29, 31, 3, 5, 2),          -- Jubilat
(31, 30, 32, 2, 5, 2),          -- AGH/UR
(32, 31, NULL, 1, 5, 2);        -- MDA

-- Routes (Szwagropol)
INSERT INTO route (id, carrier_id, begin_route_stop, end_route_stop) VALUES
(1, 1, 1, 16),    -- Kraków -> Zakopane
(2, 1, 17, 32);   -- Zakopane -> Kraków

-- Route departure rules (Szwagropol)
INSERT INTO route_departure_rule (id, route_id) VALUES
(1, 1),    -- Kraków -> Zakopane
(2, 2);    -- Zakopane -> Kraków

-- Recurring holidays (same for both rules)  (Szwagropol)
INSERT INTO recurring_holiday (id, date, route_departure_rule) VALUES
(1, '01-01', 1), (2, '01-06', 1), (3, '05-01', 1), (4, '05-03', 1),
(5, '08-15', 1), (6, '11-01', 1), (7, '11-11', 1), (8, '12-25', 1),
(9, '12-26', 1),
(10, '01-01', 2), (11, '01-06', 2), (12, '05-01', 2), (13, '05-03', 2),
(14, '08-15', 2), (15, '11-01', 2), (16, '11-11', 2), (17, '12-25', 2),
(18, '12-26', 2);

-- Active datespans  (Szwagropol)
INSERT INTO active_datespan (id, start_date, end_date, route_departure_rule_id) VALUES
(1, '2023-01-01', '2025-12-31', 1),
(2, '2023-01-01', '2025-12-31', 2);

-- Inactive datespans  (Szwagropol)
INSERT INTO inactive_datespan (id, start_date, end_date, route_departure_rule_id) VALUES
(1, '2023-12-26', '2023-12-31', 1),
(2, '2024-12-26', '2024-12-31', 1),
(3, '2025-12-26', '2025-12-31', 1),
(4, '2023-12-26', '2023-12-31', 2),
(5, '2024-12-26', '2024-12-31', 2),
(6, '2025-12-26', '2025-12-31', 2);

-- Departure weekdays (Monday to Friday for both rules) (Szwagropol)
INSERT INTO departure_weekday (id, weekday, route_departure_rule_id) VALUES
(1, 1, 1), (2, 2, 1), (3, 3, 1),
(4, 4, 1), (5, 5, 1),
(6, 1, 2), (7, 2, 2), (8, 3, 2),
(9, 4, 2), (10, 5, 2);

-- Departure times (Szwagropol)
INSERT INTO departure_time (id, hour_minute, route_departure_rule_id) VALUES
(1, '10:00', 1), (2, '13:30', 1), (3, '18:00', 1),
(4, '12:00', 2), (5, '15:00', 2), (6, '20:00', 2);

---------------------------------
-- FlixBus
-- Add FlixBus carrier
INSERT INTO carrier (id, name) VALUES
(2, 'FlixBus');

-- Route stops Kraków -> Zakopane (FlixBus)
INSERT INTO route_stop (id, previous, next, stop_id, minutes_from_prev_route_stop, prize_from_prev_route_stop) VALUES
(33, NULL, 34, 1, 0, 0),          -- MDA
(34, 33, 35, 2, 10, 10),          -- AGH/UR
(35, 34, 36, 3, 10, 10),          -- Jubilat
(36, 35, 37, 4, 10, 10),          -- Rondo Matecznego
(37, 36, 38, 5, 10, 10),          -- Borek Fałęcki
(38, 37, 39, 6, 10, 10),          -- Estakada
(39, 38, 40, 7, 10, 10),          -- Skrzyżowanie
(40, 39, 41, 8, 10, 10),          -- Rabka-Zabornia
(41, 40, 42, 9, 5, 5),            -- Niwa I
(42, 41, 43, 10, 5, 5),           -- Dworzec Autobusowy
(43, 42, 44, 11, 5, 5),           -- Centrum
(44, 43, 45, 12, 1, 1),           -- Termy
(45, 44, 46, 13, 1, 1),           -- Kościół
(46, 45, 47, 14, 1, 1),           -- Górny
(47, 46, 48, 15, 1, 1),           -- PKP
(48, 47, NULL, 16, 1, 1);         -- Dworzec

-- Route stops Zakopane -> Kraków (FlixBus)
INSERT INTO route_stop (id, previous, next, stop_id, minutes_from_prev_route_stop, prize_from_prev_route_stop) VALUES
(49, NULL, 50, 16, 0, 0),         -- Dworzec
(50, 49, 51, 15, 10, 10),         -- PKP
(51, 50, 52, 14, 10, 10),         -- Górny
(52, 51, 53, 13, 10, 10),         -- Kościół
(53, 52, 54, 12, 10, 10),         -- Termy
(54, 53, 55, 11, 10, 10),         -- Centrum
(55, 54, 56, 10, 10, 10),         -- Dworzec Autobusowy
(56, 55, 57, 9, 10, 10),          -- Niwa I
(57, 56, 58, 8, 10, 10),          -- Rabka-Zabornia
(58, 57, 59, 7, 5, 5),            -- Skrzyżowanie
(59, 58, 60, 6, 5, 5),            -- Estakada
(60, 59, 61, 5, 4, 4),            -- Borek Fałęcki
(61, 60, 62, 4, 2, 2),            -- Rondo Matecznego
(62, 61, 63, 3, 2, 2),            -- Jubilat
(63, 62, 64, 2, 1, 1),            -- AGH/UR
(64, 63, NULL, 1, 1, 1);          -- MDA

-- Routes
INSERT INTO route (id, carrier_id, begin_route_stop, end_route_stop) VALUES
(3, 2, 33, 48),    -- Kraków -> Zakopane (FlixBus)
(4, 2, 49, 64);    -- Zakopane -> Kraków (FlixBus)

-- Route departure rules
INSERT INTO route_departure_rule (id, route_id) VALUES
(3, 3),    -- Kraków -> Zakopane (FlixBus)
(4, 4);    -- Zakopane -> Kraków (FlixBus)

-- Recurring holidays (for both rules)
INSERT INTO recurring_holiday (id, date, route_departure_rule) VALUES
(19, '01-01', 3), (20, '01-06', 3), (21, '05-01', 3), (22, '05-03', 3),
(23, '08-15', 3), (24, '11-01', 3), (25, '11-11', 3), (26, '12-25', 3),
(27, '12-26', 3),
(28, '01-01', 4), (29, '01-06', 4), (30, '05-01', 4), (31, '05-03', 4),
(32, '08-15', 4), (33, '11-01', 4), (34, '11-11', 4), (35, '12-25', 4),
(36, '12-26', 4);

-- Active datespans (2024 only)
INSERT INTO active_datespan (id, start_date, end_date, route_departure_rule_id) VALUES
(3, '2024-01-01', '2024-12-31', 3),
(4, '2024-01-01', '2024-12-31', 4);

-- Inactive datespans (December 1-15 for both directions)
INSERT INTO inactive_datespan (id, start_date, end_date, route_departure_rule_id) VALUES
(7, '2024-12-01', '2024-12-15', 3),
(8, '2024-12-01', '2024-12-15', 4);

-- Departure weekdays (Wednesday to Sunday for both rules)
INSERT INTO departure_weekday (id, weekday, route_departure_rule_id) VALUES
(11, 3, 3), (12, 4, 3), (13, 5, 3), (14, 6, 3), (15, 7, 3),  -- Wed-Sun for Kraków -> Zakopane
(16, 3, 4), (17, 4, 4), (18, 5, 4), (19, 6, 4), (20, 7, 4);  -- Wed-Sun for Zakopane -> Kraków

-- Departure times
INSERT INTO departure_time (id, hour_minute, route_departure_rule_id) VALUES
(7, '05:00', 3), (8, '07:15', 3),    -- Kraków -> Zakopane
(9, '21:00', 4), (10, '22:00', 4);   -- Zakopane -> Kraków


---------------------------------
-- Users
INSERT INTO user (username, email, password_hash, role) VALUES
('admin', 'admin@example.com', 'hashed_password_here', 'admin'),
('user1', 'user1@example.com', 'hashed_password_here', 'user');

-- User observations
INSERT INTO user_observes_city_connection (id, username, departure_city_id, destination_city_id) VALUES
(1, 'user1', 5, 9);