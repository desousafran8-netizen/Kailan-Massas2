const menuEl = document.getElementById("menu");
const bannerImg = document.getElementById("banner-img");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const infoEntrega = document.getElementById("info-entrega");
const dadosCliente = document.getElementById("dados-cliente");
const notaSection = document.getElementById("nota");
const notaConteudo = document.getElementById("nota-conteudo");

let carrinho = [];
let total = 0;
const shopPhone = "5599999999999"; // coloque o número do WhatsApp

function calcularTaxaEntrega() {
  const agora = new Date();
  const h = agora.getHours() + agora.getMinutes() / 60;
  if (h >= 7.5 && h < 18) {
    infoEntrega.textContent = "🕒 Entrega diurna (07:30 às 18:00) — Taxa R$ 2,00";
    return 2.00;
  } else if (h >= 18 && h <= 22.5) {
    infoEntrega.textContent = "🌙 Entrega noturna (18:00 às 22:30) — Taxa R$ 3,00";
    return 3.00;
  } else {
    infoEntrega.textContent = "🚫 Fora do horário de entrega (07:30 às 22:30)";
    return 0.00;
  }
}

let taxaEntrega = calcularTaxaEntrega();

// Atualiza a cada minuto
setInterval(() => {
  taxaEntrega = calcularTaxaEntrega();
  atualizarCarrinho();
}, 60000);

// --- CARDÁPIO (reduzido para exemplo)
const cardapio = {
  tradicionais: [
    { nome: "Frango", precoM: 35, precoG: 45, ingredientes: "Mussarela, frango, orégano" },
    { nome: "Mussarela", precoM: 35, precoG: 45, ingredientes: "Mussarela, orégano" }
  ],
  bebidas: [
    { nome: "Coca-Cola 2L", preco: 15 },
    { nome: "Guaraná 1L", preco: 10 }
  ]
};

const imagens = {
  tradicionais: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
  bebidas: "https://cdn.pixabay.com/photo/2016/03/05/22/34/coca-cola-1233243_1280.jpg"
};

// MOSTRAR MENU
function mostrarMenu(categoria) {
  menuEl.innerHTML = "";
  bannerImg.src = imagens[categoria] || bannerImg.src;
  cardapio[categoria].forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <h3>${item.nome}</h3>
      <p>${item.ingredientes || ""}</p>
      ${item.precoM ? `
        <p>Preço M: R$ ${item.precoM} | G: R$ ${item.precoG}</p>
        <select>
          <option value="M">M - R$ ${item.precoM}</option>
          <option value="G">G - R$ ${item.precoG}</option>
        </select>` 
      : `<p>Preço: R$ ${item.preco}</p>`}
      <button>Adicionar</button>`;
    
    div.querySelector("button").addEventListener("click", () => {
      let preco = item.preco || item.precoM;
      let nomeItem = item.nome;
      const select = div.querySelector("select");
      if (select) {
        const tam = select.value;
        preco = tam === "M" ? item.precoM : item.precoG;
        nomeItem += ` (${tam})`;
      }
      carrinho.push({ nome: nomeItem, preco });
      atualizarCarrinho();
    });

    menuEl.appendChild(div);
  });
}

// ATUALIZA CARRINHO
function atualizarCarrinho() {
  carrinhoEl.innerHTML = "";
  total = 0;
  carrinho.forEach(i => {
    total += i.preco;
    const li = document.createElement("li");
    li.textContent = `${i.nome} - R$ ${i.preco.toFixed(2)}`;
    carrinhoEl.appendChild(li);
  });
  totalEl.innerHTML = `Subtotal: R$ ${total.toFixed(2)} <br> 
                       Entrega: R$ ${taxaEntrega.toFixed(2)} <br>
                       <strong>Total: R$ ${(total + taxaEntrega).toFixed(2)}</strong>`;
}

document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", () => mostrarMenu(btn.dataset.category));
});

document.getElementById("finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) return alert("Adicione algo ao carrinho!");
  dadosCliente.classList.remove("hidden");
});

document.getElementById("form-dados").addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const rua = document.getElementById("rua").value;
  const referencia = document.getElementById("referencia").value;
  const pagamento = document.getElementById("pagamento").value;
  const data = new Date().toLocaleString();

  let html = `<p><strong>Data:</strong> ${data}</p>
              <p><strong>Cliente:</strong> ${nome}</p>
              <p><strong>Endereço:</strong> ${endereco}</p>
              <p><strong>Rua:</strong> ${rua}</p>
              <p><strong>Referência:</strong> ${referencia}</p>
              <p><strong>Pagamento:</strong> ${pagamento}</p><hr>
              <h3>Itens:</h3><ul>`;
  carrinho.forEach(i => html += `<li>${i.nome} - R$ ${i.preco.toFixed(2)}</li>`);
  html += `</ul><hr><p><strong>Total com Entrega: R$ ${(total + taxaEntrega).toFixed(2)}</strong></p>`;
  notaConteudo.innerHTML = html;
  notaSection.classList.remove("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

document.getElementById("imprimir").addEventListener("click", () => window.print());

document.getElementById("enviar").addEventListener("click", () => {
  const texto = notaConteudo.innerText;
  const link = `https://wa.me/${shopPhone}?text=${encodeURIComponent(texto)}`;
  window.open(link, "_blank");
});
