document.getElementById('form-produto').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Validação básica dos campos
    const nome = document.getElementById('nome-produto').value.trim();
    const preco = document.getElementById('preco').value.trim();
    const categoria = document.getElementById('categoria').value;
    const imagemInput = document.getElementById('imagem');
    
    if (!nome) {
        mostrarMensagem('O nome do produto é obrigatório', 'erro');
        return;
    }
    
    if (!preco || isNaN(parseFloat(preco))) {
        mostrarMensagem('Informe um preço válido', 'erro');
        return;
    }
    
    if (!categoria) {
        mostrarMensagem('Selecione uma categoria', 'erro');
        return;
    }
    
    // Verificar se uma imagem foi selecionada
    if (imagemInput.files.length === 0) {
        mostrarMensagem('Selecione uma imagem para o produto', 'erro');
        return;
    }

    // Mostrar indicador de carregamento
    const submitBtn = document.querySelector('#form-produto button[type="submit"]');
    const btnTextoOriginal = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', document.getElementById('descricao').value.trim());
    formData.append('preco', preco);
    formData.append('estoque', document.getElementById('estoque').value);
    formData.append('categoria', categoria);
    formData.append('imagem', imagemInput.files[0]);

    fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        mostrarMensagem(data.message, 'sucesso');
        document.getElementById('form-produto').reset();
        carregarProdutos();
    })
    .catch(err => {
        console.error('Erro ao adicionar produto:', err);
        mostrarMensagem('Erro ao adicionar produto. Tente novamente.', 'erro');
    })
    .finally(() => {
        // Restaurar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnTextoOriginal;
    });
});

function carregarProdutos() {
    const categoria = document.getElementById('categoria').value;
    if (!categoria) {
        document.getElementById('lista-produtos').innerHTML = '<p>Selecione uma categoria para ver os produtos</p>';
        return;
    }

    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Carregando produtos...</div>';

    fetch(`http://localhost:3000/api/produtos/${categoria}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(produtos => {
            lista.innerHTML = '';

            if (produtos.length === 0) {
                lista.innerHTML = '<p>Nenhum produto encontrado nesta categoria</p>';
                return;
            }

            produtos.forEach(produto => {
                const item = document.createElement('div');
                item.className = 'produto-item';
                item.id = `produto-${produto.id}`;
                
                item.innerHTML = `
                    <img src="http://localhost:3000${produto.imagem}" alt="${produto.nome}" 
                         onerror="this.src='img/produto-sem-imagem.jpg'"/>
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao || 'Sem descrição'}</p>
                    <p>Preço: ${formatarPreco(produto.preco)} MT</p>
                    <p>Estoque: ${produto.estoque}</p>
                    <div class="acoes-produto">
                        <button class="btn-editar" onclick="editarProduto(${produto.id})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn-deletar" onclick="confirmarExclusao(${produto.id}, '${produto.nome}')">
                            <i class="bi bi-trash"></i> Deletar
                        </button>
                    </div>
                `;
                lista.appendChild(item);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar produtos:', err);
            lista.innerHTML = `<p class="erro">Erro ao carregar produtos: ${err.message}</p>`;
        });
}

function confirmarExclusao(id, nome) {
    if (confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
        deletarProduto(id);
    }
}

function deletarProduto(id) {
    // Mostrar indicador de carregamento no item
    const produtoItem = document.getElementById(`produto-${id}`);
    if (produtoItem) {
        produtoItem.classList.add('deletando');
        produtoItem.innerHTML += '<div class="overlay-loading">Excluindo...</div>';
    }

    fetch(`http://localhost:3000/api/produtos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.text();
    })
    .then(data => {
        mostrarMensagem(data, 'sucesso');
        
        // Remover o item com animação
        if (produtoItem) {
            produtoItem.style.animation = 'fadeOut 0.5s';
            setTimeout(() => {
                produtoItem.remove();
                
                // Verificar se ainda há produtos
                const lista = document.getElementById('lista-produtos');
                if (lista.children.length === 0) {
                    lista.innerHTML = '<p>Nenhum produto encontrado nesta categoria</p>';
                }
            }, 500);
        } else {
            carregarProdutos();
        }
    })
    .catch(err => {
        console.error('Erro ao deletar produto:', err);
        mostrarMensagem('Erro ao deletar produto. Tente novamente.', 'erro');
        
        // Remover overlay de carregamento se houver erro
        if (produtoItem) {
            produtoItem.classList.remove('deletando');
            const overlay = produtoItem.querySelector('.overlay-loading');
            if (overlay) overlay.remove();
        }
    });
}

function editarProduto(id) {
    // Implementação futura da funcionalidade de edição
    alert('Funcionalidade de edição será implementada em breve!');
}

function formatarPreco(preco) {
    return parseFloat(preco).toFixed(2).replace('.', ',');
}

function mostrarMensagem(mensagem, tipo) {
    // Criar elemento de mensagem
    const msgElement = document.createElement('div');
    msgElement.className = `mensagem ${tipo}`;
    msgElement.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Adicionar ao DOM
    const container = document.querySelector('.mensagens-container') || document.body;
    container.appendChild(msgElement);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (msgElement.parentElement) {
            msgElement.classList.add('fadeOut');
            setTimeout(() => msgElement.remove(), 500);
        }
    }, 5000);
}




//total de produtos
/**
 * Atualiza o card de total de produtos no dashboard admin.html
 * Busca os produtos da base de dados via API REST
 */
document.addEventListener('DOMContentLoaded', () => {
    const totalProdutosElement = document.getElementById('total-produtos');

    async function buscarTotalProdutos() {
        try {
            // Ajuste a URL conforme necessário para seu backend
            const resposta = await fetch('http://localhost:3000/api/produtos');
            if (!resposta.ok) throw new Error('Erro ao buscar produtos');
            const produtos = await resposta.json();

            // Verifica se produtos é um array
            if (Array.isArray(produtos)) {
                totalProdutosElement.textContent = produtos.length;
            } else if (produtos.data && Array.isArray(produtos.data)) {
                // Caso a API retorne { data: [...] }
                totalProdutosElement.textContent = produtos.data.length;
            } else {
                totalProdutosElement.textContent = '0';
                console.warn('Resposta inesperada da API de produtos:', produtos);
            }
        } catch (error) {
            totalProdutosElement.textContent = 'Erro';
            console.error('Erro ao buscar total de produtos:', error);
        }
    }

    if (totalProdutosElement) {
        buscarTotalProdutos();
    }
});



// Adicionar listener para mudança de categoria
document.getElementById('categoria').addEventListener('change', carregarProdutos);

// Inicializar
carregarProdutos();