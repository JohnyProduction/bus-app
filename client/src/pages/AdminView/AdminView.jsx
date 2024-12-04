import React, { useState } from "react";
import "./AdminView.css"; // Import pliku CSS

export default function AdminView() {
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({ time: "", destination: "", type: "" });

  const handleAddBus = () => {
    setBuses([...buses, { ...newBus, id: Date.now() }]);
    setNewBus({ time: "", destination: "", type: "" });
  };

  return (
    <div className="adminview_container">
      <h1 className="adminview_title">Panel Administratora</h1>

      <div className="adminview_form">
        <h2 className="adminview_subtitle">Dodaj autobus</h2>
        <input
          type="text"
          placeholder="Godzina"
          value={newBus.time}
          onChange={(e) => setNewBus({ ...newBus, time: e.target.value })}
          className="adminview_input"
        />
        <input
          type="text"
          placeholder="Miasto docelowe"
          value={newBus.destination}
          onChange={(e) =>
            setNewBus({ ...newBus, destination: e.target.value })
          }
          className="adminview_input"
        />
        <input
          type="text"
          placeholder="Typ kursu"
          value={newBus.type}
          onChange={(e) => setNewBus({ ...newBus, type: e.target.value })}
          className="adminview_input"
        />
        <button onClick={handleAddBus} className="adminview_button">
          Dodaj
        </button>
      </div>

      <div className="adminview_list-container">
        <h2 className="adminview_subtitle">Lista autobusów</h2>
        <ul className="adminview_bus-list">
          {buses.map((bus) => (
            <li key={bus.id} className="adminview_bus-item">
              <span className="adminview_bus-time">{bus.time}</span> -
              <span className="adminview_bus-destination">
                {bus.destination}
              </span>
              (<span className="adminview_bus-type">{bus.type}</span>)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
