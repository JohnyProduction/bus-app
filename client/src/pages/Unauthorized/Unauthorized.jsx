import React from 'react';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="icon-wrapper">
        <svg className="lock-icon" viewBox="0 0 24 24">
          {/* Ikona kłódki w formacie SVG */}
          <path d="M12 17a2 2 0 110-4 2 2 0 010 4zm6-8h-1V7a5 5 0 00-10 0v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2zm-6 0H8V7a4 4 0 018 0v2z" />
        </svg>
      </div>
      <h1>Brak dostępu</h1>
      <p>
        Nie masz uprawnień do wyświetlenia tej strony. Skontaktuj się z administratorem w celu uzyskania dostępu.
      </p>
    </div>
  );
};

export default Unauthorized;
