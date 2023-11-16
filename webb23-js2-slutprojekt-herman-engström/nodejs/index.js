import('node-fetch').then(fetchModule => {
  const fetch = fetchModule.default;

  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const fs = require('fs');
  const app = express();
  const port = 5000;

  app.use(cors());
  app.use(bodyParser.json());

  // Läser in produkter från shop.json
  let products = require('./shop.json');

  // GET-endpoint för att hämta alla produkter
  app.get('/api/products', (req, res) => {
    res.json(products);
  });

  // GET-endpoint för att söka efter produkter baserat på sökfras
  app.get('/api/products/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    res.json(filteredProducts);
  });

  // POST-endpoint för att uppdatera lagersaldo och spara ändringar i shop.json
  app.post('/api/update-stock', (req, res) => {
    const updatedProducts = req.body.updatedProducts;
    updatedProducts.forEach(updatedProduct => {
      const index = products.findIndex(product => product.id === updatedProduct.id);
      if (index !== -1) {
        products[index].stock = updatedProduct.stock;
      }
    });

    // Sparar de uppdaterade produkterna till shop.json
    fs.writeFileSync('./shop.json', JSON.stringify(products, null, 2));

    // Svarar med de uppdaterade produkterna
    res.json(products);
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
