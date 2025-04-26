const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'burger_fast'
});

// Conexão ao banco
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

// Configuração do upload de imagens
const upload = multer({ dest: 'uploads/' });

// Rota para listar produtos
app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Rota para adicionar um produto
app.post('/api/produtos', upload.single('imagem'), (req, res) => {
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO produtos (nome, descricao, preco, imagem, estoque, categoria) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, descricao, preco, imagem, estoque, categoria], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Produto adicionado com sucesso!');
    });
});


// Rota para editar um produto
app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, categoria } = req.body;

    const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria = ? WHERE id = ?';
    db.query(sql, [nome, descricao, preco, estoque, categoria, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Produto atualizado com sucesso!');
    });
});

// Rota para deletar um produto
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM produtos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Produto deletado com sucesso!');
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
