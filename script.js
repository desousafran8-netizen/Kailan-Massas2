const menuEl = document.getElementById("menu");
const bannerImg = document.getElementById("banner-img");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const dadosCliente = document.getElementById("dados-cliente");
const notaSection = document.getElementById("nota");
const notaConteudo = document.getElementById("nota-conteudo");

let carrinho = [];
let total = 0;
let taxaEntrega = 3.00;
const shopPhone = "5599999999999"; // Coloque o número real

// ===== Taxa de entrega conforme horário =====
function atualizarTaxaEntrega() {
  const agora = new Date();
  const horas = agora.getHours();
  const minutos = agora.getMinutes();
  const horaDecimal = horas + minutos / 60;
  if (horaDecimal >= 7.5 && horaDecimal < 18) taxaEntrega = 2.00;
  else if (horaDecimal >= 18 && horaDecimal <= 22.5) taxaEntrega = 3.00;
  else taxaEntrega = 3.00;
}
atualizarTaxaEntrega();

// ===== Imagens =====
const imagens = {
  tradicionais: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
  especiais: "https://cdn.pixabay.com/photo/2017/11/22/19/41/pizza-2971169_1280.jpg",
  lanches: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  salgadinhos: "https://cdn.pixabay.com/photo/2021/01/22/13/35/snack-5940811_1280.jpg",
  omeletes: "https://cdn.pixabay.com/photo/2020/09/25/12/48/omelette-5602334_1280.jpg",
  bebidas: "https://cdn.pixabay.com/photo/2016/03/05/22/34/coca-cola-1233243_1280.jpg"
};

// ===== Cardápio =====
const cardapio = {
  bebidas: [
    { nome: "Coca-Cola 2L", preco: 15 },
    { nome: "Coca-Cola 1L", preco: 10 },
    { nome: "Guaraná 1L", preco: 10 },
    { nome: "Coca-Cola Lata", preco: 5 },
    { nome: "Guaraná Lata", preco: 5 }
  ]
};

// ===== Exibir menu =====
function mostrarMenu(categoria) {
  menuEl.innerHTML = "";
  bannerImg.src = imagens[categoria] || bannerImg.src;
  cardapio[categoria].forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <h3>${item.nome}</h3>
      <p>Preço: R$ ${item.preco}</p>
      <button>Adicionar</button>`;
    menuEl.appendChild(div);
    div.querySelector("button").addEventListener("click", () => {
      carrinho.push({ nome: item.nome, preco: item.preco });
      atualizarCarrinho();
    });
  });
}

// ===== Atualizar carrinho =====
function atualizarCarrinho() {
  atualizarTaxaEntrega();
  carrinhoEl.innerHTML = "";
  total = 0;
  carrinho.forEach(i => {
    total += i.preco;
    const li = document.createElement("li");
    li.textContent = `${i.nome} - R$ ${i.preco.toFixed(2)}`;
    carrinhoEl.appendChild(li);
  });
  const totalComEntrega = total + taxaEntrega;
  totalEl.innerHTML = `Subtotal: R$ ${total.toFixed(2)} <br> Entrega: R$ ${taxaEntrega.toFixed(2)} <br><strong>Total: R$ ${totalComEntrega.toFixed(2)}</strong>`;
}

// ===== Finalizar pedido =====
document.getElementById("finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) return alert("Adicione itens!");
  dadosCliente.classList.remove("hidden");
});

// ===== Gerar nota =====
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
  const totalComEntrega = total + taxaEntrega;
  let html = `<p><strong>Cliente:</strong> ${nome}</p>
  <p><strong>Endereço:</strong> ${endereco}, ${rua}</p>
  <p><strong>Referência:</strong> ${ref}</p>
  <p><strong>Pagamento:</strong> ${pag}</p><ul>`;
  carrinho.forEach(i => html += `<li>${i.nome} - R$ ${i.preco.toFixed(2)}</li>`);
  html += `</ul><p><strong>Entrega:</strong> R$ ${taxaEntrega.toFixed(2)}</p>
  <p><strong>Total:</strong> R$ ${totalComEntrega.toFixed(2)}</p>`;
  notaConteudo.innerHTML = html;
}

// ===== Botões =====
document.getElementById("imprimir").addEventListener("click", () => window.print());
document.getElementById("enviar").addEventListener("click", () => {
  const msg = notaConteudo.innerText;
  const url = `https://wa.me/${shopPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url);
});
