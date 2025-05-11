function toggleSenha(btn) {
    const input = btn.parentNode.querySelector('input');
    const icone = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icone.classList.remove('bi-eye-fill');
        icone.classList.add('bi-eye-slash-fill');
    } else {
        input.type = 'password';
        icone.classList.add('bi-eye-fill');
        icone.classList.remove('bi-eye-slash-fill');
    }
}



/**
 * Exibe mensagem animada acima do formulário de login
 * @param {string} mensagem 
 * @param {'erro'|'sucesso'} tipo 
 */
function mostrarMensagem(mensagem, tipo = 'erro') {
    const msg = document.getElementById('mensagem-erro');
    msg.textContent = mensagem;
    msg.style.display = 'block';
    msg.style.background = tipo === 'sucesso' ? '#dafbe1' : '#fde8ec';
    msg.style.color = tipo === 'sucesso' ? '#116329' : '#b3261e';
    msg.style.border = tipo === 'sucesso' ? '1.5px solid #72d072' : '1.5px solid #b3261e';
    msg.style.transition = 'all 0.25s';
    setTimeout(() => {
        msg.style.opacity = 0.2;
        setTimeout(() => {
            msg.style.display = 'none';
            msg.style.opacity = 1;
        }, 800);
    }, tipo === 'sucesso' ? 1400 : 2600);
}
 
function toggleSenha(btn) {
    const input = btn.parentNode.querySelector('input');
    const icone = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icone.classList.remove('bi-eye-fill');
        icone.classList.add('bi-eye-slash-fill');
    } else {
        input.type = 'password';
        icone.classList.add('bi-eye-fill');
        icone.classList.remove('bi-eye-slash-fill');
    }
}

async function validarLogin(e) {
    e.preventDefault();
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('senha').value.trim();

    if (!user || !pass) {
        mostrarMensagem('Por favor, preencha o usuário e a senha.', 'erro');
        return false;
    }

    try {
        const res = await fetch('http://localhost:3000/api/login-funcionario', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: user, senha: pass })
        });
        const data = await res.json();

        if (!res.ok) {
            mostrarMensagem(data.error || 'Erro desconhecido. Tente novamente.', 'erro');
            return false;
        }

        // Salva os dados do funcionário no localStorage
        localStorage.setItem('funcionarioId', data.funcionario.id);
        localStorage.setItem('funcionarioNome', data.funcionario.nome);
        localStorage.setItem('tipoFuncionario', data.funcionario.tipo_funcionario);

        // Login correto; redireciona conforme o tipo_funcionario
        mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'sucesso');
        setTimeout(() => {
            if (data.funcionario.tipo_funcionario === 'Gerente') {
                window.location.href = 'admin.html';
            } else if (data.funcionario.tipo_funcionario === 'Atendente') {
                window.location.href = 'funcionario.html';
            }else {
                mostrarMensagem('Tipo de funcionário não reconhecido.', 'erro');
            }
        }, 1100);
        return false;
    } catch (err) {
        mostrarMensagem('Falha de conexão com servidor.', 'erro');
        return false;
    }
}