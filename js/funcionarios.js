const API_URL = 'http://localhost:3000/api/funcionarios';
let funcionarioSelecionado = null;

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = 'info') {
    const container = document.querySelector('.mensagens-container') || criarContainerMensagens();
    const mensagemElement = document.createElement('div');
    
    mensagemElement.className = `mensagem ${tipo}`;
    mensagemElement.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(mensagemElement);
    setTimeout(() => mensagemElement.remove(), 5000);
}

function criarContainerMensagens() {
    const container = document.createElement('div');
    container.className = 'mensagens-container';
    document.body.appendChild(container);
    return container;
}

// Carregar funcionários
async function carregarFuncionarios() {
    try {
        const lista = document.getElementById('lista-funcionarios');
        if (!lista) throw new Error('Tabela de funcionários não encontrada');

        lista.innerHTML = '<tr><td colspan="12">Carregando funcionários...</td></tr>';

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        
        const funcionarios = await response.json();
        
        lista.innerHTML = funcionarios.length > 0 
            ? funcionarios.map(func => `
                <tr data-id="${func.id}" onclick="selecionarFuncionario(${func.id})">
                    <td>${func.id}</td>
                    <td>${func.nome || '-'}</td>
                    <td>${func.usuario || '-'}</td>
                    <td>${func.telefone || '-'}</td>
                    <td>••••••••</td>
                    <td>${func.numero_bi || '-'}</td>
                    <td>${func.email || '-'}</td>
                    <td>${func.salario ? `MZN ${func.salario}` : '-'}</td>
                    <td>${func.residencia || '-'}</td>
                    <td>${func.sexo || '-'}</td>
                    <td>${func.tipo_funcionario || '-'}</td>
                    <td class="status ${func.status === 'Ativo' ? 'ativo' : 'inativo'}">
                        ${func.status || '-'}
                    </td>
                </tr>
            `).join('')
            : '<tr><td colspan="12">Nenhum funcionário cadastrado</td></tr>';

        atualizarTotalFuncionarios(funcionarios.length);
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'erro');
    }
}

// Atualizar contador de funcionários
function atualizarTotalFuncionarios(total) {
    const elementoTotal = document.getElementById('total-funcionarios');
    if (elementoTotal) {
        elementoTotal.textContent = total;
    }
}

// Cadastrar funcionário
async function cadastrarFuncionario(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('funcionarios');
        if (!form) throw new Error('Formulário não encontrado');

        // Validar campos obrigatórios
        const camposObrigatorios = [
            'nome-funcionario', 'usuario', 'senha', 'salario', 
            'sexo', 'telefone', 'tipo-funcionario', 'status'
        ];
        
        const camposFaltando = camposObrigatorios.filter(id => {
            const campo = document.getElementById(id);
            return !campo || !campo.value.trim();
        });

        if (camposFaltando.length > 0) {
            throw new Error('Preencha todos os campos obrigatórios');
        }

        // Obter dados do formulário
        const funcionario = {
            nome: document.getElementById('nome-funcionario').value.trim(),
            usuario: document.getElementById('usuario').value.trim(),
            senha: document.getElementById('senha').value.trim(),
            salario: parseFloat(document.getElementById('salario').value),
            sexo: document.getElementById('sexo').value,
            residencia: document.getElementById('residencia').value.trim(),
            nuit: document.getElementById('nuit').value.trim(),
            tipo_funcionario: document.getElementById('tipo-funcionario').value,
            telefone: document.getElementById('telefone').value.trim(),
            email: document.getElementById('email').value.trim(),
            numero_bi: document.getElementById('numero-bi').value.trim(),
            status: document.getElementById('status').value
        };

        // Enviar para a API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(funcionario)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro ao cadastrar funcionário');
        }

        mostrarMensagem('Funcionário cadastrado com sucesso!', 'sucesso');
        carregarFuncionarios();
        form.reset();
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'erro');
    }
}

// Selecionar funcionário para edição
async function selecionarFuncionario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        
        const funcionario = await response.json();
        
        // Preencher formulário
        document.getElementById('nome-funcionario').value = funcionario.nome || '';
        document.getElementById('usuario').value = funcionario.usuario || '';
        document.getElementById('senha').value = funcionario.senha || '';
        document.getElementById('salario').value = funcionario.salario || '';
        document.getElementById('sexo').value = funcionario.sexo || '';
        document.getElementById('residencia').value = funcionario.residencia || '';
        document.getElementById('nuit').value = funcionario.nuit || '';
        document.getElementById('tipo-funcionario').value = funcionario.tipo_funcionario || '';
        document.getElementById('telefone').value = funcionario.telefone || '';
        document.getElementById('email').value = funcionario.email || '';
        document.getElementById('numero-bi').value = funcionario.numero_bi || '';
        document.getElementById('status').value = funcionario.status || '';
        
        // Armazenar ID do funcionário selecionado
        funcionarioSelecionado = id;
        document.getElementById('funcionarios').setAttribute('data-id', id);
        
        // Atualizar interface
        document.querySelector('.btn-cadastrar').style.display = 'none';
        document.querySelector('.btn-atualizar').style.display = 'inline-block';
        
        mostrarMensagem(`Funcionário ${funcionario.nome} selecionado para edição`, 'info');
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'erro');
    }
}

