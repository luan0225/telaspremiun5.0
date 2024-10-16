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
let isCarrinhoVisible = false; // Variável para controlar a visibilidade do carrinho

function toggleCarrinho() {
    const carrinhoElement = document.getElementById('itens-carrinho');
    isCarrinhoVisible = !isCarrinhoVisible; // Inverte o estado
    carrinhoElement.style.display = isCarrinhoVisible ? 'block' : 'none'; // Atualiza a visibilidade

    if (isCarrinhoVisible) {
        updateCarrinho(); // Atualiza a lista de itens sempre que o carrinho é aberto
    }
}

function selectOption(button, imagem) {
    const produto = button.innerText;
    const preco = parseFloat(produto.match(/R\$ ([\d,.]+)/)[1].replace(',', '.'));

    console.log('Adicionando item:', produto, 'preço:', preco); // Debugging

    carrinho.push({ produto: produto, imagem: imagem, preco: preco });
    totalCarrinho += preco;

    // Armazenar carrinho e total na localStorage
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

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'item-carrinho';
        li.innerHTML = `
            <img src="${item.imagem}" alt="${item.produto}">
            <span>${item.produto}</span> <!-- Exibe apenas o nome do produto -->
            <div>
                <button class="remove-button" onclick="removeItem(${index})">Remover</button>
            </div>
        `;
        listaItens.appendChild(li);
    });

    // Atualiza o total do carrinho
    document.getElementById('total-carrinho').innerText = 'Total: R$ ' + totalCarrinho.toFixed(2).replace('.', ',');
}

function removeItem(index) {
    totalCarrinho -= carrinho[index].preco;
    carrinho.splice(index, 1);
    
    // Atualizar localStorage após remoção
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toFixed(2));

    updateCarrinho();
}

function toggleOpcoes(button) {
    const opcoes = button.nextElementSibling;
    opcoes.style.display = opcoes.style.display === 'block' ? 'none' : 'block';
}

// Inicializar o carrossel
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');

function showNextImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
}

// Define um intervalo para mudar a imagem do carrossel a cada 3 segundos
setInterval(showNextImage, 3000);

function finalizarCompra(event) {
    event.stopPropagation(); // Impede que o clique no botão feche o carrinho
    
    // Salva o carrinho no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toFixed(2));

    // Redireciona para a página de checkout
    window.location.href = 'checkout.html';
    
    // Limpar localStorage após finalizar a compra, se desejado
    localStorage.removeItem('carrinho');
    localStorage.removeItem('totalCarrinho');
}

// Função para enviar os dados do carrinho via WhatsApp
function enviarDadosWhatsApp() {
    const nome = document.getElementById('nome').value;
    const formaPagamento = document.getElementById('forma-pagamento').value;
    const telefone = document.getElementById('telefone').value;

    let mensagem = `Nome: ${nome}\nForma de pagamento: ${formaPagamento}\nTelefone: ${telefone}\n\nProdutos:\n`;

    // Adiciona produtos com nome e valor à mensagem
    carrinho.forEach(item => {
        mensagem += `${item.produto} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\nTotal: R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;

    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Cria o link do WhatsApp
    const linkWhatsApp = `https://wa.me/5592994289392?text=${mensagemCodificada}`;

    // Redireciona para o WhatsApp
    window.open(linkWhatsApp, '_blank');
}
