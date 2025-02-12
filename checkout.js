// Simulação de produtos no carrinho
const carrinho = [
    { produto: "Produto 1", preco: 29.99 },
    { produto: "Produto 2", preco: 19.99 }
];

// Definição de cupom válido e o valor do desconto
const cupomValido = "DESCONTO10"; // Cupom de exemplo
const desconto = 0.10; // 10% de desconto

document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const formaPagamento = document.getElementById('forma-pagamento').value;
    const telefone = document.getElementById('telefone').value;
    const cupom = document.getElementById('cupom').value.trim(); // Captura o cupom

    // Criar uma mensagem com as informações do formulário
    let mensagem = `Nome: ${nome}\nForma de pagamento: ${formaPagamento}\nTelefone: ${telefone}\n\nProdutos:\n`;

    // Calcula o total
    let total = 0;
    carrinho.forEach(item => {
        total += item.preco;
    });

    // Verifica se o cupom é válido e aplica o desconto
    if (cupom === cupomValido) {
        total -= total * desconto; // Aplica o desconto de 10%
        mensagem += `\nCupom aplicado: ${cupomValido}\nDesconto: R$ ${(total * desconto).toFixed(2).replace('.', ',')}\n`;
    }

    // Adiciona o total à mensagem
    mensagem += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n`;

    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Cria o link do WhatsApp
    const linkWhatsApp = `https://wa.me/5592994289392?text=${mensagemCodificada}`;

    // Redireciona para o WhatsApp
    window.open(linkWhatsApp, '_blank');
});
