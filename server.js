
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











// === Adicionar produtos === //
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

// PUT para editar produto existente
app.put('/api/produtos/:id', upload.single('imagem'), (req, res) => {
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const { id } = req.params;
    let setImage = '';
    let values = [nome, descricao, preco, estoque, categoria];

    if (!nome || !descricao || !preco || !estoque || !categoria) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (req.file) {
        setImage = ', imagem = ?';
        values.push(`/uploads/${req.file.filename}`);
    }
    values.push(id);

    const sql = `
        UPDATE produtos
        SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria = ?${setImage}
        WHERE id = ?
    `;
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao editar produto:', err);
            return res.status(500).json({ error: 'Erro ao editar produto.' });
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    });
});

// GET para buscar um produto pelo id
app.get('/api/produtos/id/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM produtos WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produto.' });
        if (results.length === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json(results[0]);
    });
});

app.get('/api/estoque', (req, res) => {
    const { categoria } = req.query;
    let sql = 'SELECT id, nome, preco, estoque, categoria FROM produtos';
    let params = [];
    if (categoria && categoria !== 'todas') {
        sql += ' WHERE categoria = ?';
        params.push(categoria);
    }
    sql += ' ORDER BY nome';
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar estoque:', err);
            return res.status(500).json({ error: 'Erro ao buscar estoque.' });
        }
        res.status(200).json(results);
    });
});

// Rota para listar categorias distintas
app.get('/api/categorias', (req, res) => {
    db.query('SELECT DISTINCT categoria FROM produtos ORDER BY categoria', (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar categorias.' });
        res.json(results.map(r => r.categoria));
    });
});



















// === Login do Cliente === //

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


















// === ROTAS FUNCIONÁRIOS === //

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

        // Adiciona à lista de online
        addFuncionarioOnline(funcionario);

        // Retorna dados sem a senha
        const { senha: s, ...dados } = funcionario;
        res.json({ funcionario: dados });
    });
});


















// === PEDIDOS === //

