const API_URL = 'http://localhost:3000/api/produtos';
let produtoEditando = null;

// Carrega produtos ao iniciar a página
window.onload = listarProdutos;

// Função para listar produtos
function listarProdutos() {
    fetch(API_URL)
        .then(response => response.json())
        .then(produtos => {
            const container = document.getElementById('produtos-container');
            container.innerHTML = '';
            produtos.forEach(produto => {
                container.innerHTML += `
                    <div class="produto">
                        <h3>${produto.nome}</h3>
                        <p>Categoria: ${produto.categoria}</p>
                        <p>Quantidade: ${produto.quantidade}</p>
                        <p>Preço: R$ ${produto.preco}</p>
                        <button onclick="abrirModalEditar('${produto.id}')">Editar</button>
                        <button onclick="excluirProduto('${produto.id}')">Excluir</button>
                    </div>
                `;
            });
        });
}

// Função para adicionar produto
function adicionarProduto() {
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco = document.getElementById('preco').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, categoria, quantidade, preco })
    }).then(() => {
        listarProdutos();
        limparFormulario();
    });
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('preco').value = '';
}

// Função para abrir modal de edição
function abrirModalEditar(id) {
    produtoEditando = id;
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(produto => {
            document.getElementById('edit-nome').value = produto.nome;
            document.getElementById('edit-categoria').value = produto.categoria;
            document.getElementById('edit-quantidade').value = produto.quantidade;
            document.getElementById('edit-preco').value = produto.preco;
            document.getElementById('edit-modal').style.display = 'block';
        });
}

// Função para salvar edição
function salvarEdicao() {
    const nome = document.getElementById('edit-nome').value;
    const categoria = document.getElementById('edit-categoria').value;
    const quantidade = document.getElementById('edit-quantidade').value;
    const preco = document.getElementById('edit-preco').value;

    fetch(`${API_URL}/${produtoEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, categoria, quantidade, preco })
    }).then(() => {
        listarProdutos();
        fecharModal();
    });
}

// Função para fechar modal
function fecharModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// Função para excluir produto
function excluirProduto(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => listarProdutos());
}
