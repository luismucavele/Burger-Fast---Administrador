function atualizarCartaoTotalCategorias() {
    const select = document.getElementById('categoria');
    const cartao = document.getElementById('total_categorias');
    if (select && cartao) {
        // Exclui o placeholder (primeira opção)
        const total = select.options.length - 1;
        cartao.textContent = total;
    }
}

// Atualiza ao carregar a página
window.addEventListener('DOMContentLoaded', atualizarCartaoTotalCategorias);