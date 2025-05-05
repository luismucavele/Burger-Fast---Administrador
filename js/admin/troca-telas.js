function mostrarTela(telaId) {
    // Seleciona todas as telas
    const telas = document.querySelectorAll('.tela');
    
    // Itera sobre as telas e exibe apenas a correspondente ao botão clicado
    telas.forEach(tela => {
        if (tela.id === telaId) {
            tela.style.display = 'block';
        } else {
            tela.style.display = 'none';
        }
    });

    // Remove a classe 'ativo' de todos os botões
    const botoes = document.querySelectorAll('.item-menu');
    botoes.forEach(botao => botao.classList.remove('ativo'));

    // Adiciona a classe 'ativo' ao botão correspondente
    const botaoAtivo = document.querySelector(`.item-menu[onclick="mostrarTela('${telaId}')"]`);
    if (botaoAtivo) {
        botaoAtivo.classList.add('ativo');
    }
}

function logoutFuncionario() {
    window.location.href = "login.html";
}





