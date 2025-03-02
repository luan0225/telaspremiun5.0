// Função para atualizar a tabela de compras
function updatePurchaseTable() {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const tableBody = document.getElementById('infoTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpa a tabela antes de atualizá-la

    if (storedPurchases.length === 0) {
        const noDataRow = tableBody.insertRow();
        const noDataCell = noDataRow.insertCell(0);
        noDataCell.colSpan = 7; // Ocupa todas as colunas
        noDataCell.textContent = 'Nenhuma compra registrada.';
    }

    storedPurchases.forEach((purchaseInfo, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = purchaseInfo.customerName;
        row.insertCell(1).textContent = purchaseInfo.customerPhone;
        row.insertCell(2).textContent = purchaseInfo.email;
        row.insertCell(3).textContent = purchaseInfo.password;
        row.insertCell(4).textContent = purchaseInfo.screenName;
        row.insertCell(5).textContent = purchaseInfo.expiration;

        const actionCell = row.insertCell(6);
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        // Botão de Remover
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remover';
        deleteButton.onclick = function () {
            removePurchase(index);
        };

        // Botão de Copiar Login
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copiar Login';
        copyButton.onclick = function () {
            copyMessage(purchaseInfo);
        };

        // Botão de Alterar Data de Expiração
        const editDateButton = document.createElement('button');
        editDateButton.textContent = 'Alterar Data de Expiração';
        editDateButton.onclick = function () {
            changeExpirationDate(index);
        };

        actionButtons.appendChild(deleteButton);
        actionButtons.appendChild(copyButton);
        actionButtons.appendChild(editDateButton);
        actionCell.appendChild(actionButtons);
    });
}

// Função para salvar a compra no LocalStorage
function savePurchaseInfo() {
    const purchaseText = document.getElementById('purchaseText').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;

    if (purchaseText && customerName && customerPhone) {
        const purchaseInfo = parsePurchaseInfo(purchaseText, customerName, customerPhone);
        
        if (purchaseInfo) {
            // Armazenar as informações no LocalStorage
            const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
            storedPurchases.push(purchaseInfo);
            localStorage.setItem('purchases', JSON.stringify(storedPurchases));

            // Atualiza a tabela com os dados armazenados
            updatePurchaseTable();

            // Atualiza a contagem de contas vendidas
            updateAccountCount();

            // Limpar os campos
            document.getElementById('purchaseText').value = '';
            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
        } else {
            alert('Não foi possível extrair as informações da compra.');
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para exibir a contagem de contas vendidas
function updateAccountCount() {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    document.getElementById('accountCount').textContent = storedPurchases.length;
}

window.onload = function () {
    updatePurchaseTable();
    updateAccountCount();  // Inicializa a contagem de contas vendidas
};
