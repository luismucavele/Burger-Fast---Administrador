// --- Notificações de estoque igual a 50 ---

async function buscarNotificacoesEstoque50() {
    try {
        const resp = await fetch('http://localhost:3000/api/notificacoes-estoque-50');
        if (!resp.ok) throw new Error('Erro ao buscar notificações');
        return await resp.json();
    } catch (e) {
        return [];
    }
}

function atualizarBadgeNotificacao(qtd) {
    const badge = document.getElementById('contador-carrinho');
    if (badge) {
        badge.textContent = qtd > 0 ? qtd : '0';
        badge.style.display = qtd > 0 ? 'inline-block' : 'none';
    }
}

// Exibe mensagens detalhadas ao clicar no sino
function mostrarNotificacoesEstoque(produtos) {
    if (!produtos || produtos.length === 0) {
        mostrarMensagem('Nenhum produto atingiu o estoque de 50.', 'info');
        return;
    }
    produtos.forEach(prod => {
        mostrarMensagem(`O produto <b>${prod.nome}</b> ficou com <b>50</b> unidades em estoque!`, 'alerta');
    });
}

// Atualiza badge ao carregar e a cada 60s
async function checarNotificacoesEstoque() {
    const produtos = await buscarNotificacoesEstoque50();
    atualizarBadgeNotificacao(produtos.length);

    // Armazena para exibir ao clicar no sino
    window.__notificacoesEstoque50 = produtos;
}

// Evento para clicar no sino e mostrar detalhes
document.addEventListener('DOMContentLoaded', () => {
    checarNotificacoesEstoque();
    setInterval(checarNotificacoesEstoque, 60000); // Atualiza a cada 60s

    const sino = document.querySelector('.notficacao-icon');
    if (sino) {
        sino.addEventListener('click', () => {
            mostrarNotificacoesEstoque(window.__notificacoesEstoque50 || []);
        });
    }
});