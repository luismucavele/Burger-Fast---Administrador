// --- Funções principais para funcionário ---
let pedidoSelecionadoId = null;
// Fluxo e rótulo dos status de pedido
const STATUS_FLUXO = ['pendente', 'empreparo', 'pronto', 'entregue'];
const STATUS_LABEL = {
    pendente: "Pendente",
    empreparo: "Em Preparo",
    pronto: "Pronto",
    entregue: "Entregue"
};

let pedidos = [];
let estoque = [];
let filtroBusca = "";
let filtroAba = "todos";


function selecionarPedido(id) {
    pedidoSelecionadoId = id;
    renderPedidos();
}

// Troca de tela
function mostrarTelaFunc(telaId) {
    const telas = document.querySelectorAll('.tela-func');
    telas.forEach(tela => {
        tela.style.display = (tela.id === telaId) ? 'block' : 'none';
    });
    const botoes = document.querySelectorAll('.item-menu');
    botoes.forEach(botao => botao.classList.remove('ativo'));
    const botaoAtivo = document.querySelector(`.item-menu[onclick="mostrarTelaFunc('${telaId}')"]`);
    if (botaoAtivo) botaoAtivo.classList.add('ativo');
    if (telaId === 'Pedidos') carregarPedidos();
    if (telaId === 'Estoque') carregarEstoque();
}

// -- PEDIDOS --
function carregarPedidos() {
    exibirLoadingPedidos(true);
    fetch('http://localhost:3000/api/pedidos')
        .then(r => r.json())
        .then(dados => {
            pedidos = dados;
            renderPedidos();
            exibirLoadingPedidos(false);
        })
        .catch(() => { exibirErroPedidos("Falha ao carregar pedidos"); exibirLoadingPedidos(false); });
}


function editarStatusPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    let atualIdx = STATUS_FLUXO.indexOf(pedido.status);
    let novoStatus;
    if (atualIdx < STATUS_FLUXO.length - 1) novoStatus = STATUS_FLUXO[atualIdx + 1];
    else novoStatus = STATUS_FLUXO[0];
    // Chamada real ao backend:
    fetch(`http://localhost:3000/api/pedidos/${id}/status`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ novoStatus })
    })
    .then(r => r.json())
    .then(resp => {
        if (resp.error) {
            alert('Erro: ' + resp.error);
        } else {
            // Atualiza localmente
            pedido.status = novoStatus;
            renderPedidos();
        }
    })
    .catch(() => alert('Erro ao atualizar status do pedido'));
}

function renderPedidos() {
    const lista = document.getElementById('pedidos-lista');
    if (!lista) return;
    if (!Array.isArray(pedidos) || pedidos.length === 0) {
        lista.innerHTML = `<div class="nenhum-resultado-func"><i class="bi bi-archive"></i> Nenhum pedido a exibir no momento.</div>`;
        return;
    }
    let pedidosRender = pedidos;

    // --- FILTRO: Remove pedidos entregues há mais de 1 minuto ---
    const agora = Date.now();
    pedidosRender = pedidosRender.filter(p => {
        if (p.status !== 'entregue') return true;
        if (!p.data_entregue) return true; // Se não veio a data, mostra
        const dataEntregue = new Date(p.data_entregue).getTime();
        return (agora - dataEntregue) < 60000; // 60.000 ms = 1 min
    });

    // Filtros existentes
    if (filtroAba !== 'todos')
        pedidosRender = pedidosRender.filter(p => p.status === filtroAba);
    if (filtroBusca.trim())
        pedidosRender = pedidosRender.filter(p =>
            (p.cliente && p.cliente.toLowerCase().includes(filtroBusca.toLowerCase())) ||
            (Array.isArray(p.itens) && p.itens.join(",").toLowerCase().includes(filtroBusca.toLowerCase()))
        );

    if (pedidosRender.length === 0) {
        lista.innerHTML = `<div class="nenhum-resultado-func"><i class="bi bi-emoji-frown"></i> Nenhum pedido corresponde à busca/filtro.</div>`;
        return;
    }
    lista.innerHTML = pedidosRender.map(pedidoCardHTML).join('');
}


