DROP TABLE IF EXISTS user_observes_city_connection;
DROP TABLE IF EXISTS departure_time;
DROP TABLE IF EXISTS departure_weekday;
DROP TABLE IF EXISTS recurring_holiday;
DROP TABLE IF EXISTS inactive_datespan;
DROP TABLE IF EXISTS active_datespan;
DROP TABLE IF EXISTS route_departure_rule;
DROP TABLE IF EXISTS route_stop;
DROP TABLE IF EXISTS route;
DROP TABLE IF EXISTS stop;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS carrier;
DROP TABLE IF EXISTS user;

CREATE TABLE carrier (
  id INTEGER PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE route (
  id INTEGER PRIMARY KEY NOT NULL,
  carrier_id INTEGER NOT NULL,
  begin_route_stop INTEGER NOT NULL,
  end_route_stop INTEGER NOT NULL,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id),
  FOREIGN KEY (begin_route_stop) REFERENCES route_stop(id),
  FOREIGN KEY (end_route_stop) REFERENCES route_stop(id)
);

CREATE TABLE route_stop (
  id INTEGER PRIMARY KEY,
  previous INTEGER,
  next INTEGER,
  stop_id INTEGER NOT NULL,
  minutes_from_prev_route_stop INTEGER,
  prize_from_prev_route_stop REAL,
  FOREIGN KEY (previous) REFERENCES route_stop(id),
  FOREIGN KEY (next) REFERENCES route_stop(id),
  FOREIGN KEY (stop_id) REFERENCES stop(id)
);

CREATE TABLE stop (
  id INTEGER PRIMARY KEY NOT NULL,
  city_id INTEGER NOT NULL,
  name VARCHAR NOT NULL,
  FOREIGN KEY (city_id) REFERENCES city(id)
);

CREATE TABLE city (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE route_departure_rule (
  id INTEGER PRIMARY KEY,
  route_id INTEGER NOT NULL,
  FOREIGN KEY (route_id) REFERENCES route(id)
);

CREATE TABLE active_datespan (
  id INTEGER PRIMARY KEY,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  route_departure_rule_id INTEGER,
  FOREIGN KEY (route_departure_rule_id) REFERENCES route_departure_rule(id)
);

CREATE TABLE inactive_datespan (
  id INTEGER PRIMARY KEY,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  route_departure_rule_id INTEGER,
  FOREIGN KEY (route_departure_rule_id) REFERENCES route_departure_rule(id)
);

CREATE TABLE recurring_holiday (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  route_departure_rule INTEGER NOT NULL,
  FOREIGN KEY (route_departure_rule) REFERENCES route_departure_rule(id)
);

CREATE TABLE departure_weekday (
  id INTEGER PRIMARY KEY,
  weekday INTEGER NOT NULL, -- CHANGED TO %u day of week 1-7 with Monday==1
  route_departure_rule_id INTEGER NOT NULL,
  FOREIGN KEY (route_departure_rule_id) REFERENCES route_departure_rule(id)
);

CREATE TABLE departure_time (
  id INTEGER PRIMARY KEY,
  hour_minute TEXT NOT NULL,
  route_departure_rule_id INTEGER NOT NULL,
  FOREIGN KEY (route_departure_rule_id) REFERENCES route_departure_rule(id)
);

CREATE TABLE user (
  username TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin'))
);

CREATE TABLE user_observes_city_connection (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  departure_city_id INTEGER NOT NULL, -- CHANGED as it didnt point at PK
  destination_city_id INTEGER NOT NULL, -- CHANGED as it didnt point at PK
  FOREIGN KEY (username) REFERENCES user(username),
  FOREIGN KEY (departure_city_id) REFERENCES city(id),    
  FOREIGN KEY (destination_city_id) REFERENCES city(id)
);
