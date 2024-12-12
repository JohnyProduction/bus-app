import React, { useState, useEffect } from "react";
import "./Home.css";
import { isLoggedIn, getUser, getToken } from "../../session";

export default function Home() {
  const [connections, setConnections] = useState([]);
  const [searchParams, setSearchParams] = useState({
    startCity: "",
    endCity: "",
    departureDate: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const [message, setMessage] = useState("");

  // Funkcja do wyszukiwania połączeń
  const fetchConnections = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Konwertujemy parametry wyszukiwania na query string
      const queryParams = new URLSearchParams({
        ...searchParams,
      }).toString();

      // Wykonanie zapytania do API
      const response = await fetch(`http://localhost:3003/connections/search?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nieoczekiwany błąd serwera");
      }

      const data = await response.json();
      setConnections(data.connections || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obsługa zmiany w polach formularza
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa wysyłania formularza
  const handleSearch = (e) => {
    e.preventDefault();
    fetchConnections(1); // Zawsze zaczynamy od pierwszej strony
  };

const handleAddRoute = async () => {
    try {
      const response = await fetch("http://localhost:3003/user/observed-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUser().username,
          departure_city: searchParams.startCity,
          destination_city: searchParams.endCity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error adding the route");
      }

      setMessage("Route successfully added to favorites!");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };


  return (
    <div className="userview_box">
      <div className="userview_container">
        <h1 className="userview_title">Wyszukaj Połączenia Autobusowe</h1>
        <form onSubmit={handleSearch} className="userview_search-form">
          <input
            type="text"
            name="startCity"
            placeholder="Miasto początkowe"
            value={searchParams.startCity}
            onChange={handleInputChange}
            className="userview_search-input"
            required
          />
          <input
            type="text"
            name="endCity"
            placeholder="Miasto docelowe"
            value={searchParams.endCity}
            onChange={handleInputChange}
            className="userview_search-input"
            required
          />
          <input
            type="date"
            name="departureDate"
            value={searchParams.departureDate}
            onChange={handleInputChange}
            className="userview_search-input"
            required
          />
          <input
            type="time"
            name="startTime"
            placeholder="Od godziny"
            value={searchParams.startTime}
            onChange={handleInputChange}
            className="userview_search-input"
          />
          <input
            type="time"
            name="endTime"
            placeholder="Do godziny"
            value={searchParams.endTime}
            onChange={handleInputChange}
            className="userview_search-input"
          />
          <button type="submit" className="userview_search-button">
            Wyszukaj
          </button>
          {isLoggedIn() ? (
                  <button
                    className="userview_search-button"
                    onClick={() => handleAddRoute()}
                  >
                    Dodaj do ulubionych
                  </button>
                ):(<></>)}
        </form>

        {/* Komunikaty */}
        {loading && <p className="userview_loading">Ładowanie połączeń...</p>}
        {error && <p className="userview_error">{error}</p>}
        {success && <p className="userview_success">{success}</p>}

        {/* Lista połączeń */}
        <ul className="userview_bus-list">
          {connections.map((connection) => (
            <li key={connection.id} className="userview_bus-item">
              <div className="userview_bus-details">
                <div className="userview_bus-header">
                  <span className="userview_bus-carrier">{connection.carrier_name}</span>
                  <span className="userview_bus-price">{connection.journey_price} PLN</span>
                </div>
                <div className="userview_bus-section">
                  <h4>Wyjazd</h4>
                  <p><strong>Miasto:</strong> {connection.start_city}</p>
                  <p><strong>Przystanek:</strong> {connection.start_stop}</p>
                  <p><strong>Godzina:</strong> {connection.start_route_stop_time}</p>
                </div>
                <div className="userview_bus-section">
                  <h4>Przyjazd</h4>
                  <p><strong>Miasto:</strong> {connection.end_city}</p>
                  <p><strong>Przystanek:</strong> {connection.end_stop}</p>
                  <p><strong>Godzina:</strong> {connection.end_route_stop_time}</p>
                </div>
                <p><strong>Odjazd za:</strong> {connection.time_until_departure}</p>
                
              </div>
            </li>
          ))}
        </ul>

        {/* Brak wyników */}
        {!loading && connections.length === 0 && !error && (
          <p className="userview_no-results">Brak połączeń do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
}
