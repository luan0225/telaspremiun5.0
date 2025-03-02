let generatedMessage = ""; // Variável para armazenar a mensagem gerada

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

function parsePurchaseInfo(text, customerName, customerPhone) {
    const emailRegex = /📧 EMAIL:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const passwordRegex = /🔑 SENHA:\s*([^\n]+)/i;
    const screenNameRegex = /🛍 TELA (.+?) 🛍/i;

    const emailMatch = text.match(emailRegex);
    const passwordMatch = text.match(passwordRegex);
    const screenNameMatch = text.match(screenNameRegex);

    if (emailMatch && passwordMatch && screenNameMatch) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30); // Adiciona 30 dias
        const expirationDateFormatted = `${expirationDate.getDate()}/${expirationDate.getMonth() + 1}/${expirationDate.getFullYear()}`;

        return {
            customerName: customerName,
            customerPhone: customerPhone,
            email: emailMatch[1],
            password: passwordMatch[1],
            screenName: screenNameMatch[1].trim(),
            expiration: expirationDateFormatted
        };
    } else {
        return null;
    }
}

function updatePurchaseTable() {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const tableBody = document.getElementById('infoTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

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

function removePurchase(index) {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    storedPurchases.splice(index, 1);
    localStorage.setItem('purchases', JSON.stringify(storedPurchases));
    updatePurchaseTable();
    updateAccountCount();  // Atualiza a contagem de contas vendidas
}

function changeExpirationDate(index) {
    const newExpirationDate = prompt('Digite a nova data de expiração (DD/MM/YYYY):');
    if (newExpirationDate) {
        const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
        const purchase = storedPurchases[index];
        
        // Valida o formato da data
        const dateParts = newExpirationDate.split('/');
        if (dateParts.length === 3 && !isNaN(new Date(newExpirationDate).getTime())) {
            purchase.expiration = newExpirationDate;
            localStorage.setItem('purchases', JSON.stringify(storedPurchases));
            updatePurchaseTable();
        } else {
            alert('Formato de data inválido! Utilize DD/MM/YYYY.');
        }
    }
}

function copyMessage(purchaseInfo) {
    const message = `Olá, ${purchaseInfo.customerName}!\n\nSua compra foi processada com sucesso. Aqui estão os detalhes da sua compra:\n\n` +
                    `- **Email**: ${purchaseInfo.email}\n` +
                    `- **Senha**: ${purchaseInfo.password}\n` +
                    `- **Nome da Tela**: ${purchaseInfo.screenName}\n` +
                    `- **Data de Expiração**: ${purchaseInfo.expiration}\n\n` +
                    `tela para somente um dispositivo, nao use em dois aparelhos sujeito a perder acesso a conta \n\n` +
                    `Obrigado por comprar conosco!\n\nAtenciosamente,\n[Telas Strem]`;

    const textArea = document.createElement('textarea');
    textArea.value = message;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Mensagem copiada com sucesso!');
}

function searchCustomer() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('infoTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        
        if (name.includes(searchInput) || email.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateAccountCount() {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    document.getElementById('accountCount').textContent = storedPurchases.length;
}

window.onload = function () {
    updatePurchaseTable();
    updateAccountCount();  // Inicializa a contagem de contas vendidas
};
