
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// ADICIONE ESTA LINHA para trabalhar com JSON no body
app.use(express.json());

// Configurar armazenamento de arquivos com multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'burger_fast'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Conectado ao banco de dados!');
});











// Adicionar produto
app.post('/api/produtos', upload.single('imagem'), (req, res) => {
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nome || !descricao || !preco || !estoque || !imagem || !categoria) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = `
        INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [nome, descricao, preco, estoque, imagem, categoria], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar produto:', err);
            return res.status(500).json({ error: 'Erro ao adicionar produto.' });
        }

        res.status(201).json({ message: 'Produto adicionado com sucesso!' });
    });
});

app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ error: 'Erro ao buscar produtos.' });
        }
        res.status(200).json(results);
    });
});

// Listar produtos por categoria
app.get('/api/produtos/:categoria', (req, res) => {
    const { categoria } = req.params;

    const sql = `SELECT * FROM produtos WHERE categoria = ?`;
    db.query(sql, [categoria], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ error: 'Erro ao buscar produtos.' });
        }
        res.status(200).json(results);
    });
});




// Deletar produto
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send('Erro ao deletar produto.');
        res.send('Produto deletado com sucesso!');
    });
});


















//LOGIN DO CLENTE 

// Rota para registrar um novo cliente
app.post('/api/register', (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    const sql = 'INSERT INTO clientes (nome, email) VALUES (?, ?)';
    db.query(sql, [nome, email], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'E-mail já registrado.' });
            }
            return res.status(500).json({ error: 'Erro ao registrar o cliente.' });
        }
        res.status(201).json({ message: 'Cliente registrado com sucesso!' });
    });
});


// Rota para login
app.post('/api/login', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }

    const sql = 'SELECT * FROM clientes WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar o cliente.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.status(200).json({ message: 'Login bem-sucedido!', cliente: results[0] });
    });
});















//Perfil do cliente

// Rota para atualizar os dados do cliente
app.put('/api/atualizar-cliente', (req, res) => {
    const { email, nome, celular, endereco } = req.body;

    if (!email || !nome || !celular || !endereco) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'UPDATE clientes SET nome = ?, celular = ?, endereco = ? WHERE email = ?';
    db.query(sql, [nome, celular, endereco, email], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            return res.status(500).json({ error: 'Erro ao atualizar os dados do cliente.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        res.status(200).json({ message: 'Dados atualizados com sucesso!' });
    });
});

















/* === ROTAS FUNCIONÁRIOS === */

// Listar todos
app.get('/api/funcionarios', (req, res) => {
    db.query('SELECT * FROM funcionarios', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

// Buscar por ID
app.get('/api/funcionarios/:id', (req, res) => {
    db.query('SELECT * FROM funcionarios WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.length === 0)
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        res.json(result[0]);
    });
});

// Cadastrar novo funcionário
app.post('/api/funcionarios', (req, res) => {
    const { nome, usuario, senha, salario, sexo, residencia, nuit, tipo_funcionario, telefone, email, numero_bi, status } = req.body;
    const sql = `
        INSERT INTO funcionarios
        (nome, usuario, senha, salario, sexo, residencia, nuit, tipo_funcionario, telefone, email, numero_bi, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [nome, usuario, senha, salario, sexo, residencia, nuit, tipo_funcionario, telefone, email, numero_bi, status], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao cadastrar funcionário', error: err.message });
        res.status(201).json({ message: 'Funcionário cadastrado com sucesso!' });
    });
});

// Atualizar funcionário
app.put('/api/funcionarios/:id', (req, res) => {
    const { nome, usuario, senha, salario, sexo, residencia, nuit, tipo_funcionario, telefone, email, numero_bi, status } = req.body;
    const sql = `
        UPDATE funcionarios
        SET nome = ?, usuario = ?, senha = ?, salario = ?, sexo = ?, residencia = ?, nuit = ?, tipo_funcionario = ?, telefone = ?, email = ?, numero_bi = ?, status = ?
        WHERE id = ?
    `;
    db.query(sql, [nome, usuario, senha, salario, sexo, residencia, nuit, tipo_funcionario, telefone, email, numero_bi, status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao atualizar funcionário', error: err.message });
        res.json({ message: 'Funcionário atualizado com sucesso!' });
    });
});

// "Excluir" (apagar logicamete: status = Inativo)
app.delete('/api/funcionarios/:id', (req, res) => {
    db.query('UPDATE funcionarios SET status = "Inativo" WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao excluir funcionário', error: err.message });
        res.json({ message: 'Funcionário excluído com sucesso!' });
    });
});


// Login do funcionário

