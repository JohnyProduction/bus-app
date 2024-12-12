import React, { useState, useEffect } from "react";
import { getUser } from "../../session";
import "./Observe.css";

export default function ObservedRoutesForm() {
  const [observedRoutes, setObservedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pobranie ulubionych tras użytkownika
  const fetchObservedRoutes = async () => {
    setLoading(true);
    setError("");

    try {
      const username = getUser().username;

      const response = await fetch(
        `http://localhost:3003/user/observed-routes?username=${username}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nieoczekiwany błąd serwera");
      }

      const data = await response.json();
      setObservedRoutes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Wyszukiwanie szczegółów trasy na podstawie wybranej trasy
  const fetchRouteConnections = async (route) => {
    setLoading(true);
    setError("");

    const today = new Date().toISOString().split("T")[0]; // Dzisiejsza data
    const searchParams = {
      startCity: route.departure_city,
      endCity: route.destination_city,
      departureDate: today,
      startTime: "00:00",
      endTime: "23:59",
    };

    const queryParams = new URLSearchParams(searchParams).toString();

    try {
      const response = await fetch(
        `http://localhost:3003/connections/search?${queryParams}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nieoczekiwany błąd serwera");
      }

      const data = await response.json();
      setConnections(data.connections || []);
      setSelectedRoute(route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservedRoutes();
  }, []);

  return (
    <div className="observed-routes-container">
      <h2 className="observed-routes-title">Twoje ulubione trasy</h2>
      {loading && <p className="observed-routes-loading">Ładowanie danych...</p>}
      {error && <p className="observed-routes-error">{error}</p>}
      <ul className="observed-routes-list">
        {observedRoutes.map((route, index) => (
          <li key={index} className="observed-routes-item">
            <button
              onClick={() => fetchRouteConnections(route)}
              className="observed-routes-button"
            >
              {route.departure_city} → {route.destination_city}
            </button>
          </li>
        ))}
      </ul>

      {selectedRoute && (
        <div className="selected-route-container">
          <h3 className="selected-route-title">Połączenia dla trasy:</h3>
          <p>
            <strong>{selectedRoute.departure_city}</strong> →{" "}
            <strong>{selectedRoute.destination_city}</strong>
          </p>

          <ul className="selected-route-connections">
            {connections.map((connection, index) => (
              <li key={index} className="selected-route-connection-item">
                <div>
                  <p>
                    <strong>Wyjazd:</strong> {connection.start_city},{" "}
                    {connection.start_route_stop_time}
                  </p>
                  <p>
                    <strong>Przyjazd:</strong> {connection.end_city},{" "}
                    {connection.end_route_stop_time}
                  </p>
                  <p>
                    <strong>Cena:</strong> {connection.journey_price} PLN
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {connections.length === 0 && !loading && (
            <p className="no-results">Brak dostępnych połączeń dla tej trasy.</p>
          )}
        </div>
      )}
    </div>
  );
}
