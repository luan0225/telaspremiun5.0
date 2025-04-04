// Dados simulados do carrinho
const carrinho = [
    { produto: "Produto 1", preco: 29.99 },
    { produto: "Produto 2", preco: 19.99 }
];

// Cupons de desconto
const cupons = {
    "JOANE": 0.05,      // 10% de desconto
    "CLIENTEVIP": 0.50,  // 50% de desconto
    "JOANE": 0.05        // 5% de desconto
};

// Função para calcular o total com cupom
function calcularTotal(carrinho, cupom) {
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);

    console.log(`Total original: R$ ${total.toFixed(2)}`);
    console.log(`Cupom digitado: ${cupom}`);

    if (cupons[cupom]) {
        let desconto = total * cupons[cupom]; // Aplica o desconto corretamente
        total -= desconto;
        console.log(`Desconto de ${cupons[cupom] * 100}% aplicado: R$ ${desconto.toFixed(2)}`);
    } else {
        console.log("Nenhum cupom válido aplicado.");
    }

    return total;
}

// Função para formatar o valor como moeda
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Função para gerar a mensagem do pedido
function gerarMensagem(nome, formaPagamento, telefone, cupom, total) {
    let mensagem = `Nome: ${nome}\nForma de pagamento: ${formaPagamento}\nTelefone: ${telefone}\nProdutos:\n`;

    carrinho.forEach(item => {
        mensagem += `- ${item.produto}: ${formatarMoeda(item.preco)}\n`;
    });

    if (cupons[cupom]) {
        let valorDesconto = (carrinho.reduce((acc, item) => acc + item.preco, 0)) * cupons[cupom];
        mensagem += `\nCupom aplicado: ${cupom}\nDesconto: ${formatarMoeda(valorDesconto)}\n`;
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
    const cupom = document.getElementById('cupom').value.trim().toUpperCase(); // Normaliza o cupom

    // Valida os campos
    if (!validarCampos(nome, formaPagamento, telefone)) return;

    // Calcula o total com ou sem cupom
    const total = calcularTotal(carrinho, cupom);

    // Gera a mensagem do pedido
    const mensagem = gerarMensagem(nome, formaPagamento, telefone, cupom, total);

    // Cria o link do WhatsApp e redireciona
    const linkWhatsApp = `https://wa.me/5592984011876?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
