// --- Funções principais para funcionário ---

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
    // Exemplo/facilitador para integração futura (trocar por fetch correspondente ao backend):
    /*
    fetch('/api/pedidos')
      .then(r=>r.json())
      .then(dados=>{
         pedidos = dados;
         renderPedidos();
         exibirLoadingPedidos(false);
      })
      .catch(()=>{exibirErroPedidos("Falha ao carregar pedidos"); exibirLoadingPedidos(false);});
    */
    pedidos = []; // Limpa antes de integração (dados reais virão do backend)
    renderPedidos();
    exibirLoadingPedidos(false);
}

function renderPedidos() {
    const lista = document.getElementById('pedidos-lista');
    if (!lista) return;
    if (!Array.isArray(pedidos) || pedidos.length === 0) {
        lista.innerHTML = `<div class="nenhum-resultado-func"><i class="bi bi-archive"></i> Nenhum pedido a exibir no momento.</div>`;
        return;
    }
    let pedidosRender = pedidos;
    // Filtros
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
    // Renderiza um cartão de pedido com status visual e botão para alterar status
    return `
    <div class="pedido-card" data-id="${p.id}">
        <div>
            <span class="pedido-usuario"><i class="bi bi-person-circle"></i> ${p.cliente || '-'}</span>
            <span class="pedido-hora"><i class="bi bi-clock"></i> ${p.hora || '--:--'}</span>
        </div>
        <div class="pedido-itens">
            <span><i class="bi bi-list"></i> Itens:</span>
            <span>${(p.itens && p.itens.length) ? p.itens.join(', ') : '-'}</span>
        </div>
        <div class="status-pedido-flow">
            ${STATUS_FLUXO.map(st =>
                `<span class="status-pedido-step${p.status === st ? ' ativo ' + st : ''} ${st}">${STATUS_LABEL[st]}</span>`
            ).join('<span class="status-pedido-ic"><i class="bi bi-chevron-right"></i></span>')}
            <button class="pedido-status-editar" onclick="editarStatusPedido(${p.id})"><i class="bi bi-pencil"></i> Mudar Status</button>
        </div>
        <div class="pedido-cliente-details">
            <i class="bi bi-info-circle"></i> <b>Contato:</b> ${p.telefone || '-'} | <b>Email:</b> ${p.email || '-'}
        </div>
    </div>
    `;
}

// Função para editar status de um pedido (pronto para backend)
function editarStatusPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    let novoStatus;
    let atualIdx = STATUS_FLUXO.indexOf(pedido.status);
    if (atualIdx < STATUS_FLUXO.length - 1) novoStatus = STATUS_FLUXO[atualIdx + 1];
    else novoStatus = STATUS_FLUXO[0];
    // Exemplo de integração:
    // fetch(`/api/pedidos/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: novoStatus }) })
    //    .then(resp=>resp.json()).then(...)
    // Por enquanto só placeholder:
    alert(`Ao integrar: mudar status do pedido #${id} para "${STATUS_LABEL[novoStatus]}"`);
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

function carregarEstoque() {
    exibirLoadingEstoque(true);
    // Exemplo integração futura:
    /*
    fetch('/api/estoque').then(r=>r.json()).then(dados=>{
        estoque = dados;
        renderEstoque();
        exibirLoadingEstoque(false);
    }).catch(()=>{exibirErroEstoque("Falha ao carregar estoque"); exibirLoadingEstoque(false);});
    */
    estoque = [];
    renderEstoque();
    exibirLoadingEstoque(false);
}

function renderEstoque() {
    const lista = document.getElementById('estoque-lista');
    if (!lista) return;
    if (!Array.isArray(estoque) || estoque.length === 0) {
        lista.innerHTML = `<div class="nenhum-resultado-func"><i class="bi bi-archive"></i> Nenhum item no estoque.</div>`;
        return;
    }
    lista.innerHTML = estoque.map(item => `
        <div class="estoque-item">
            <div class="estoque-nome">${item.nome}</div>
            <div class="estoque-quantidade">
                Estoque: 
                <strong class="${item.quantidade <= 10 ? 'estoque-baixo' : ''}">
                    ${item.quantidade} ${item.quantidade <= 10 ? '(baixo!)' : ''}
                </strong>
            </div>
        </div>
    `).join('');
}

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