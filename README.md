
# Burger Fast - Sistema de Gestão

Sistema completo para gerenciamento de lanchonete, incluindo administração de produtos, funcionários, vendas, estoque e pedidos em tempo real.

---

## Índice

- [Visão Geral](#visão-geral)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Execução do Servidor](#execução-do-servidor)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Funcionalidades](#funcionalidades)
- [Acesso às Interfaces](#acesso-às-interfaces)
- [APIs Disponíveis](#apis-disponíveis)
- [Observações de Segurança](#observações-de-segurança)
- [Contato](#contato)

---

## Visão Geral

O Burger Fast é um sistema web para gestão de lanchonetes, permitindo:

- Cadastro e gerenciamento de produtos e categorias
- Controle de estoque
- Cadastro, atualização e login de funcionários
- Painel administrativo com relatórios de vendas
- Painel do funcionário para pedidos em tempo real e controle de estoque
- Cadastro e login de clientes
- Realização e acompanhamento de pedidos

---

## Requisitos

- Node.js (v14 ou superior)
- MySQL Server
- Navegador web moderno

---

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd <pasta-do-projeto>
   ```

2. **Instale as dependências do backend:**
   ```bash
   npm install
   ```

3. **Crie a pasta de uploads (para imagens de produtos/categorias):**
   ```bash
   mkdir uploads
   ```

---

## Configuração do Banco de Dados

1. **Crie o banco de dados MySQL:**
   - Nome sugerido: `burger_fast`
   - Importe o script SQL fornecido (caso exista) para criar as tabelas necessárias (`produtos`, `clientes`, `funcionarios`, `pedidos`, `pedido_itens`, `vendas`, etc).

2. **Configure o acesso ao banco:**
   - No arquivo `server.js`, ajuste as credenciais de conexão:
     ```js
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: '',
         database: 'burger_fast'
     });
     ```

---

## Execução do Servidor

1. **Inicie o backend:**
   ```bash
   node server.js
   ```
   O servidor rodará por padrão na porta `3000`.

2. **Acesse as interfaces web:**
   - Recomenda-se servir os arquivos HTML via um servidor estático (ex: Live Server, http-server, XAMPP, etc) ou abrir diretamente no navegador.

---

## Estrutura de Pastas

```
/
├── server.js
├── uploads/                # Imagens de produtos/categorias
├── admin.html              # Painel administrativo
├── funcionario.html        # Painel do funcionário
├── login.html              # Tela de login de funcionários
├── css/                    # Estilos CSS
├── js/                     # Scripts JS para frontend
├── authentication/         # Scripts de autenticação frontend
└── ... outros arquivos
```

---

## Funcionalidades

### Painel Administrativo (`admin.html`)
- Dashboard com totais de produtos, categorias, funcionários e vendas
- Gerenciamento de produtos (CRUD)
- Gerenciamento de funcionários (CRUD)
- Gerenciamento de categorias
- Relatório de vendas (gráfico)
- Visualização de funcionários online

### Painel do Funcionário (`funcionario.html`)
- Visualização e atualização de pedidos em tempo real
- Filtros por status de pedido
- Controle de estoque por categoria
- Módulo de atendimento ao cliente (em breve)

### Login de Funcionário (`login.html`)
- Autenticação de funcionários por usuário e senha

### Backend (`server.js`)
- API RESTful para produtos, categorias, funcionários, clientes, pedidos e vendas
- Upload de imagens via Multer
- Controle de estoque automático ao entregar pedidos
- Listagem de funcionários online

---

## Acesso às Interfaces

- **Administração:**  
  Abra `admin.html` no navegador (requer login de funcionário com permissão).

- **Funcionário:**  
  Abra `funcionario.html` no navegador (requer login).

- **Login:**  
  Abra `login.html` para autenticação de funcionários.

- **Observação:**  
  As interfaces consomem a API backend rodando em `http://localhost:3000`.

---

## APIs Disponíveis

Exemplos de endpoints (consulte o código para detalhes):

- `POST /api/login-funcionario` — Login de funcionário
- `POST /api/funcionarios` — Cadastrar funcionário
- `GET /api/funcionarios` — Listar funcionários
- `PUT /api/funcionarios/:id` — Atualizar funcionário
- `DELETE /api/funcionarios/:id` — Inativar funcionário

- `POST /api/produtos` — Adicionar produto (com imagem)
- `GET /api/produtos` — Listar produtos
- `PUT /api/produtos/:id` — Atualizar produto
- `DELETE /api/produtos/:id` — Remover produto

- `GET /api/categorias` — Listar categorias
- `POST /api/pedidos` — Realizar pedido
- `GET /api/pedidos` — Listar pedidos (painel funcionário)
- `PUT /api/pedidos/:id/status` — Atualizar status do pedido

- `GET /api/estoque` — Listar estoque (por categoria)
- `GET /api/total-vendas` — Total de vendas
- `GET /api/vendas-mensais` — Vendas mensais

---

## Observações de Segurança

- **Senhas de funcionários** são armazenadas em texto puro. Para produção, implemente hash de senha (ex: bcrypt).
- **Uploads de imagem** são salvos na pasta `uploads/`. Certifique-se de proteger o acesso conforme necessário.
- **CORS** está habilitado para todos os domínios por padrão.

---

## Contato

Dúvidas ou sugestões? Entre em contato com o desenvolvedor responsável.

---
