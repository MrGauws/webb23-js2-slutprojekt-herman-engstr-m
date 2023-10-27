import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import '../css/App.css';

const CartPage = ({ cartItems, removeFromCart, clearCart, updateQuantity, updateStock, setShowCart }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const popupRef = useRef(null);

  // Funktion för att hantera betalning och uppdatera lager
  const handlePayment = () => {
    clearCart();
    updateStock();
    setShowPopup(true);
  };

  useEffect(() => {
    // Uppdatera paymentSuccess när showPopup ändras
    if (showPopup) {
      setPaymentSuccess(true);
    }
  }, [showPopup]);

  useEffect(() => {
    // Ställ in en timeout för att stänga popup efter 3 sekunder
    const timeoutId = setTimeout(() => {
      setShowPopup(false);
      setPaymentSuccess(false);
    }, 3000);

    // Rensa timeout vid komponentavmontering
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
              {/* Använd ProductCard för att visa produkten i kundvagnen */}
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
        <p>Kundvagnen är tom.</p>
      )}
      {cartItems && cartItems.length > 0 && (
        <>
          <p>Totalt: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} SEK</p>
          <button onClick={handlePayment}>Betala</button>
        </>
      )}
      {showPopup && paymentSuccess && (
        <div ref={popupRef} className="popup">
          {/* Meddelande för framgångsrik betalning */}
          <p>Tack för ditt köp, du kommer få en orderbekräftelse alldeles strax.</p>
        </div>
      )}

      {showPopup && !paymentSuccess && (
        <div ref={popupRef} className="popup">
          {/* Meddelande när kundvagnen är tom */}
          <p>Kundvagnen är tom.</p>
        </div>
      )}

      {/* Knapp för att tömma kundvagnen */}
      <button onClick={() => { clearCart(); setShowCart(false); }}>Töm kundvagn</button>
    </div>
  );
};

export default CartPage;