document.addEventListener('DOMContentLoaded', () => {
    const userElement = document.getElementById('user');
    // Recupera o nome do gerente salvo no localStorage
    const gerenteNome = localStorage.getItem('gerente_nome');
    if (userElement && gerenteNome) {
        userElement.textContent = gerenteNome;
    } else if (userElement) {
        userElement.textContent = 'Desconhecido';
    }
});


//funcionario


document.addEventListener('DOMContentLoaded', () => {
    const userElement = document.getElementById('user-func');
    // Recupera o nome do funcionário salvo no localStorage
    const funcionarioNome = localStorage.getItem('funcionario_nome');
    if (userElement && funcionarioNome) {
        userElement.textContent = funcionarioNome;
    } else if (userElement) {
        userElement.textContent = 'Desconhecido';
    }
});

//motoboy

document.addEventListener('DOMContentLoaded', () => {
    const userElement = document.getElementById('user-func');
    // Recupera o nome do funcionário salvo no localStorage
    const funcionarioNome = localStorage.getItem('funcionario_nome');
    if (userElement && funcionarioNome) {
        userElement.textContent = funcionarioNome;
    } else if (userElement) {
        userElement.textContent = 'Desconhecido';
    }
});