app.post('/api/login-funcionario', (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    // Procura usuário exato
    const sql = 'SELECT * FROM funcionarios WHERE usuario = ? LIMIT 1';
    db.query(sql, [usuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no banco de dados.' });

        if (results.length === 0)
            return res.status(401).json({ error: 'Usuário não encontrado.' });

        // Checa senha (importante: com hash em produção)
        const funcionario = results[0];
        if (funcionario.senha !== senha)
            return res.status(401).json({ error: 'Senha incorreta.' });

        if (funcionario.status && funcionario.status.toLowerCase() === 'inativo')
            return res.status(403).json({ error: 'Funcionário inativo.' });

        // Retorna dados sem a senha
        const { senha: s, ...dados } = funcionario;
        res.json({ funcionario: dados });
    });
});



















//PEDIDOS


app.post('/api/pedidos', (req, res) => {
    const { clienteEmail, itens, data } = req.body;

    if (!clienteEmail || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: 'Dados do pedido incompletos.' });
    }

    // Busca o id do cliente pelo email
    const buscaCliente = 'SELECT id FROM clientes WHERE email = ?';
    db.query(buscaCliente, [clienteEmail], (err, resultadoCliente) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).json({ error: 'Erro ao buscar cliente.' });
        }
        if (resultadoCliente.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        const clienteId = resultadoCliente[0].id;
        const totalPedido = itens.reduce((soma, i) => soma + (i.preco * i.quantidade), 0);

        // Inserir novo pedido
        const inserePedido = `
            INSERT INTO pedidos (cliente_id, data, status, total)
            VALUES (?, ?, 'Pendente', ?)
        `;
        db.query(inserePedido, [clienteId, data, totalPedido], (err, resultadoPedido) => {
            if (err) {
                console.error('Erro ao salvar pedido:', err);
                return res.status(500).json({ error: 'Erro ao salvar pedido.' });
            }
            const pedidoId = resultadoPedido.insertId;

            // Inserir todos os itens do pedido
            const valoresItens = itens.map(item =>
                [pedidoId, item.nome, item.descricao, item.preco, item.quantidade, item.imagem]
            );
            const insereItens = `
                INSERT INTO pedido_itens
                (pedido_id, produto_nome, descricao, preco, quantidade, imagem)
                VALUES ?
            `;
            db.query(insereItens, [valoresItens], (err, resultItens) => {
                if (err) {
                    console.error('Erro ao salvar itens:', err);
                    return res.status(500).json({ error: 'Erro ao salvar itens do pedido.' });
                }
                res.status(201).json({ message: 'Pedido realizado com sucesso!', pedidoId });
            });
        });
    });
});









// Listar pedidos do cliente por email (para painel do cliente)
app.get('/api/pedidos-cliente', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email do cliente é obrigatório.' });
    }
    const sql = `
      SELECT p.id, p.data, p.status, p.total
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE c.email = ?
      ORDER BY p.data DESC
    `;
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
        res.json(results);
    });
});











// Listar todos os pedidos (para painel do funcionário)
// Rota para funcionário listar todos os pedidos com nome do cliente e itens
app.get('/api/pedidos', (req, res) => {
    const sql = `
      SELECT p.id, c.nome AS cliente, c.email, c.celular AS telefone, p.data, p.status, p.total
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.data DESC
    `;
    db.query(sql, (err, pedidos) => {
        if (err) return res.status(500).json({ error: 'Erro ao listar pedidos.' });
        // Agora busca os itens de cada pedido
        const pedidoIds = pedidos.map(p => p.id);
        if (pedidoIds.length === 0) return res.json([]);
        const itensSql = `
          SELECT pedido_id, produto_nome
          FROM pedido_itens
          WHERE pedido_id IN (?)
        `;
        db.query(itensSql, [pedidoIds], (err, itens) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar itens dos pedidos.' });
            // Agrupa itens por pedido_id
            const mapaItens = {};
            itens.forEach(i => {
                if (!mapaItens[i.pedido_id]) mapaItens[i.pedido_id] = [];
                mapaItens[i.pedido_id].push(i.produto_nome);
            });
            // Adiciona os itens no objeto principal
            pedidos.forEach(p => {
                p.itens = mapaItens[p.id] || [];
                // Data e hora formatada para o card (opcional)
                p.hora = new Date(p.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            });
            res.json(pedidos);
        });
    });
});

// Rota para funcionário alterar o status do pedido
app.put('/api/pedidos/:id/status', (req, res) => {
    const { id } = req.params;
    const { novoStatus } = req.body;

    if (!novoStatus) {
        return res.status(400).json({ error: 'O novo status é obrigatório.' });
    }
    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    db.query(sql, [novoStatus, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar status do pedido:', err);
            return res.status(500).json({ error: 'Erro ao atualizar status do pedido.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        res.json({ message: 'Status do pedido atualizado com sucesso!' });
    });
});



// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