app.post('/api/pedidos', (req, res) => {
    const { clienteEmail, itens } = req.body;

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

        // Gera data/hora de Maputo
        const dataPedido = getDataAtualMaputo();

        // Inserir novo pedido
        const inserePedido = `
            INSERT INTO pedidos (cliente_id, data, status, total)
            VALUES (?, ?, 'Pendente', ?)
        `;
        db.query(inserePedido, [clienteId, dataPedido, totalPedido], (err, resultadoPedido) => {
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


function getDataAtualMaputo() {
    const date = new Date();
    // Ajusta para o fuso horário de Maputo (UTC+2)
    const maputoTime = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Maputo' }));
    // Formato: YYYY-MM-DD HH:MM:SS
    const pad = n => n.toString().padStart(2, '0');
    return `${maputoTime.getFullYear()}-${pad(maputoTime.getMonth() + 1)}-${pad(maputoTime.getDate())} ${pad(maputoTime.getHours())}:${pad(maputoTime.getMinutes())}:${pad(maputoTime.getSeconds())}`;
}

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




// === Listar pedidos no painel de funcionario=== //

app.get('/api/pedidos', (req, res) => {
    const sql = `
      SELECT p.id, c.nome AS cliente, c.email, c.celular AS telefone, p.data, p.status, p.total, p.data_entregue
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.data DESC
    `;
    db.query(sql, (err, pedidos) => {
        if (err) return res.status(500).json({ error: 'Erro ao listar pedidos.' });
        const pedidoIds = pedidos.map(p => p.id);
        if (pedidoIds.length === 0) return res.json([]);
        // ALTERAÇÃO: buscar também a quantidade dos itens
        const itensSql = `
          SELECT pedido_id, produto_nome, quantidade
          FROM pedido_itens
          WHERE pedido_id IN (?)
        `;
        db.query(itensSql, [pedidoIds], (err, itens) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar itens dos pedidos.' });
            // ALTERAÇÃO: montar array de objetos { nome, quantidade }
            const mapaItens = {};
            itens.forEach(i => {
                if (!mapaItens[i.pedido_id]) mapaItens[i.pedido_id] = [];
                mapaItens[i.pedido_id].push({ nome: i.produto_nome, quantidade: i.quantidade });
            });
            pedidos.forEach(p => {
                p.itens = mapaItens[p.id] || [];
                p.hora = new Date(p.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            });
            res.json(pedidos);
        });
    });
});


app.put('/api/pedidos/:id/status', (req, res) => {
    const { id } = req.params;
    const novoStatus = req.body.novoStatus || req.body.status;
    const funcionarioId = req.body.funcionarioId;

    if (!novoStatus) {
        return res.status(400).json({ error: 'O novo status é obrigatório.' });
    }

    db.query('SELECT status FROM pedidos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar status do pedido:', err);
            return res.status(500).json({ error: 'Erro ao buscar status do pedido.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        const statusAtual = results[0].status;

        if (statusAtual === 'entregue') {
            return res.status(400).json({ error: 'Não é possível alterar o status de um pedido já entregue.' });
        }

        let updateSql, updateParams;
        if (novoStatus === 'entregue') {
            // Atualiza status, data_entregue e funcionario_id
            updateSql = 'UPDATE pedidos SET status = ?, data_entregue = NOW(), funcionario_id = ? WHERE id = ?';
            updateParams = [novoStatus, funcionarioId || null, id];
        } else {
            updateSql = 'UPDATE pedidos SET status = ? WHERE id = ?';
            updateParams = [novoStatus, id];
        }

        db.query(updateSql, updateParams, (err, result) => {
            if (err) {
                console.error('Erro ao atualizar status do pedido:', err);
                return res.status(500).json({ error: 'Erro ao atualizar status do pedido.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }

            // --- Lógica para atualizar o estoque ---
            if (novoStatus === 'entregue') {
                // 1. Buscar todos os itens do pedido
                const itensSql = 'SELECT produto_nome, quantidade FROM pedido_itens WHERE pedido_id = ?';
                db.query(itensSql, [id], (err, itens) => {
                    if (err) {
                        console.error('Erro ao buscar itens do pedido:', err);
                        return res.status(500).json({ error: 'Erro ao buscar itens do pedido.' });
                    }
                    if (!itens || itens.length === 0) {
                        return res.status(400).json({ error: 'Nenhum item encontrado para este pedido.' });
                    }

                    // 2. Para cada item, atualizar o estoque do produto
                    let errosEstoque = [];
                    let atualizacoes = 0;
                    itens.forEach(item => {
                        // Atualiza o estoque subtraindo a quantidade
                        const updateEstoqueSql = 'UPDATE produtos SET estoque = estoque - ? WHERE nome = ?';
                        db.query(updateEstoqueSql, [item.quantidade, item.produto_nome], (err, result) => {
                            atualizacoes++;
                            if (err) {
                                errosEstoque.push(item.produto_nome);
                                console.error(`Erro ao atualizar estoque do produto ${item.produto_nome}:`, err);
                            }
                            // Quando todas as atualizações terminarem, responder
                            if (atualizacoes === itens.length) {
                                if (errosEstoque.length > 0) {
                                    return res.status(500).json({ 
                                        error: 'Erro ao atualizar estoque de alguns produtos.', 
                                        produtos: errosEstoque 
                                    });
                                }
                                return res.json({ mensagem: 'Status do pedido atualizado e estoque ajustado com sucesso!' });
                            }
                        });
                    });
                });
            } else {
                res.json({ mensagem: 'Status do pedido atualizado com sucesso!' });
            }
        });
    });
});














// --- ROTA PARA BUSCAR FUNCIONÁRIOS ONLINE ---

const funcionariosOnline = []; // [{id, nome, tipo_funcionario}]

function addFuncionarioOnline(funcionario) {
    if (!funcionariosOnline.some(f => f.id === funcionario.id)) {
        funcionariosOnline.push({
            id: funcionario.id,
            nome: funcionario.nome,
            tipo_funcionario: funcionario.tipo_funcionario
        });
    }
}

function removeFuncionarioOnline(id) {
    const idx = funcionariosOnline.findIndex(f => f.id === id);
    if (idx !== -1) funcionariosOnline.splice(idx, 1);
}

// --- ROTA PARA LISTAR FUNCIONÁRIOS ONLINE ---
app.get('/api/funcionarios-online', (req, res) => {
    res.json(funcionariosOnline);
});

// --- ROTA PARA LOGOUT DO FUNCIONÁRIO ---
app.post('/api/logout-funcionario', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
    removeFuncionarioOnline(id);
    res.json({ message: 'Logout realizado com sucesso!' });
});














// === VENDAS === //
app.get('/api/total-vendas', (req, res) => {
    const sql = 'SELECT SUM(valor) AS total_vendas FROM vendas';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao calcular total das vendas:', err);
            return res.status(500).json({ error: 'Erro ao calcular total das vendas.' });
        }
        const total = results[0].total_vendas || 0;
        res.json({ total_vendas: total });
    });
});

app.get('/api/vendas-mensais', (req, res) => {
    const sql = `
        SELECT 
            DATE_FORMAT(data_venda, '%Y-%m') AS mes,
            SUM(valor) AS total
        FROM vendas
        WHERE YEAR(data_venda) = YEAR(CURDATE())
        GROUP BY mes
        ORDER BY mes
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendas mensais:', err);
            return res.status(500).json({ error: 'Erro ao buscar vendas mensais.' });
        }
        res.json(results);
    });
});

app.get('/api/notificacoes-estoque-50', (req, res) => {
    const sql = 'SELECT id, nome, estoque FROM produtos WHERE estoque = 50';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar notificações de estoque:', err);
            return res.status(500).json({ error: 'Erro ao buscar notificações de estoque.' });
        }
        res.json(results);
    });
});







// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
