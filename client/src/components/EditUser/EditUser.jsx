import React, { useState, useEffect } from "react";
import "./EditUser.css"
export default function EditUser() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    
    useEffect(() => {
        fetchData();
      }, []);
      function fetchData() {
    fetch("http://localhost:3003/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  }
  const handleDeleteUser = (email) => {
    const confirmDelete = window.confirm(
      `Czy na pewno chcesz usunąć użytkownika o emailu ${email}?`
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3003/user/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
  const handleChangeRole = () => {
    if (!selectedUser) {
      alert("Proszę wybrać użytkownika.");
      return;
    }

    const newRole = selectedUser.role === "admin" ? "user" : "admin";

    fetch("http://localhost:3003/user/role", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: selectedUser.email,
        newRole,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nie udało się zmienić roli użytkownika.");
        }
        fetchData();
        setSelectedUser(null);
      })
      .catch((error) => {
        console.error("Błąd podczas zmiany roli użytkownika:", error);
        setError("Nie udało się zmienić roli użytkownika.");
      });
  };
  return(<>
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
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="btn btn-warning btn-sm"
                      >
                        Zmień rolę
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {selectedUser && (
          <div className="role-change-form">
            <h3>Zmień rolę użytkownika: {selectedUser.username}</h3>
            <p>Aktualna rola: {selectedUser.role}</p>
            <button onClick={handleChangeRole} className="btn btn-primary">
              Zmień rolę na {selectedUser.role === "admin" ? "user" : "admin"}
            </button>
          </div>
        )}
        </>);
}