import React, { useState } from "react";
import "./Home.css";

export default function Home() {
  const [connections, setConnections] = useState([]);
  const [searchParams, setSearchParams] = useState({
    startCity: "",
    endCity: "",
    departureDate: "",
    startTime: "",
    endTime: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funkcja do wyszukiwania połączeń
  const fetchConnections = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Konwertujemy parametry wyszukiwania na query string
      const queryParams = new URLSearchParams({
        ...searchParams,
        page,
        limit: 10, // Liczba wyników na stronę
      }).toString();

      // Wykonanie zapytania do API
      const response = await fetch(`http://localhost:3003/connections/search?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nieoczekiwany błąd serwera");
      }

      const data = await response.json();
      setConnections(data.connections || []);
      setTotalPages(3);
      setCurrentPage(page);
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

  // Obsługa zmiany stron
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchConnections(newPage);
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
      </form>

      {/* Komunikaty */}
      {loading && <p className="userview_loading">Ładowanie połączeń...</p>}
      {error && <p className="userview_error">{error}</p>}

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

      {/* Paginacja */}
      {totalPages > 1 && (
        <div className="userview_pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="userview_pagination-button"
            disabled={currentPage === 1}
          >
            Poprzednia
          </button>
          <span className="userview_pagination-info">
            Strona {currentPage} z {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="userview_pagination-button"
            disabled={currentPage === totalPages}
          >
            Następna
          </button>
        </div>
      )}
    </div>
    </div>
  );
}
