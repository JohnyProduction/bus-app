import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminView.css";

export default function AdminView() {
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({ time: "", destination: "", type: "" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Weryfikacja uprawnień użytkownika
    const sessionStr = localStorage.getItem("session");
    if (!sessionStr) {
      navigate("/unauthorized");
      return;
    }

    const session = JSON.parse(sessionStr);
    const user = session?.user;
    const token = session?.token;

    if (!user || user.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    console.log("Token przed wysłaniem żądania:", token);

    // Pobieranie listy użytkowników
    fetch("http://localhost:3003/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nie udało się pobrać listy użytkowników.");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Błąd podczas pobierania użytkowników:", error);
        setError("Nie udało się pobrać listy użytkowników.");
      });
  }, [navigate]);

  const handleAddBus = () => {
    if (!newBus.time || !newBus.destination || !newBus.type) {
      setError("Proszę wypełnić wszystkie pola autobusów.");
      return;
    }

    setBuses([...buses, { ...newBus, id: Date.now() }]);
    setNewBus({ time: "", destination: "", type: "" });
    setError(null);
  };

  const handleDeleteUser = (email) => {
    const sessionStr = localStorage.getItem("session");
    if (!sessionStr) {
      navigate("/unauthorized");
      return;
    }

    const session = JSON.parse(sessionStr);
    const token = session?.token;

    const confirmDelete = window.confirm(
      `Czy na pewno chcesz usunąć użytkownika o emailu ${email}?`
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3003/user/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setUsers(users.filter((user) => user.email !== email));
        } else {
          throw new Error("Nie udało się usunąć użytkownika.");
        }
      })
      .catch((error) => {
        console.error("Błąd podczas usuwania użytkownika:", error);
        setError("Wystąpił problem podczas usuwania użytkownika.");
      });
  };

  const sessionStr = localStorage.getItem("session");
  const session = sessionStr ? JSON.parse(sessionStr) : null;
  const username = session?.user?.username || "Administrator";

  return (
    <div className="adminview_container">
      <h1 className="adminview_title">
        Panel Administratora - Witaj, {username}!
      </h1>

      {/* Sekcja zarządzania autobusami */}
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
        {error && <p className="adminview_error">{error}</p>}
      </div>

      <div className="adminview_list-container">
        <h2 className="adminview_subtitle">Lista autobusów</h2>
        {buses.length === 0 ? (
          <p>Brak dostępnych autobusów.</p>
        ) : (
          <ul className="adminview_bus-list">
            {buses.map((bus) => (
              <li key={bus.id} className="adminview_bus-item">
                <span className="adminview_bus-time">{bus.time}</span> -{" "}
                <span className="adminview_bus-destination">
                  {bus.destination}
                </span>{" "}
                (<span className="adminview_bus-type">{bus.type}</span>)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sekcja zarządzania użytkownikami */}
      <div className="adminview_list-container">
        <h2 className="adminview_subtitle">Lista użytkowników</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        {users.length === 0 ? (
          <p className="alert alert-info">Brak użytkowników do wyświetlenia.</p>
        ) : (
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Nazwa użytkownika</th>
                <th scope="col">Email</th>
                <th scope="col">Rola</th>
                <th scope="col">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="btn btn-danger btn-sm"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
