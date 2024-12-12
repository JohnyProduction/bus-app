import React, { useState } from "react";
import "./AdminView.css"; // Import pliku CSS
import EditUser from "../../components/EditUser/EditUser";
import NewRoute from "../../components/AddNewRoute/NewRoute";

export default function AdminView() {
  const [activeComponent, setActiveComponent] = useState("EditUser");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "EditUser":
        return <EditUser />;
      case "NewRoute":
        return <NewRoute />;
      default:
        return <EditUser />;
    }
  };

  return (
    <div className="adminview_container">
      <h1 className="adminview_title">Panel Administratora</h1>
      <div className="adminview_buttons">
        <button
          className={activeComponent === "EditUser" ? "active" : ""}
          onClick={() => setActiveComponent("EditUser")}
        >
          Zarządzaj użytkownikami
        </button>
        <button
          className={activeComponent === "NewRoute" ? "active" : ""}
          onClick={() => setActiveComponent("NewRoute")}
        >
          Dodaj nową trasę
        </button>
      </div>
      <div className="adminview_form">
        {renderActiveComponent()}
      </div>
    </div>
  );
}