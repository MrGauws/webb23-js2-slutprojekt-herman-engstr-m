import React from 'react';
import rolex1 from '../../public/products/rolex1.jpg';
import rolex2 from '../../public/products/rolex2.jpg';
import rolex3 from '../../public/products/rolex3.jpg';
import rolex4 from '../../public/products/rolex4.jpg';
import rolex5 from '../../public/products/rolex5.jpg';
import rolex6 from '../../public/products/rolex6.jpg';

// Kartläggning mellan filnamn och bildkomponenter
const imageMap = {
  'rolex1.jpg': rolex1,
  'rolex2.jpg': rolex2,
  'rolex3.jpg': rolex3,
  'rolex4.jpg': rolex4,
  'rolex5.jpg': rolex5,
  'rolex6.jpg': rolex6,
};

const ProductCard = ({ product, addToCart, showAddToCartButton = true }) => {
  const { name, price, stock, image } = product;

  // Extrahera filnamnet från sökvägen
  const imageName = image.split('/').pop();

  // Välj rätt bild baserat på filnamnet eller använd defaultbilden
  const selectedImage = imageMap[imageName] || rolex6;

  return (
    <div className="product-card">
      {/* Produktbild */}
      <img src={selectedImage} alt={name} />
      {/* Produktinformation */}
      <h2>{name}</h2>
      <p>Pris: {price.toLocaleString('sv-SE')} SEK</p>
      <p>Lagersaldo: {stock}</p>
      {/* Lägg till i kundvagn-knapp */}
      {showAddToCartButton && (
        <button disabled={stock === 0} onClick={() => addToCart(product)}>
          Lägg till i kundvagn
        </button>
      )}
    </div>
  );
}

export default ProductCard;
