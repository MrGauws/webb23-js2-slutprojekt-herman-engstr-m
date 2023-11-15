import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ProductPage from './ProductPage';
import CartPage from './CartPage';

// Komponent för hela applikationen
const App = () => {
  // Tillstånd för varukorg, produkter och filtrerade produkter
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState('products');
  // Tillstånd för att visa eller dölja en popup
  const [showCart, setShowCart] = useState(false);

  // Funktion för att byta sida
  const switchPage = (page) => {
    setCurrentPage(page);
  };

  // Funktion för att lägga till produkt i varukorgen
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Uppdatera varukorgen om produkten redan finns
      const updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } : item
      );
      setCartItems(updatedCart);
    } else {
      // Lägg till produkt i varukorgen om den inte finns
      const updatedCart = [...cartItems, { ...product, quantity: 1 }];
      setCartItems(updatedCart);
    }
  };

  // Funktion för att ta bort produkt från varukorgen
  const removeFromCart = (itemToRemove) => {
    const updatedCart = cartItems.filter((item) => item !== itemToRemove);
    setCartItems(updatedCart);
  };

  // Funktion för att tömma varukorgen
  const clearCart = () => {
    setCartItems([]);
  };

  // Funktion för att uppdatera kvantitet av en produkt i varukorgen
  const updateQuantity = (product, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  // Funktion för att uppdatera lagerstatus och skicka data till servern
  const updateStock = async () => {
    try {
      // Uppdatera produkternas lagerstatus baserat på varukorgen
      const updatedProducts = cartItems.map((item) => {
        const product = products.find((p) => p.id === item.id);
        return { ...product, stock: product.stock - item.quantity };
      });

      // Skicka uppdaterad lagerstatus till servern
      const response = await fetch('http://localhost:5000/api/update-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedProducts }),
      });

      // Om serveranropet lyckades, uppdatera varukorgen och hämta nya produktdata
      if (response.ok) {
        clearCart();
        const fetchProductsResponse = await fetch('http://localhost:5000/api/products');
        const updatedProductsData = await fetchProductsResponse.json();
        setProducts(updatedProductsData);
        setFilteredProducts(updatedProductsData);
        setShowPopup(true);
      } else {
        // Vid fel, logga felmeddelande
        console.error('Failed to update stock');
      }
    } catch (error) {
      // Vid fel, logga felmeddelande
      console.error('Error updating stock:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Rendera komponenterna och skickar med nödvändig data och funktioner
  return (
    <div>
      <Navbar switchPage={switchPage} setShowCart={setShowCart} cartItems={cartItems} />
      <div className="container">
        {currentPage === 'products' ? (
          <ProductPage
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            updateQuantity={updateQuantity}
            updateStock={updateStock}
            products={products}
            setProducts={setProducts}
            filteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            calculateTotalPrice={calculateTotalPrice}
            switchPage={switchPage}
          />
        ) : (
            <CartPage
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              updateQuantity={updateQuantity}
              updateStock={updateStock}
              setShowCart={setShowCart}
              switchPage={switchPage}
          />
        )}
      </div>
    </div>
  );
};

export default App;
