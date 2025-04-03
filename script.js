document.addEventListener('DOMContentLoaded', () => {
    const catalogoLink = document.getElementById('catalogo-link');
    const combosLink = document.getElementById('combos-link');
    const catalogoSection = document.getElementById('catalogo');
    const combosSection = document.getElementById('combos');

    catalogoLink.addEventListener('click', (event) => {
        event.preventDefault();
        catalogoSection.style.display = 'block';
        combosSection.style.display = 'none';
    });

    combosLink.addEventListener('click', (event) => {
        event.preventDefault();
        catalogoSection.style.display = 'none';
        combosSection.style.display = 'block';
    });
});

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let totalCarrinho = parseFloat(localStorage.getItem('totalCarrinho')) || 0;
let isCarrinhoVisible = false;

function toggleCarrinho() {
    const carrinhoElement = document.getElementById('itens-carrinho');
    isCarrinhoVisible = !isCarrinhoVisible;
    carrinhoElement.style.display = isCarrinhoVisible ? 'block' : 'none';

    if (isCarrinhoVisible) {
        updateCarrinho();
    }
}

function selectOption(button, imagem) {
    const produto = button.innerText;
    const preco = parseFloat(produto.match(/R\$ ([\d,.]+)/)[1].replace(',', '.'));

    carrinho.push({ produto: produto, imagem: imagem, preco: preco });
    totalCarrinho += preco;

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toFixed(2));

    updateCarrinho();

    if (!isCarrinhoVisible) {
        isCarrinhoVisible = true;
        document.getElementById('itens-carrinho').style.display = 'block';
    }
}

function updateCarrinho() {
    const listaItens = document.getElementById('lista-itens');
    listaItens.innerHTML = '';

    // Recalcula o total do carrinho
    totalCarrinho = 0;

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'item-carrinho';
        li.innerHTML = `
            <img src="${item.imagem}" alt="${item.produto}">
            <span>${item.produto}</span>
            <div>
                <button class="remove-button" onclick="removeItem(${index})">Remover</button>
            </div>
        `;
        listaItens.appendChild(li);

        // Soma o preço de cada item no total
        totalCarrinho += item.preco;
    });

    // Garante que o totalCarrinho não será negativo
    totalCarrinho = Math.max(0, totalCarrinho);

    // Atualiza o total exibido no carrinho
    document.getElementById('total-carrinho').innerText = 'Total: R$ ' + totalCarrinho.toFixed(2).replace('.', ',');
}

function removeItem(index) {
    // Subtrai o preço do item removido
    totalCarrinho -= carrinho[index].preco;

    // Remove o item do carrinho
    carrinho.splice(index, 1);

    // Armazena novamente no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toFixed(2));

    // Atualiza o carrinho na interface
    updateCarrinho();
}

function toggleOpcoes(button) {
    const opcoes = button.nextElementSibling;
    opcoes.style.display = opcoes.style.display === 'block' ? 'none' : 'block';
}

let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');

function showNextImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
}

setInterval(showNextImage, 3000);

function finalizarCompra(event) {
    event.stopPropagation();

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toFixed(2));

    window.location.href = 'checkout.html';
}

// Função para enviar os dados do carrinho via WhatsApp
function enviarDadosWhatsApp() {
    const nome = document.getElementById('nome').value;
    const formaPagamento = document.getElementById('forma-pagamento').value;
    const telefone = document.getElementById('telefone').value;

    let mensagem = `Nome: ${nome}\nForma de pagamento: ${formaPagamento}\nTelefone: ${telefone}\n\nProdutos:\n`;

    carrinho.forEach(item => {
        mensagem += `${item.produto} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\nTotal: R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/5592984011876?text=${mensagemCodificada}`;

    window.open(linkWhatsApp, '_blank');
}

document.addEventListener("DOMContentLoaded", function() {
    let promoModal = document.getElementById("promoModal");

    // Exibe o modal apenas uma vez por sessão
    if (!sessionStorage.getItem("promoExibida")) {
        promoModal.style.display = "flex";
        sessionStorage.setItem("promoExibida", "true");
    }
});

// Fecha o modal
function fecharModal() {
    document.getElementById("promoModal").style.display = "none";
}

function enviarWhatsApp() {
    let numero = "5592984011876"; // Seu número de WhatsApp com DDD e código do país (55 para Brasil)
    let mensagem = encodeURIComponent("Olá! Quero aproveitar a promoção Disney+ por R$ 12,00 até 05/04!");
    
    let url = `https://wa.me/${numero}?text=${mensagem}`;
    
    window.open(url, "_blank");
}