// Atualizar funcionário
async function atualizarFuncionario() {
    try {
        const id = funcionarioSelecionado;
        if (!id) throw new Error('Nenhum funcionário selecionado para edição');

        // Validar campos obrigatórios
        const camposObrigatorios = [
            'nome-funcionario', 'usuario', 'senha', 'salario', 
            'sexo', 'telefone', 'tipo-funcionario', 'status'
        ];
        
        const camposFaltando = camposObrigatorios.filter(id => {
            const campo = document.getElementById(id);
            return !campo || !campo.value.trim();
        });

        if (camposFaltando.length > 0) {
            throw new Error('Preencha todos os campos obrigatórios');
        }

        // Obter dados do formulário
        const funcionario = {
            nome: document.getElementById('nome-funcionario').value.trim(),
            usuario: document.getElementById('usuario').value.trim(),
            senha: document.getElementById('senha').value.trim(),
            salario: parseFloat(document.getElementById('salario').value),
            sexo: document.getElementById('sexo').value,
            residencia: document.getElementById('residencia').value.trim(),
            nuit: document.getElementById('nuit').value.trim(),
            tipo_funcionario: document.getElementById('tipo-funcionario').value,
            telefone: document.getElementById('telefone').value.trim(),
            email: document.getElementById('email').value.trim(),
            numero_bi: document.getElementById('numero-bi').value.trim(),
            status: document.getElementById('status').value
        };

        // Enviar para a API
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(funcionario)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro ao atualizar funcionário');
        }

        mostrarMensagem('Funcionário atualizado com sucesso!', 'sucesso');
        carregarFuncionarios();
        limparFormulario();
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'erro');
    }
}

// Apagar funcionário
async function apagarFuncionario() {
    try {
        const id = funcionarioSelecionado;
        if (!id) throw new Error('Nenhum funcionário selecionado para exclusão');

        if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
            return;
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir funcionário');
        }

        mostrarMensagem('Funcionário excluído com sucesso!', 'sucesso');
        carregarFuncionarios();
        limparFormulario();
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'erro');
    }
}

// Pesquisar funcionário por ID
async function pesquisarFuncionario() {
    try {
        const id = document.getElementById('pesquisar-funcionario').value.trim();
        if (!id) throw new Error('Digite um ID para pesquisar');

        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        
        const funcionario = await response.json();
        
        const lista = document.getElementById('lista-funcionarios');
        lista.innerHTML = `
            <tr data-id="${funcionario.id}" onclick="selecionarFuncionario(${funcionario.id})">
                <td>${funcionario.id}</td>
                <td>${funcionario.nome || '-'}</td>
                <td>${funcionario.usuario || '-'}</td>
                <td>${funcionario.telefone || '-'}</td>
                <td>••••••••</td>
                <td>${funcionario.numero_bi || '-'}</td>
                <td>${funcionario.email || '-'}</td>
                <td>${funcionario.salario ? `MZN ${funcionario.salario}` : '-'}</td>
                <td>${funcionario.residencia || '-'}</td>
                <td>${funcionario.sexo || '-'}</td>
                <td>${funcionario.tipo_funcionario || '-'}</td>
                <td class="status ${funcionario.status === 'Ativo' ? 'ativo' : 'inativo'}">
                    ${funcionario.status || '-'}
                </td>
            </tr>
        `;
        
        // Adicionar botão para voltar
        const btnVoltar = document.createElement('button');
        btnVoltar.className = 'btn-voltar';
        btnVoltar.innerHTML = '<i class="bi bi-arrow-left"></i> Voltar para todos';
        btnVoltar.onclick = carregarFuncionarios;
        
        lista.parentNode.insertBefore(btnVoltar, lista);
        
        mostrarMensagem('Funcionário encontrado!', 'sucesso');
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'erro');
    }
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('funcionarios').reset();
    document.getElementById('funcionarios').removeAttribute('data-id');
    funcionarioSelecionado = null;
    
    document.querySelector('.btn-cadastrar').style.display = 'inline-block';
    document.querySelector('.btn-atualizar').style.display = 'none';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar event listeners
    document.querySelector('.btn-cadastrar').addEventListener('click', function(event) {
        event.preventDefault();
        cadastrarFuncionario(event);
    });
    document.querySelector('.btn-atualizar').addEventListener('click', atualizarFuncionario);
    document.querySelector('.btn-apagar').addEventListener('click', apagarFuncionario);
    document.querySelector('.btn-pesquisar').addEventListener('click', pesquisarFuncionario);
    
    // Carregar funcionários inicialmente
    carregarFuncionarios();
});