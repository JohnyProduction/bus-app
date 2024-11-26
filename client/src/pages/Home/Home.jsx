import React, { useState, useEffect } from "react";
import "./Home.css";
export default function Home() {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setBuses([
      { id: 1, time: "10:00", destination: "Warszawa" },
      { id: 2, time: "11:30", destination: "Kraków" },
      { id: 3, time: "12:15", destination: "Poznań" },
    ]);
  }, []);

  const filteredBuses = buses.filter((bus) =>
    bus.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="userview_container">
      <h1 className="userview_title">Odjazdy autobusów</h1>
      <input
        type="text"
        placeholder="Wyszukaj miasto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="userview_search-input"
      />
      <ul className="userview_bus-list">
        {filteredBuses.map((bus) => (
          <li key={bus.id} className="userview_bus-item">
            <span className="userview_bus-time">{bus.time}</span> -
            <span className="userview_bus-destination">{bus.destination}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
