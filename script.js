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
const shopPhone = "5561983043535"; // número do WhatsApp

// Função para calcular taxa de entrega conforme horário
function calcularTaxaEntrega() {
  const agora = new Date();
  const horas = agora.getHours();
  const minutos = agora.getMinutes();
  const horaDecimal = horas + minutos / 60;

  if (horaDecimal >= 7.5 && horaDecimal < 18) {
    infoEntrega.textContent = "🕒 Entrega diurna (07:30 às 18:00) — Taxa R$ 2,00";
    return 2.00;
  } else if (horaDecimal >= 18 && horaDecimal <= 22.5) {
    infoEntrega.textContent = "🌙 Entrega noturna (18:00 às 22:30) — Taxa R$ 3,00";
    return 3.00;
  } else {
    infoEntrega.textContent = "🚫 Fora do horário de entrega (07:30 às 22:30)";
    return 0.00;
  }
}

let taxaEntrega = calcularTaxaEntrega();

// Atualiza mensagem de entrega a cada 60 segundos
setInterval(() => {
  taxaEntrega = calcularTaxaEntrega();
  atualizarCarrinho();
}, 60000);

// Imagens
const imagens = {
  tradicionais:"https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
  especiais:"https://cdn.pixabay.com/photo/2017/11/22/19/41/pizza-2971169_1280.jpg",
  lanches:"https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  salgadinhos:"https://cdn.pixabay.com/photo/2021/01/22/13/35/snack-5940811_1280.jpg",
  omeletes:"https://cdn.pixabay.com/photo/2020/09/25/12/48/omelette-5602334_1280.jpg",
  bebidas:"https://cdn.pixabay.com/photo/2016/03/05/22/34/coca-cola-1233243_1280.jpg"
};

// Cardápio
const cardapio = {
  tradicionais:[
    {nome:"Frango", precoM:35, precoG:45, ingredientes:"Mussarela, frango, orégano"},
    {nome:"Milho", precoM:35, precoG:45, ingredientes:"Mussarela, milho, orégano"},
    {nome:"Mussarela", precoM:35, precoG:45, ingredientes:"Mussarela, orégano"},
    {nome:"Presunto", precoM:35, precoG:45, ingredientes:"Mussarela, presunto, orégano"},
    {nome:"Banana", precoM:35, precoG:45, ingredientes:"Mussarela, banana, açúcar com canela"},
    {nome:"Marguerita", precoM:35, precoG:45, ingredientes:"Mussarela, tomate, orégão"}
  ],
  especiais:[
    {nome:"Calabresa", precoM:36, precoG:46, ingredientes:"Mussarela, calabresa, orégano"},
    {nome:"Frango com Catupiry", precoM:38, precoG:49, ingredientes:"Mussarela, frango, catupiry, orégano"},
    {nome:"Portuguesa", precoM:38, precoG:49, ingredientes:"Presunto, calabresa, pimentão, cebola, ovo, azeitona, orégano"},
    {nome:"Moda da Casa", precoM:37, precoG:47, ingredientes:"Presunto, calabresa, frango, milho, azeitona, orégano"},
    {nome:"Americana", precoM:38, precoG:49, ingredientes:"Mussarela, pasta de alho, presunto, bacon, ovo, orégano"},
    {nome:"Paulista", precoM:39, precoG:49, ingredientes:"Mussarela, presunto, tomate, cebola, bacon, mussarela, orégano"},
    {nome:"Chocolate", precoM:48, precoG:37, ingredientes:"Mussarela, chocolate"},
    {nome:"Choconana", precoM:36, precoG:50, ingredientes:"Mussarela, banana, chocolate"},
    {nome:"Três Queijos", precoM:37, precoG:48, ingredientes:"Mussarela, catupiry, cheddar, orégano"}
  ],
  lanches:[
    {nome:"X TUDO ESPECIAL", preco:16, ingredientes:"Hambúrguer, ovo, salsicha, mussarela, cheddar, presunto, alface, tomate, batata palha, milho"},
    {nome:"Cachorro Quente na Chapa", preco:10, ingredientes:"Salsicha, presunto, bacon, cheddar, milho, batata palha"},
    {nome:"Misto Quente Completo", preco:8, ingredientes:"Ovo, presunto, mussarela"},
    {nome:"Misto Quente Simples", preco:5, ingredientes:"Presunto, mussarela"}
  ],
  salgadinhos:[
    {nome:"Coxinha de Frango", preco:1},
    {nome:"Coxinha de Carne", preco:1},
    {nome:"Pastel de Carne", preco:1},
    {nome:"Pastel de Frango", preco:1},
    {nome:"Enroladinho de Salsicha", preco:1},
    {nome:"Bomba Presunto Queijo", preco:1}
  ],
  omeletes:[
    {nome:"Omelete Frango", preco:10, ingredientes:"Frango, queijo, ovo, tomate"},
    {nome:"Omelete Presunto", preco:10, ingredientes:"Presunto, queijo, ovo, tomate"},
    {nome:"Omelete Calabresa", preco:10, ingredientes:"Calabresa, queijo, ovo, tomate, cebola"},
    {nome:"Omelete Especial", preco:17, ingredientes:"Frango, calabresa, presunto, ovo, queijo, bacon"}
  ],
  bebidas:[
    {nome:"Coca-Cola 2L", preco:15},
    {nome:"Coca-Cola 1L", preco:10},
    {nome:"Guaraná 1L", preco:10},
    {nome:"Coca-Cola Lata", preco:5},
    {nome:"Guaraná Lata", preco:5}
  ]
};

