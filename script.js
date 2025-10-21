const menuEl = document.getElementById("menu");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const dadosCliente = document.getElementById("dados-cliente");
const notaSection = document.getElementById("nota");
const notaConteudo = document.getElementById("nota-conteudo");
let carrinho = [];
let total = 0;
const shopPhone = "5561983043534";

function calcularTaxaEntrega() {
  const hora = new Date().getHours();
  return hora >= 7 && hora < 18 ? 2 : hora >= 18 && hora <= 22 ? 3 : 0;
}
let taxaEntrega = calcularTaxaEntrega();

const cardapio = {
  tradicionais: [
    { nome: "Frango", precoG: 45 },
    { nome: "Mussarela", precoG: 45 },
    { nome: "Milho", precoG: 45 },
    { nome: "Presunto", precoG: 45 },
  ],
  especiais: [
    { nome: "Calabresa", precoG: 46 },
    { nome: "Frango com Catupiry", precoG: 49 },
    { nome: "Portuguesa", precoG: 49 },
  ]
};

// Mostrar categorias
document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", () => mostrarMenu(btn.dataset.category));
});

function mostrarMenu(categoria) {
  menuEl.innerHTML = "";
  if (categoria === "metade") {
    criarMenuMetade();
    return;
  }

  const itens = cardapio[categoria];
  itens.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h3>${item.nome}</h3>
      <p>Preço G: R$ ${item.precoG}</p>
      <button>Adicionar</button>
    `;
    div.querySelector("button").addEventListener("click", () => {
      carrinho.push({ nome: item.nome, preco: item.precoG });
      atualizarCarrinho();
    });
    menuEl.appendChild(div);
  });
}

// Pizza metade/metade
function criarMenuMetade() {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <h3>🍕 Pizza Metade/Metade</h3>
    <p>Escolha 2 sabores (tradicionais ou especiais)</p>
    <select id="sabor1">
      <option value="">-- Sabor 1 --</option>
      ${gerarOpcoesSabores()}
    </select>
    <select id="sabor2">
      <option value="">-- Sabor 2 --</option>
      ${gerarOpcoesSabores()}
    </select>
    <button id="add-metade">Adicionar</button>
  `;
  menuEl.appendChild(div);

  document.getElementById("add-metade").addEventListener("click", () => {
    const s1 = document.getElementById("sabor1").value;
    const s2 = document.getElementById("sabor2").value;
    if (!s1 || !s2) return alert("Escolha os dois sabores!");
    const preco1 = buscarPreco(s1);
    const preco2 = buscarPreco(s2);
    const precoFinal = ((preco1 + preco2) / 2).toFixed(2);
    carrinho.push({ nome: `Pizza Metade ${s1} / ${s2}`, preco: parseFloat(precoFinal) });
    atualizarCarrinho();
  });
}

function gerarOpcoesSabores() {
  let opcoes = "";
  [...cardapio.tradicionais, ...cardapio.especiais].forEach(s =>
    opcoes += `<option value="${s.nome}">${s.nome}</option>`
  );
  return opcoes;
}

function buscarPreco(nome) {
  const item = [...cardapio.tradicionais, ...cardapio.especiais].find(s => s.nome === nome);
  return item ? item.precoG : 0;
}

function atualizarCarrinho() {
  carrinhoEl.innerHTML = "";
  total = 0;
  carrinho.forEach(i => {
    total += i.preco;
    const li = document.createElement("li");
    li.textContent = `${i.nome} - R$ ${i.preco.toFixed(2)}`;
    carrinhoEl.appendChild(li);
  });
  const totalFinal = total + taxaEntrega;
  totalEl.innerHTML = `Subtotal: R$ ${total.toFixed(2)} <br> Entrega: R$ ${taxaEntrega.toFixed(2)} <br><strong>Total: R$ ${totalFinal.toFixed(2)}</strong>`;
}

// Finalizar pedido
document.getElementById("finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) return alert("Adicione itens!");
  dadosCliente.classList.remove("hidden");
});

// Gerar nota
document.getElementById("form-dados").addEventListener("submit", e => {
  e.preventDefault();
  dadosCliente.classList.add("hidden");
  notaSection.classList.remove("hidden");
  gerarNota();
});

function gerarNota() {
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const rua = document.getElementById("rua").value;
  const ref = document.getElementById("referencia").value;
  const pag = document.getElementById("pagamento").value;
  const totalFinal = total + taxaEntrega;

  let html = `<p><strong>Cliente:</strong> ${nome}</p>
              <p><strong>Endereço:</strong> ${endereco}, ${rua}</p>
              <p><strong>Referência:</strong> ${ref}</p>
              <p><strong>Pagamento:</strong> ${pag}</p><ul>`;
  carrinho.forEach((i, idx) => html += `<li>${idx + 1}. ${i.nome} - R$ ${i.preco.toFixed(2)}</li>`);
  html += `</ul><p><strong>Total Final:</strong> R$ ${totalFinal.toFixed(2)}</p>`;
  notaConteudo.innerHTML = html;
}

document.getElementById("enviar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value;
  const msg = `🧾 Pedido Kailan Massas\nCliente: ${nome}\nItens:\n` +
              carrinho.map((i, idx) => `${idx + 1}. ${i.nome} - R$ ${i.preco.toFixed(2)}`).join("\n") +
              `\nTotal: R$ ${(total + taxaEntrega).toFixed(2)}`;
  window.open(`https://wa.me/${shopPhone}?text=${encodeURIComponent(msg)}`);
});