function pedidoCardHTML(p) {
    function formatarValor(valor) {
        return `MZN ${Number(valor).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Monta string dos itens com quantidade
    const itensStr = (p.itens && p.itens.length)
        ? p.itens.map(item => `${item.nome} (${item.quantidade})`).join(', ')
        : '-';

    return `
    <div class="pedido-card${pedidoSelecionadoId === p.id ? ' selecionado' : ''}" data-id="${p.id}" onclick="selecionarPedido(${p.id})">
        <div>
            <span class="pedido-usuario"><i class="bi bi-person-circle"></i> ${p.cliente || '-'}</span>
            <span class="pedido-hora"><i class="bi bi-clock"></i> ${p.hora || '--:--'}</span>
        </div>
        <div class="pedido-itens">
            <span><i class="bi bi-list"></i> Itens:</span>
            <span>${itensStr}</span>
        </div>
        <div class="pedido-valor">
            <span><i class="bi bi-cash"></i> <b>Valor Total:</b> ${formatarValor(p.total)}</span>
        </div>
        <div class="status-pedido-flow">
            ${STATUS_FLUXO.map(st =>
                `<span class="status-pedido-step${p.status === st ? ' ativo ' + st : ''} ${st}">${STATUS_LABEL[st]}</span>`
            ).join('<span class="status-pedido-ic"><i class="bi bi-chevron-right"></i></span>')}
        </div>
        <div class="pedido-cliente-details">
            <i class="bi bi-info-circle"></i> <b>Contato:</b> ${p.telefone || '-'} | <b>Email:</b> ${p.email || '-'}
        </div>
    </div>
    `;
}

function mudarStatusPedidoViaAba(status) {
    if (!pedidoSelecionadoId) {
        alert('Selecione um pedido primeiro!');
        return;
    }
    fetch(`http://localhost:3000/api/pedidos/${pedidoSelecionadoId}/status`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ novoStatus: status })
    })
    .then(r => r.json())
    .then(resp => {
        if (resp.error) {
            alert('Erro: ' + resp.error);
        } else {
            const pedido = pedidos.find(p => p.id === pedidoSelecionadoId);
            if (pedido) pedido.status = status;
            renderPedidos();
        }
    })
    .catch(() => alert('Erro ao atualizar status do pedido'));
}

// Função para editar status de um pedido (pronto para backend)
function editarStatusPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    let atualIdx = STATUS_FLUXO.indexOf(pedido.status);
    let novoStatus;
    if (atualIdx < STATUS_FLUXO.length - 1) novoStatus = STATUS_FLUXO[atualIdx + 1];
    else novoStatus = STATUS_FLUXO[0];

    // Pega o ID do funcionário logado do localStorage
    const funcionarioId = localStorage.getItem('funcionarioId');

    // Monta o body do fetch
    const body = { novoStatus };
    if (novoStatus === 'entregue' && funcionarioId) {
        body.funcionarioId = funcionarioId;
    }

    fetch(`http://localhost:3000/api/pedidos/${id}/status`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(resp => {
        if (resp.error) {
            alert('Erro: ' + resp.error);
        } else {
            pedido.status = novoStatus;
            renderPedidos();
        }
    })
    .catch(() => alert('Erro ao atualizar status do pedido'));
}

// Filtros
function filtrarPedidos() {
    filtroBusca = document.getElementById('pesquisar-pedido').value;
    renderPedidos();
}
function filtrarAbasStatus(btn) {
    document.querySelectorAll('.aba-status').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    filtroAba = btn.getAttribute('data-status');
    renderPedidos();
}