// Mostrar menu
function mostrarMenu(categoria){
  menuEl.innerHTML = "";
  bannerImg.src = imagens[categoria] || bannerImg.src;
  cardapio[categoria].forEach(item=>{
    const div = document.createElement("div");
    div.classList.add("item");
    let html = `<h3>${item.nome}</h3>`;
    if(item.ingredientes) html+= `<p>${item.ingredientes}</p>`;
    if(item.precoM && item.precoG){
      html += `<p>Preço M: R$ ${item.precoM} | G: R$ ${item.precoG}</p>
      <select class="tamanho">
        <option value="M">M - R$ ${item.precoM}</option>
        <option value="G">G - R$ ${item.precoG}</option>
      </select>`;
    } else html+= `<p>Preço: R$ ${item.preco}</p>`;
    html+= `<button>Adicionar</button>`;
    div.innerHTML = html;
    menuEl.appendChild(div);

    div.querySelector("button").addEventListener("click",()=>{
      let preco = item.preco || item.precoM;
      let nomeItem = item.nome;
      const select = div.querySelector("select");
      if(select){
        const tamanho = select.value;
        preco = tamanho==="M"? item.precoM : item.precoG;
        nomeItem += ` (${tamanho})`;
      }
      carrinho.push({nome:nomeItem, preco});
      atualizarCarrinho();
    });
  });
}

// Atualizar carrinho
function atualizarCarrinho(){
  taxaEntrega = calcularTaxaEntrega();
  carrinhoEl.innerHTML = "";
  total = 0;
  carrinho.forEach(i=>{
    total += i.preco;
    const li = document.createElement("li");
    li.textContent = `${i.nome} - R$ ${i.preco.toFixed(2)}`;
    carrinhoEl.appendChild(li);
  });

  let entregaTexto = taxaEntrega > 0 ? `R$ ${taxaEntrega.toFixed(2)}` : "Fora do horário de entrega";
  const totalComEntrega = total + taxaEntrega;
  totalEl.innerHTML = `Subtotal: R$ ${total.toFixed(2)} <br> Taxa de Entrega: ${entregaTexto} <br><strong>Total Final: R$ ${totalComEntrega.toFixed(2)}</strong>`;
}

// Eventos menu
document.querySelectorAll(".menu-btn").forEach(btn=>{
  btn.addEventListener("click",()=>mostrarMenu(btn.dataset.category));
});

// Finalizar pedido
document.getElementById("finalizar").addEventListener("click",()=>{
  if(carrinho.length===0) return alert("Adicione itens antes de finalizar!");
  dadosCliente.classList.remove("hidden");
});

// Gerar nota
document.getElementById("form-dados").addEventListener("submit",e=>{
  e.preventDefault();
  const nome=document.getElementById("nome").value;
  const endereco=document.getElementById("endereco").value;
  const rua=document.getElementById("rua").value;
  const referencia=document.getElementById("referencia").value;
  const pagamento=document.getElementById("pagamento").value;
  const data = new Date().toLocaleString();

  let html = `<p><strong>Data:</strong> ${data}</p>
  <p><strong>Cliente:</strong> ${nome}</p>
  <p><strong>Endereço:</strong> ${endereco}</p>
  <p><strong>Rua:</strong> ${rua}</p>
  <p><strong>Referência:</strong> ${referencia}</p>
  <p><strong>Pagamento:</strong> ${pagamento}</p><hr>
  <h3>Itens:</h3><ul>`;
  carrinho.forEach(i=>html+=`<li>${i.nome} - R$ ${i.preco.toFixed(2)}</li>`);
  html+=`</ul><p><strong>Total Final: R$ ${(total+taxaEntrega).toFixed(2)}</strong></p>`;
  notaConteudo.innerHTML = html;
  notaSection.classList.remove("hidden");
  window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
});

// Imprimir
document.getElementById("imprimir").addEventListener("click",()=>window.print());

// Enviar via WhatsApp
document.getElementById("enviar").addEventListener("click",()=>{
  const texto = notaConteudo.innerText;
  const link = `https://wa.me/${shopPhone}?text=${encodeURIComponent(texto)}`;
  window.open(link,"_blank");
});

