// Dados de produtos simulados
const carrinho = [
    { produto: "Produto 1", preco: 29.99 },
    { produto: "Produto 2", preco: 19.99 }
];

// Cupom válido e desconto
const cupomValido = "DESCONTO10";
const desconto = 0.10; // 10%

// Função para calcular o total com ou sem desconto
function calcularTotal(carrinho, cupom) {
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);

    if (cupom === cupomValido) {
        total -= total * desconto;
    }

    return total;
}

// Função para formatar o valor como moeda
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Função para montar a mensagem do pedido
function gerarMensagem(nome, formaPagamento, telefone, cupom, total) {
    let mensagem = `
Nome: ${nome}
Forma de pagamento: ${formaPagamento}
Telefone: ${telefone}
Produtos:
`;

    carrinho.forEach(item => {
        mensagem += `- ${item.produto}: ${formatarMoeda(item.preco)}\n`;
    });

    if (cupom === cupomValido) {
        const valorDesconto = total * desconto;
        mensagem += `
Cupom aplicado: ${cupomValido}
Desconto: ${formatarMoeda(valorDesconto)}
`;
    }

    mensagem += `\nTotal: ${formatarMoeda(total)}`;

    return mensagem;
}

// Função para validar os campos do formulário
function validarCampos(nome, formaPagamento, telefone) {
    if (!nome || !formaPagamento || !telefone) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
}

// Evento de envio do formulário
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const nome = document.getElementById('nome').value.trim();
    const formaPagamento = document.getElementById('forma-pagamento').value;
    const telefone = document.getElementById('telefone').value.trim();
    const cupom = document.getElementById('cupom').value.trim();

    // Valida os campos
    if (!validarCampos(nome, formaPagamento, telefone)) return;

    // Calcula o total
    const total = calcularTotal(carrinho, cupom);

    // Gera a mensagem
    const mensagem = gerarMensagem(nome, formaPagamento, telefone, cupom, total);

    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Cria o link do WhatsApp
    const linkWhatsApp = `https://wa.me/5592994289392?text=${mensagemCodificada}`;

    // Redireciona para o WhatsApp
    window.open(linkWhatsApp, '_blank');
});
