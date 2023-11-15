import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import '../css/App.css';

// Komponent för sidan med kundvagnen
const CartPage = ({ cartItems, removeFromCart, clearCart, updateQuantity, updateStock, setShowCart, switchPage }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const popupRef = useRef(null);

  // Funktion för att hantera betalning
  const handlePayment = () => {
    clearCart();
    updateStock();
    setShowPopup(true);
    switchPage('products'); // Använd switchPage här
  };

  // Effekt för att sätta betalningssuccess när popup visas
  useEffect(() => {
    if (showPopup) {
      setPaymentSuccess(true);
    }
  }, [showPopup]);

  // Effekt för att dölja popup efter 3 sekunder
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowPopup(false);
      setPaymentSuccess(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showPopup]);

  return (
    <div>
      <h1>Kundvagn</h1>
      {cartItems && cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <ProductCard product={item} addToCart={() => {}} showAddToCartButton={false} />
              <div>
                <h2>{item.name}</h2>
                <p>Pris: {item.price} SEK</p>
                <label htmlFor={`quantity-${index}`}>Antal:</label>
                <select
                  id={`quantity-${index}`}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item, parseInt(e.target.value))}
                >
                  {[...Array(item.stock + 1).keys()].map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeFromCart(item)}>Ta bort</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p id="empty-cart-message">Kundvagnen är tom.</p>
      )}
      {cartItems && cartItems.length > 0 && (
        <div className="cart-total">
          <p>Totalt: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK</p>
          <div className="cart-buttons">
            <button onClick={handlePayment}>Betala</button>
            <button onClick={() => { clearCart(); setShowCart(false); switchPage('products'); }}>Töm kundvagn</button>
          </div>
        </div>
      )}
      {showPopup && paymentSuccess && (
        <div ref={popupRef} className="popup">
          <p>Tack för ditt köp, du kommer få en orderbekräftelse alldeles strax.</p>
        </div>
      )}

      {showPopup && !paymentSuccess && (
        <div ref={popupRef} className="popup">
          <p id="empty-cart-message">Kundvagnen är tom.</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
