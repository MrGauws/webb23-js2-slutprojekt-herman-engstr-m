import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import CartPage from './CartPage';
import Navbar from './Navbar';

const ProductPage = ({
  cartItems,
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  updateStock,
  products,
  setProducts,
  filteredProducts,
  setFilteredProducts,
  showPopup,
  setShowPopup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // Hämta produkter från API när komponenten monteras
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [setProducts, setFilteredProducts]);

  useEffect(() => {
    // Sök och sortera produkter baserat på användarens val
    const searchAndSortProducts = () => {
      let result = [...products];

      // Filtrera produkter baserat på sökningen
      if (searchQuery) {
        result = result.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sortera produkter baserat på pris och ordning
      if (sortOrder === 'asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'desc') {
        result.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(result);
    };

    searchAndSortProducts();
  }, [searchQuery, sortOrder, products, setFilteredProducts]);

  return (
    <div>
      {/* Komponenten Navbar som visar navigationsmeny */}
      <Navbar setShowCart={setShowCart} cartItems={cartItems} />
      <div className="container">
        {/* Sökruta för att söka efter produkter */}
        <input
          type="text"
          placeholder="Sök efter produkt"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Dropdown för att välja sorteringsordning för pris */}
        <label>
          Sortera efter pris:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Stigande</option>
            <option value="desc">Fallande</option>
          </select>
        </label>

        {/* Visa antingen kundvagnen eller produktlistan baserat på användarens val */}
        {showCart ? (
          <CartPage
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            updateQuantity={updateQuantity}
            updateStock={updateStock}
            setShowCart={setShowCart}
          />
        ) : (
          <>
            <h1>Produktsida</h1>
            {/* Komponenten ProductList som visar en lista av produkter */}
            <ProductList products={filteredProducts} addToCart={addToCart} updateQuantity={updateQuantity} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
