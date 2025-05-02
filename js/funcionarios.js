

// Função para carregar funcionários
function carregarFuncionarios() {
    fetch('http://localhost:3000/api/funcionarios')
        .then(response => response.json())
        .then(funcionarios => {
            const lista = document.getElementById('lista-funcionarios');
            lista.innerHTML = ''; // Limpa a tabela antes de adicionar os dados

            funcionarios.forEach(funcionario => {
                const row = `
                    <tr>
                        <td>${funcionario.id}</td>
                        <td>${funcionario.nome}</td>
                        <td>${funcionario.usuario}</td>
                        <td>${funcionario.telefone}</td>
                        <td>${funcionario.senha}</td>
                        <td>${funcionario.numero_bi}</td>
                        <td>${funcionario.email}</td>
                        <td>${funcionario.salario}</td>
                        <td>${funcionario.residencia}</td>
                        <td>${funcionario.sexo}</td>
                        <td>${funcionario.tipo_funcionario}</td>
                        <td>${funcionario.status}</td>
                    </tr>
                `;
                lista.innerHTML += row;
            });
        })
        .catch(err => console.error('Erro ao carregar funcionários:', err));
}

// Carregar funcionários ao iniciar
carregarFuncionarios();












//btn cadastrar funcionario
document.querySelector('.btn-cadastrar').addEventListener('click', function (e) {
    e.preventDefault();

    // Validação: Verificar se todos os campos estão preenchidos
    const campos = ['nome-funcionario', 'usuario', 'senha', 'salario', 'sexo', 'residencia', 'nuit', 'tipo-funcionario', 'telefone', 'email', 'numero-bi', 'status'];
    for (const campo of campos) {
        const valor = document.getElementById(campo).value.trim();
        console.log(`Campo: ${campo}, Valor: "${valor}"`); // Adicionado para depuração
        if (!valor) {
            alert(`Por favor, preencha o campo: ${campo}`);
            return;
        }
    }

    const funcionario = {
        nome: document.getElementById('nome-funcionario').value,
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value,
        salario: document.getElementById('salario').value,
        sexo: document.getElementById('sexo').value,
        residencia: document.getElementById('residencia').value,
        nuit: document.getElementById('nuit').value,
        tipo_funcionario: document.getElementById('tipo-funcionario').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        numero_bi: document.getElementById('numero-bi').value,
        status: document.getElementById('status').value
    };

    fetch('http://localhost:3000/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario)
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarFuncionarios(); // Atualiza a tabela
            document.getElementById('funcionarios').reset(); // Limpa o formulário
        })
        .catch(err => console.error('Erro ao cadastrar funcionário:', err));
});










//btn-editar funcionario

document.querySelector('.btn-editar').addEventListener('click', function () {
    const id = document.getElementById('funcionarios').getAttribute('data-id');

    if (!id) {
        alert('Nenhum funcionário selecionado para edição.');
        return;
    }

    fetch(`http://localhost:3000/api/funcionarios/${id}`)
        .then(response => response.json())
        .then(funcionario => {
            if (!funcionario) {
                alert('Funcionário não encontrado.');
                return;
            }

            // Preenche os campos do formulário
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
        })
        .catch(err => console.error('Erro ao buscar funcionário:', err));
});












//btn-atualizar funcionario

document.querySelector('.btn-atualizar').addEventListener('click', function () {
    const id = document.getElementById('funcionarios').getAttribute('data-id');

    if (!id) {
        alert('Nenhum funcionário selecionado para atualização.');
        return;
    }

    // Validação: Verificar se todos os campos estão preenchidos
    const campos = ['nome-funcionario', 'usuario', 'senha', 'salario', 'sexo', 'residencia', 'nuit', 'tipo-funcionario', 'telefone', 'email', 'numero-bi', 'status'];
    for (const campo of campos) {
        if (!document.getElementById(campo).value.trim()) {
            alert(`Por favor, preencha o campo: ${campo}`);
            return;
        }
    }

    const funcionario = {
        nome: document.getElementById('nome-funcionario').value,
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value,
        salario: document.getElementById('salario').value,
        sexo: document.getElementById('sexo').value,
        residencia: document.getElementById('residencia').value,
        nuit: document.getElementById('nuit').value,
        tipo_funcionario: document.getElementById('tipo-funcionario').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        numero_bi: document.getElementById('numero-bi').value,
        status: document.getElementById('status').value
    };

    fetch(`http://localhost:3000/api/funcionarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario)
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarFuncionarios(); // Atualiza a tabela
            document.getElementById('funcionarios').reset(); // Limpa o formulário
            document.getElementById('funcionarios').removeAttribute('data-id'); // Remove o ID armazenado
        })
        .catch(err => console.error('Erro ao atualizar funcionário:', err));
});











//btn-apagar funcionario

document.querySelector('.btn-apagar').addEventListener('click', function () {
    const id = document.getElementById('funcionarios').getAttribute('data-id');

    if (!id) {
        alert('Nenhum funcionário selecionado para exclusão.');
        return;
    }

    fetch(`http://localhost:3000/api/funcionarios/${id}`, { method: 'DELETE' })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarFuncionarios(); // Atualiza a tabela
            document.getElementById('funcionarios').reset(); // Limpa o formulário
            document.getElementById('funcionarios').removeAttribute('data-id'); // Remove o ID armazenado
        })
        .catch(err => console.error('Erro ao deletar funcionário:', err));
});






//btn-pesquisar funcionario

document.querySelector('.btn-pesquisar').addEventListener('click', function () {
    const id = document.getElementById('pesquisar-funcionario').value.trim();

    if (!id) {
        alert('Por favor, insira um ID válido para pesquisar.');
        return;
    }

    fetch(`http://localhost:3000/api/funcionarios/${id}`)
        .then(response => response.json())
        .then(funcionario => {
            if (!funcionario) {
                alert('Funcionário não encontrado.');
                return;
            }

            // Exibe o funcionário na tabela
            const lista = document.getElementById('lista-funcionarios');
            lista.innerHTML = ''; // Limpa a tabela antes de adicionar o resultado da pesquisa

            const row = `
                <tr onclick="selecionarFuncionario(${funcionario.id})">
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.usuario}</td>
                    <td>${funcionario.telefone}</td>
                    <td>${funcionario.senha}</td>
                    <td>${funcionario.numero_bi}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.salario}</td>
                    <td>${funcionario.residencia}</td>
                    <td>${funcionario.sexo}</td>
                    <td>${funcionario.tipo_funcionario}</td>
                    <td>${funcionario.status}</td>
                </tr>
            `;
            lista.innerHTML += row;
        })
        .catch(err => console.error('Erro ao buscar funcionário:', err));
});

function selecionarFuncionario(id) {
    // Armazena o ID do funcionário no formulário
    document.getElementById('funcionarios').setAttribute('data-id', id);
    alert(`Funcionário com ID ${id} selecionado. Agora você pode clicar em "Editar".`);
}


// Carregar funcionários ao iniciar
carregarFuncionarios();