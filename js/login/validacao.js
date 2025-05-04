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
function validarLogin(e) {
    e.preventDefault();
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('senha').value.trim();
    const msg = document.getElementById('mensagem-erro');
    if (!user || !pass) {
        msg.textContent = 'Por favor, preencha o usuário e a senha.';
        msg.style.display = 'block';
        return false;
    } else {
        msg.style.display = 'none';
        // Aqui você faria a autenticação real
        alert('Login solicitado para: ' + user); // remove isso depois
        return false;
    }
}