// Loading & Erro PEDIDOS
function exibirLoadingPedidos(flag) {
    const loading = document.getElementById('pedidos-loading');
    if (loading) loading.style.display = flag ? "block" : "none";
}
function exibirErroPedidos(msg) {
    const lista = document.getElementById('pedidos-lista');
    if (lista) lista.innerHTML = `<div class="nenhum-resultado-func" style="color:red;"><i class="bi bi-x-octagon"></i> ${msg}</div>`;
}


// -- ESTOQUE --
// -- ESTOQUE --

let categoriasEstoque = [];
let categoriaSelecionada = 'todas';

function carregarCategoriasEstoque() {
    fetch('http://localhost:3000/api/categorias')
        .then(r => r.json())
        .then(categorias => {
            categoriasEstoque = categorias;
            renderCategoriasEstoque();
        });
}

function renderCategoriasEstoque() {
    const select = document.getElementById('estoque-categoria-select');
    if (!select) return;
    select.innerHTML = `<option value="todas">Todas as Categorias</option>` +
        categoriasEstoque.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    select.value = categoriaSelecionada;
}

function onCategoriaEstoqueChange(sel) {
    categoriaSelecionada = sel.value;
    carregarEstoque();
}

function carregarEstoque() {
    exibirLoadingEstoque(true);
    let url = 'http://localhost:3000/api/estoque';
    if (categoriaSelecionada && categoriaSelecionada !== 'todas') {
        url += '?categoria=' + encodeURIComponent(categoriaSelecionada);
    }
    fetch(url)
        .then(r => r.json())
        .then(dados => {
            estoque = dados;
            renderEstoque();
            exibirLoadingEstoque(false);
        })
        .catch(() => { exibirErroEstoque("Falha ao carregar estoque"); exibirLoadingEstoque(false); });
}

function renderEstoque() {
    const lista = document.getElementById('estoque-lista');
    if (!lista) return;
    if (!Array.isArray(estoque) || estoque.length === 0) {
        lista.innerHTML = `<div class="nenhum-resultado-func"><i class="bi bi-archive"></i> Nenhum item no estoque.</div>`;
        return;
    }
    lista.innerHTML = `
        <table class="tabela-estoque">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                </tr>
            </thead>
            <tbody>
                ${estoque.map(item => `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.categoria}</td>
                        <td>MZN ${Number(item.preco).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td${item.estoque <= 10 ? ' class="estoque-baixo"' : ''}>${item.estoque}${item.estoque <= 10 ? ' <span style="color:red;">(baixo!)</span>' : ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Chame carregarCategoriasEstoque() e carregarEstoque() ao abrir a tela de estoque
document.addEventListener('DOMContentLoaded', () => {
    // ... outros inits ...
    carregarCategoriasEstoque();
});

function exibirLoadingEstoque(flag) {
    const loading = document.getElementById('estoque-loading');
    if (loading) loading.style.display = flag ? "block" : "none";
}
function exibirErroEstoque(msg) {
    const lista = document.getElementById('estoque-lista');
    if (lista) lista.innerHTML = `<div class="nenhum-resultado-func" style="color:red;"><i class="bi bi-x-octagon"></i> ${msg}</div>`;
}

// -- PERFIL e LOGOUT --

function preencherUserFunc() {
    const el = document.getElementById('user-func');
    // Usuário real virá do backend/session, ajustar no login depois
    if (el) el.textContent = "Nome do Funcionário";
}
function logoutFuncionario() {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarTelaFunc('Pedidos');
    preencherUserFunc();

    // Submeter atualização de perfil (ajustar integração depois)
    const formPerfil = document.getElementById('form-perfil-func');
    if (formPerfil) {
        formPerfil.onsubmit = function(e) {
            e.preventDefault();
            alert("A integração de atualização de perfil será feita em breve.");
        }
    }
});






window.editarStatusPedido = editarStatusPedido;
window.filtrarPedidos = filtrarPedidos;
window.filtrarAbasStatus = filtrarAbasStatus;
window.mostrarTelaFunc = mostrarTelaFunc;
setInterval(carregarPedidos, 10000);