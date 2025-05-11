// Função unificada para exibir nome do usuário logado
document.addEventListener('DOMContentLoaded', () => {
    // Recupera o nome do funcionário salvo no localStorage
    const funcionarioNome = localStorage.getItem('funcionarioNome');
    const tipoFuncionario = localStorage.getItem('tipoFuncionario');
    
    // Seleciona o elemento correto baseado no tipo de funcionário
    let userElement;
    if (tipoFuncionario === 'Gerente') {
        userElement = document.getElementById('user');
    } else {
        userElement = document.getElementById('user-func');
    }

    // Atualiza o nome se o elemento existir
    if (userElement) {
        userElement.textContent = funcionarioNome || 'Desconhecido';
    }
});