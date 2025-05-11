async function realizarLogout() {
    const funcionarioId = localStorage.getItem('funcionarioId');
    
    if (!funcionarioId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Remove o funcionário da lista de online no servidor
        const response = await fetch('http://localhost:3000/api/logout-funcionario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: funcionarioId })
        });

        if (!response.ok) {
            console.error('Erro ao realizar logout no servidor');
        }

    } catch (error) {
        console.error('Erro na comunicação com servidor:', error);
    } finally {
        // Limpa todos os dados do localStorage
        localStorage.clear();
        
        // Limpa o nome do usuário na interface
        const userElement = document.getElementById('user-func');
        if (userElement) {
            userElement.textContent = '';
        }
        
        // Redireciona para a página de login
        window.location.href = 'login.html';
    }
}