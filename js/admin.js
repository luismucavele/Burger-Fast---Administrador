document.getElementById('form-produto').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('estoque', document.getElementById('estoque').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('imagem', document.getElementById('imagem').files[0]);

    fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarProdutos(); // Atualiza os produtos no menu
        })
        .catch(err => console.error('Erro ao adicionar produto:', err));
});
function carregarProdutos() {
    fetch('http://localhost:3000/api/produtos')
        .then(response => response.json())
        .then(produtos => {
            const lista = document.getElementById('lista-produtos');
            lista.innerHTML = '';

            produtos.forEach(produto => {
                const item = `
                    <div class="produto-item">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <h3>${produto.nome}</h3>
                        <p>${produto.descricao}</p>
                        <p>Preço: ${produto.preco} MT</p>
                        <p>Estoque: ${produto.estoque}</p>
                        <button onclick="deletarProduto(${produto.id})">Deletar</button>
                    </div>
                `;
                lista.innerHTML += item;
                
            });
        })
        .catch(err => console.error('Erro ao carregar produtos:', err));
}

function deletarProduto(id) {
    fetch(`http://localhost:3000/api/produtos/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarProdutos();
        })
        .catch(err => console.error('Erro ao deletar produto:', err));
}

carregarProdutos();







