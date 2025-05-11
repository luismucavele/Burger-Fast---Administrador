/**
 * Atualiza a tabela de funcionários online no painel admin.
 */function atualizarTabelaFuncionariosOnline() {
    fetch('http://localhost:3000/api/funcionarios-online', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('Falha ao obter lista de funcionários');
        return res.json();
    })
    .then(lista => {
        const tbody = document.querySelector('#tabela-funcionarios-online tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        if (lista.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 2;
            td.textContent = 'Nenhum funcionário online no momento.';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        lista.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${f.nome}</td>
                <td>${f.tipo_funcionario}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Erro ao atualizar lista de funcionários:', error);
    });
}

// Atualiza a cada 10 segundos (aumentado de 5 para 10 para reduzir carga no servidor)
const intervalId = setInterval(atualizarTabelaFuncionariosOnline, 10000);

// Limpa o intervalo quando a página é fechada
window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
});

// Primeira atualização quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarTabelaFuncionariosOnline);

