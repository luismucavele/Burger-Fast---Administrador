
let funcionarioSelecionado = null;
let linhaSelecionada = null; // Para destacar linha na tabela

const API_URL = 'http://localhost:3000/api/funcionarios';

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

// Funções de validação
function validarNome(nome) {
    // Aceita letras (com ou sem acento) e espaços, pelo menos 2 caracteres
    return /^[A-Za-zÀ-ÿ\s]{4,}$/.test(nome);
}

function validarCelular(celular) {
    // Moçambicano: começa com 82, 83, 84, 85, 86, 87 ou 88 e mais 7 dígitos
    return /^(82|83|84|85|86|87|88)\d{7}$/.test(celular);
}

function validarNuit(nuit) {
    // Exatamente 9 dígitos
    return /^\d{9}$/.test(nuit);
}

function validarBI(bi) {
    // 11 dígitos + 1 letra (total 12 caracteres)
    return /^\d{11}[A-Za-z]$/.test(bi);
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
        
        const ativos = funcionarios.filter(func => func.status === 'Ativo');
        lista.innerHTML = ativos.length > 0
            ? ativos.map(func => `
                <tr data-id="${func.id}" class="tr-funcionario" onclick="selecionarFuncionario(${func.id})">
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
                    <td class="status ativo">
                        Ativo
                    </td>
                </tr>
            `).join('')
            : '<tr><td colspan="12">Nenhum funcionário ativo cadastrado</td></tr>';

            const totalAtivos = funcionarios.filter(func => func.status === 'Ativo').length;
            atualizarTotalFuncionarios(totalAtivos);
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

        // Validações específicas
        const nome = document.getElementById('nome-funcionario').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const nuit = document.getElementById('nuit').value.trim();
        const numero_bi = document.getElementById('numero-bi').value.trim();

        if (!validarNome(nome)) {
            mostrarMensagem('O nome deve conter apenas letras e ter pelo menos 2 caracteres.', 'erro');
            return;
        }
        if (!validarCelular(telefone)) {
            mostrarMensagem('O celular deve ser moçambicano e ter o formato correto, ex: 841234567.', 'erro');
            return;
        }
        if (nuit && !validarNuit(nuit)) {
            mostrarMensagem('O NUIT deve conter exatamente 9 dígitos numéricos.', 'erro');
            return;
        }
        if (numero_bi && !validarBI(numero_bi)) {
            mostrarMensagem('O BI deve conter 11 números seguidos de 1 letra. Ex: 12345678901A', 'erro');
            return;
        }

        // Obter dados do formulário
        const funcionario = {
            nome,
            usuario: document.getElementById('usuario').value.trim(),
            senha: document.getElementById('senha').value.trim(),
            salario: parseFloat(document.getElementById('salario').value),
            sexo: document.getElementById('sexo').value,
            residencia: document.getElementById('residencia').value.trim(),
            nuit,
            tipo_funcionario: document.getElementById('tipo-funcionario').value,
            telefone,
            email: document.getElementById('email').value.trim(),
            numero_bi,
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
        // Remover destaque antigo e marcar novo
        if (linhaSelecionada) {
            linhaSelecionada.classList.remove('selected');
        }
        const lista = document.getElementById('lista-funcionarios');
        linhaSelecionada = lista.querySelector(`tr[data-id="${id}"]`);
        if (linhaSelecionada) {
            linhaSelecionada.classList.add('selected');
        }

        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        
        const funcionario = await response.json();
        
        // Preencher formulário e mostrar a senha
        document.getElementById('nome-funcionario').value = funcionario.nome || '';
        document.getElementById('usuario').value = funcionario.usuario || '';
        document.getElementById('senha').value = funcionario.senha || '';
        document.getElementById('senha').type = 'text'; // Mostrar a senha ao editar funcionário
        document.getElementById('salario').value = funcionario.salario || '';
        document.getElementById('sexo').value = funcionario.sexo || '';
        document.getElementById('residencia').value = funcionario.residencia || '';
        document.getElementById('nuit').value = funcionario.nuit || '';
        document.getElementById('tipo-funcionario').value = funcionario.tipo_funcionario || '';
        document.getElementById('telefone').value = funcionario.telefone || '';
        document.getElementById('email').value = funcionario.email || '';
        document.getElementById('numero-bi').value = funcionario.numero_bi || '';
        document.getElementById('status').value = funcionario.status || '';
        
        funcionarioSelecionado = id;
        document.getElementById('funcionarios').setAttribute('data-id', id);
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

        // Validações específicas
        const nome = document.getElementById('nome-funcionario').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const nuit = document.getElementById('nuit').value.trim();
        const numero_bi = document.getElementById('numero-bi').value.trim();

        if (!validarNome(nome)) {
            mostrarMensagem('O nome deve conter apenas letras e ter pelo menos 2 caracteres.', 'erro');
            return;
        }
        if (!validarCelular(telefone)) {
            mostrarMensagem('O celular deve ser moçambicano e ter o formato correto, ex: 841234567.', 'erro');
            return;
        }
        if (nuit && !validarNuit(nuit)) {
            mostrarMensagem('O NUIT deve conter exatamente 9 dígitos numéricos.', 'erro');
            return;
        }
        if (numero_bi && !validarBI(numero_bi)) {
            mostrarMensagem('O BI deve conter 11 números seguidos de 1 letra. Ex: 12345678901A', 'erro');
            return;
        }

        // Obter dados do formulário
        const funcionario = {
            nome,
            usuario: document.getElementById('usuario').value.trim(),
            senha: document.getElementById('senha').value.trim(),
            salario: parseFloat(document.getElementById('salario').value),
            sexo: document.getElementById('sexo').value,
            residencia: document.getElementById('residencia').value.trim(),
            nuit,
            tipo_funcionario: document.getElementById('tipo-funcionario').value,
            telefone,
            email: document.getElementById('email').value.trim(),
            numero_bi,
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

    // Retornar o input de senha para tipo password
    document.getElementById('senha').type = 'password';

    // Remover destaque da linha na tabela
    if (linhaSelecionada) {
        linhaSelecionada.classList.remove('selected');
        linhaSelecionada = null;
    }
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
