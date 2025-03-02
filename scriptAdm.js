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
        const purchaseInfo = parsePurchaseInfo(purchaseText);
        purchaseInfo.customerName = customerName;
        purchaseInfo.customerPhone = customerPhone;

        if (purchaseInfo) {
            // Calcular a data de expiração (30 dias a partir de hoje)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30); // Adiciona 30 dias
            purchaseInfo.expiration = expirationDate.toLocaleDateString(); // Formato: dd/mm/aaaa

            const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
            storedPurchases.push(purchaseInfo);
            localStorage.setItem('purchases', JSON.stringify(storedPurchases));

            updatePurchaseTable();
            updateAccountCount();

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

// Função para extrair as informações do texto da compra
function parsePurchaseInfo(purchaseText) {
    const screenNameRegex = /🛍 TELA (.*?) 🛍/;
    const emailRegex = /📧 EMAIL: (.*?)\n/;
    const passwordRegex = /🔑 SENHA: (.*?)\n/;

    const screenNameMatch = purchaseText.match(screenNameRegex);
    const emailMatch = purchaseText.match(emailRegex);
    const passwordMatch = purchaseText.match(passwordRegex);

    if (screenNameMatch && emailMatch && passwordMatch) {
        return {
            screenName: screenNameMatch[1],
            email: emailMatch[1],
            password: passwordMatch[1]
        };
    } else {
        return null;
    }
}

// Função para atualizar a contagem de contas vendidas
function updateAccountCount() {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    document.getElementById('accountCount').textContent = storedPurchases.length;
}

// Função para remover uma compra
function removePurchase(index) {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    storedPurchases.splice(index, 1); // Remove a compra no índice especificado
    localStorage.setItem('purchases', JSON.stringify(storedPurchases)); // Atualiza o LocalStorage
    updatePurchaseTable(); // Atualiza a tabela
    updateAccountCount(); // Atualiza a contagem de contas
}

// Função para copiar a informação de login
function copyMessage(purchaseInfo) {
    const message = `Olá ${purchaseInfo.customerName},\n\nSua compra foi realizada com sucesso\n\nEmail: ${purchaseInfo.email}\nSenha: ${purchaseInfo.password}\n\nTela de acesso único, não use em dois aparelhos, sujeito a perder o acesso.\n\nData de expiração: ${purchaseInfo.expiration}\n\nAgradecemos a preferência.`;
    navigator.clipboard.writeText(message).then(() => {
        alert('Informações de login copiadas!');
    });
}

// Função para alterar a data de expiração
function changeExpirationDate(index) {
    const newExpiration = prompt("Digite a nova data de expiração (formato: dd/mm/aaaa):");
    if (newExpiration) {
        const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
        storedPurchases[index].expiration = newExpiration;
        localStorage.setItem('purchases', JSON.stringify(storedPurchases));
        updatePurchaseTable();
    } else {
        alert('Data inválida!');
    }
}

window.onload = function () {
    updatePurchaseTable();
    updateAccountCount();
};