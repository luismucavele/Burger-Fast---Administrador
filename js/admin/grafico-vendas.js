document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('grafico-vendas');
    if (!canvas) return;

    fetch('http://localhost:3000/api/vendas-mensais')
        .then(r => r.json())
        .then(dados => {
            // Garante que todos os meses do ano estejam presentes (mesmo sem vendas)
            const nomesMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const anoAtual = new Date().getFullYear();
            const totaisPorMes = Array(12).fill(0);

            dados.forEach(item => {
                const [ano, mes] = item.mes.split('-');
                if (parseInt(ano) === anoAtual) {
                    totaisPorMes[parseInt(mes, 10) - 1] = Number(item.total);
                }
            });

            // Cria o gráfico de linha
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: nomesMes.map(m => `${m}/${anoAtual}`),
                    datasets: [{
                        label: 'Vendas Mensais (MZN)',
                        data: totaisPorMes,
                        fill: false,
                        borderColor: '#008000',
                        backgroundColor: '#008000',
                        tension: 0.3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#008000',
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        title: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }).replace('MTn', 'MZN').replace('MT', 'MZN');
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(() => {
            canvas.parentElement.innerHTML = '<p style="color:red;">Erro ao carregar gráfico de vendas.</p>';
        });
});