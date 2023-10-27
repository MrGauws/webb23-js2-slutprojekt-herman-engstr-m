import React from 'react';
import logo from '../../public/logo/logo.png';

const Navbar = ({ setShowCart, cartItems }) => {
  // Funktion för att räkna totalt antal varor i kundvagnen
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <nav>
      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>

      {/* Navigationslänkar */}
      <ul>
        <li>
          {/* Länk till produktsidan */}
          <a href="#" onClick={() => setShowCart(false)}>
            Produkter
          </a>
        </li>

        {/* Uppdaterad länk till kundvagnssidan med antal varor i kundvagnen */}
        <li>
          <a href="#" onClick={() => setShowCart(true)}>
            Kundvagnen ({calculateTotalItems()})
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;