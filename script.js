const menu = document.getElementById("menu");
const carrinho = [];
let categoriaAtual = "";

const pizzas = {
  tradicionais: [
    { nome: "Calabresa", preco: 30 },
    { nome: "Mussarela", preco: 28 },
    { nome: "Frango Catupiry", preco: 32 },
  ],
  especiais: [
    { nome: "4 Queijos", preco: 36 },
    { nome: "Portuguesa", preco: 35 },
    { nome: "Bacon Especial", preco: 38 },
  ]
};

document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;
    categoriaAtual = categoria;
    mostrarMenu(categoria);
  });
});

function mostrarMenu(categoria) {
  menu.innerHTML = "";

  if (categoria === "metade") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>Pizza Metade/Metade 🍕</h3>
      <p>Escolha 2 sabores (pode ser Tradicional ou Especial)</p>
      <button onclick="escolherMetade()">Escolher Sabores</button>
    `;
    menu.appendChild(card);
    return;
  }

  pizzas[categoria].forEach(pizza => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${pizza.nome}</h3>
      <p>R$ ${pizza.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho('${pizza.nome}', ${pizza.preco})">Adicionar</button>
    `;
    menu.appendChild(card);
  });
}

function escolherMetade() {
  const todosSabores = [...pizzas.tradicionais, ...pizzas.especiais];
  const nomes = todosSabores.map(p => p.nome).join(", ");

  const sabor1 = prompt(`Escolha o 1º sabor (${nomes})`);
  const sabor2 = prompt(`Escolha o 2º sabor (${nomes})`);

  const p1 = todosSabores.find(p => p.nome.toLowerCase() === sabor1?.toLowerCase());
  const p2 = todosSabores.find(p => p.nome.toLowerCase() === sabor2?.toLowerCase());

  if (!p1 || !p2) {
    alert("Um dos sabores não foi encontrado. Tente novamente!");
    return;
  }

  const precoMedio = (p1.preco + p2.preco) / 2;
  adicionarCarrinho(`Meia ${p1.nome} + Meia ${p2.nome}`, precoMedio);
}

function adicionarCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  alert(`${nome} adicionada ao carrinho!`);
}

document.getElementById("ver-carrinho").addEventListener("click", () => {
  const ctn = document.getElementById("carrinho-container");
  ctn.classList.toggle("hidden");
  atualizarCarrinho();
});

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach(item => {
    total += item.preco;
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = `Total: R$ ${total.toFixed(2)}`;
}

document.getElementById("enviarPedido").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const ref = document.getElementById("ref").value.trim();
  const taxaEntrega = parseFloat(document.getElementById("taxaEntrega").value) || 0;
  const pagamento = document.querySelector("input[name='pag']:checked");

  if (!nome || !endereco || !rua || !ref || !pagamento) {
    alert("Preencha todos os campos!");
    return;
  }

  const total = carrinho.reduce((acc, i) => acc + i.preco, 0) + taxaEntrega;
  let mensagem = `🍕 *Pedido - Kailan Massas* 🍕\n`;
  mensagem += `Cliente: ${nome}\nEndereço: ${endereco}, ${rua}\nRef: ${ref}\nPagamento: ${pagamento.value}\n`;
  mensagem += `────────────────────\n*Itens:*\n`;

  carrinho.forEach((i, idx) => mensagem += `${idx + 1}. ${i.nome} - R$ ${i.preco.toFixed(2)}\n`);

  mensagem += `────────────────────\nEntrega: R$ ${taxaEntrega.toFixed(2)}\n*Total:* R$ ${total.toFixed(2)}\n────────────────────\nObrigado!`;

  const telefone = "559999999999"; // Coloque seu número com DDI+DDD
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`);
});

