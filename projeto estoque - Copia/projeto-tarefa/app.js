const express = require('express');
const fs = require('fs'); // Lib FileSystem - Nativa NodeJS
const path = require('path'); // Módulo para manipulação de caminhos de diretório
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

const readData = () => JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
const writeData = (data) => fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));

app.post('/api/produtos', (req, res) => {
    const products = readData();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    writeData(products);
    res.status(201).json(newProduct);
});

app.get('/api/produtos', (req, res) => {
    const products = readData();
    res.json(products);
});

app.put('/api/produtos/:id', (req, res) => {
    const products = readData();
    const index = products.findIndex(product => product.id === parseInt(req.params.id));
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        writeData(products);
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.delete('/api/produtos/:id', (req, res) => {
    let products = readData();
    const updatedProducts = products.filter(product => product.id !== parseInt(req.params.id));

    if (updatedProducts.length === products.length) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    writeData(updatedProducts);
    res.status(204).end();
});

app.get('/api/produtos/:id', (req, res) => {
    const products = readData();
    const product = products.find(product => product.id === parseInt(req.params.id));

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
