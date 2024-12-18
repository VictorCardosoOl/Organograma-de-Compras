let casaIdCounter = 1; // Contador para IDs de Itens de Casa
let casamentoIdCounter = 1; // Contador para IDs de Casamento
const casaItems = []; // Array para armazenar itens de casa
const casamentoItems = []; // Array para armazenar itens de casamento
const referencias = []; // Array para armazenar referências

// Função para alternar entre as abas
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab');
        document.querySelectorAll('.content').forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName) content.classList.add('active');
        });
    });
});

// Função para adicionar item em Casa ou Casamento
function addItem(form, isCasa) {
    const nome = form.querySelector('input[type="text"]').value;
    const categoria = form.querySelector('select').value;
    const id = isCasa ? casaIdCounter++ : casamentoIdCounter++;

    if (!nome || !categoria) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const item = { id, nome, categoria, precoTotal: 0, origem: isCasa ? 'Casa' : 'Casamento' };
    if (isCasa) {
        casaItems.push(item);
        updateTable(casaItems, 'table-casa');
    } else {
        casamentoItems.push(item);
        updateTable(casamentoItems, 'table-casamento');
    }

    form.reset();
}

// Função para atualizar as tabelas
function updateTable(items, tableId) {
    const table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    items.forEach(item => {
        const row = `<tr data-id="${item.id}">
            <td>${item.id}</td>
            <td>${item.categoria}</td>
            <td>${item.nome}</td>
            <td>R$ ${item.precoTotal.toFixed(2)}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

// Função para adicionar referência
function addReference(form) {
    const id = parseInt(form.querySelector('#ref-id').value);
    const link = form.querySelector('#ref-link').value;
    const preco = parseFloat(form.querySelector('#ref-preco').value);

    if (!id || !link || isNaN(preco)) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const item = [...casaItems, ...casamentoItems].find(item => item.id === id);
    if (!item) {
        alert('ID do item não encontrado!');
        return;
    }

    const reference = { id, link, preco, comprado: false };
    referencias.push(reference);

    const row = `<tr>
        <td>${id}</td>
        <td><a href="${link}" target="_blank">${link}</a></td>
        <td>R$ ${preco.toFixed(2)}</td>
        <td><input type="checkbox" data-id="${id}" onclick="toggleCompra(this)"></td>
    </tr>`;

    document.getElementById('table-referencias').querySelector('tbody').innerHTML += row;
    form.reset();
}

// Função para atualizar o status de compra e calcular o total
function toggleCompra(checkbox) {
    const id = parseInt(checkbox.getAttribute('data-id'));
    const referencia = referencias.find(ref => ref.id === id);

    if (checkbox.checked) {
        referencia.comprado = true;
        const item = [...casaItems, ...casamentoItems].find(item => item.id === id);
        item.precoTotal = referencia.preco;
        updateTable([...casaItems, ...casamentoItems], item.origem === 'Casamento' ? 'table-casamento' : 'table-casa');
    } else {
        referencia.comprado = false;
        const item = [...casaItems, ...casamentoItems].find(item => item.id === id);
        item.precoTotal = 0;
        updateTable([...casaItems, ...casamentoItems], item.origem === 'Casamento' ? 'table-casamento' : 'table-casa');
    }
}

// Evento de cadastro de item em Casa
document.getElementById('form-casa').addEventListener('submit', (e) => {
    e.preventDefault();
    addItem(e.target, true);
});

// Evento de cadastro de item em Casamento
document.getElementById('form-casamento').addEventListener('submit', (e) => {
    e.preventDefault();
    addItem(e.target, false);
});

// Evento de cadastro de referência
document.getElementById('form-referencia').addEventListener('submit', (e) => {
    e.preventDefault();
    addReference(e.target);
});