import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';

// Produktsidan
const ProductPage = ({ switchPage, addToCart, updateQuantity, products, setProducts, filteredProducts, setFilteredProducts }) => {
  // Deklarerar sökfrågan och sorteringsordning
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Hämtar produkter från API:et
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

    // Anropa funktionen för att hämta produkter när komponenten monteras
    fetchProducts();
  }, [setProducts, setFilteredProducts]);

  useEffect(() => {
    // Sök och sortera produkter när sökfrågan eller sorteringsordningen ändras
    const searchAndSortProducts = () => {
      let result = [...products];

      // Filtrerar produkter baserat på sökfrågan
      if (searchQuery) {
        result = result.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Sorterar produkter baserat på sorteringsordningen
      if (sortOrder === 'asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'desc') {
        result.sort((a, b) => b.price - a.price);
      }

      // Uppdaterar filtrerade produkter
      setFilteredProducts(result);
    };

    // Anropar funktionen för att söka och sortera produkter
    searchAndSortProducts();
  }, [searchQuery, sortOrder, products, setFilteredProducts]);

  return (
    <div>
      <div className="container">
        {/* Sökinput */}
        <input
          type="text"
          placeholder="Sök efter produkt"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Sorteringsalternativ */}
        <label>
          Sortera efter pris:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Stigande</option>
            <option value="desc">Fallande</option>
          </select>
        </label>
        {/* Rubrik */}
        <h1>Produktsida</h1>
        {/* Lista över produkter */}
        <ProductList products={filteredProducts} addToCart={addToCart} updateQuantity={updateQuantity} />
      </div>
    </div>
  );
};

// Exportera komponenten
export default ProductPage;
