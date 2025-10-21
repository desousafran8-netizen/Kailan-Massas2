const menuEl = document.getElementById("menu");
const bannerImg = document.getElementById("banner-img");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const dadosCliente = document.getElementById("dados-cliente");
const notaSection = document.getElementById("nota");
const notaConteudo = document.getElementById("nota-conteudo");

let carrinho = [];
let total = 0;
const shopPhone = "5561983043534"; // WhatsApp da loja

function calcularTaxaEntrega() {
  const agora = new Date();
  const horaDecimal = agora.getHours() + agora.getMinutes()/60;
  if(horaDecimal >= 7.5 && horaDecimal < 18) return 2;
  if(horaDecimal >= 18 && horaDecimal <= 22.5) return 3;
  return 0;
}

let taxaEntrega = calcularTaxaEntrega();

const imagens = {
  tradicionais:"https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
  especiais:"https://cdn.pixabay.com/photo/2017/11/22/19/41/pizza-2971169_1280.jpg"
};

const cardapio = {
  tradicionais:[ {nome:"Frango"}, {nome:"Milho"}, {nome:"Mussarela"}, {nome:"Presunto"}, {nome:"Banana"}, {nome:"Marguerita"} ],
  especiais:[ {nome:"Calabresa"}, {nome:"Frango com Catupiry"}, {nome:"Portuguesa"}, {nome:"Moda da Casa"}, {nome:"Americana"}, {nome:"Paulista"}, {nome:"Chocolate"}, {nome:"Choconana"}, {nome:"Três Queijos"} ]
};

// Mostrar menu
function mostrarMenu(categoria){
  menuEl.innerHTML = "";
  bannerImg.src = imagens[categoria] || bannerImg.src;

  if(categoria === "meioameio"){
    mostrarMeioMeio();
    return;
  }

  cardapio[categoria]?.forEach(item=>{
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `<h3>${item.nome}</h3><button>Adicionar</button>`;
    menuEl.appendChild(div);
    div.querySelector("button").addEventListener("click",()=>{
      carrinho.push({nome:item.nome, preco:35});
      atualizarCarrinho();
    });
  });
}

// Pizza Meio a Meio
function mostrarMeioMeio(){
  const div = document.createElement("div");
  div.classList.add("meioameio-container");

  const todosSabores = cardapio.tradicionais.concat(cardapio.especiais)
                       .map(p=>`<option value="${p.nome}">${p.nome}</option>`).join("");

  div.innerHTML = `<h3>Pizza Meio a Meio</h3>
    <label>Metade 1:
      <select id="meio1"><option value="">Escolha...</option>${todosSabores}</select>
    </label>
    <label>Metade 2:
      <select id="meio2"><option value="">Escolha...</option>${todosSabores}</select>
    </label>
    <label>Tamanho:
      <select id="tamanhoMeio">
        <option value="M">M - R$ 35</option>
        <option value="G">G - R$ 45</option>
      </select>
    </label>
    <button id="addMeio">Adicionar ao Carrinho</button>`;
  
  menuEl.appendChild(div);

  document.getElementById("addMeio").addEventListener("click",()=>{
    const m1 = document.getElementById("meio1").value;
    const m2 = document.getElementById("meio2").value;
    const tamanho = document.getElementById("tamanhoMeio").value;
    if(!m1 || !m2) return alert("Escolha os dois sabores!");
    carrinho.push({nome:`Pizza Meio a Meio (${m1} / ${m2}) - ${tamanho}`, preco:tamanho==="M"?35:45});
    atualizarCarrinho();
  });
}

// Atualizar carrinho
function atualizarCarrinho(){
  taxaEntrega = calcularTaxaEntrega();
  carrinhoEl.innerHTML="";
  total=0;
  carrinho.forEach(i=>{
    total+=i.preco;
    const li = document.createElement("li");
    li.textContent = `${i.nome} - R$ ${i.preco.toFixed(2)}`;
    carrinhoEl.appendChild(li);
  });
  const totalComEntrega = total + taxaEntrega;
  let entregaTexto = taxaEntrega>0?`R$ ${taxaEntrega.toFixed(2)}`:"Fora do horário";
  totalEl.innerHTML=`Subtotal: R$ ${total.toFixed(2)}<br>Taxa de Entrega: ${entregaTexto}<br><strong>Total Final: R$ ${totalComEntrega.toFixed(2)}</strong>`;
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
document.getElementById("form-dados").addEventListener("submit", e=>{
  e.preventDefault();
  dadosCliente.classList.add("hidden");
  notaSection.classList.remove("hidden");

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const rua = document.getElementById("rua").value;
  const ref = document.getElementById("referencia").value;
  const pag = document.getElementById("pagamento").value;
  taxaEntrega = calcularTaxaEntrega();
  const totalComEntrega = total + taxaEntrega;

  let html = `<p><strong>Cliente:</strong> ${nome}</p>
              <p><strong>Endereço:</strong> ${endereco}, ${rua}</p>
              <p><strong>Referência:</strong> ${ref}</p>
              <p><strong>Pagamento:</strong> ${pag}</p>
              <ul>`;
  carrinho.forEach((i,idx)=> html+= `<li>${idx+1}. ${i.nome} - R$ ${i.preco.toFixed(2)}</li>`);
  html+=`</ul><p><strong>Taxa de Entrega:</strong> R$ ${taxaEntrega.toFixed(2)}</p>
         <p><strong>Total Final:</strong> R$ ${totalComEntrega.toFixed(2)}</p>`;
  notaConteudo.innerHTML = html;
});

// Imprimir
document.getElementById("imprimir").addEventListener("click",()=>window.print());

// Enviar WhatsApp
document.getElementById("enviar").addEventListener("click",()=>{
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const rua = document.getElementById("rua").value;
  const ref = document.getElementById("referencia").value;
  const pag = document.getElementById("pagamento").value;
  taxaEntrega = calcularTaxaEntrega();
  const totalComEntrega = total + taxaEntrega;

  let msg = `🧾 *Comanda Kailan Massas*\n───────────────────\n`;
  msg += `*Cliente:* ${nome}\n*Endereço:* ${endereco}, ${rua}\n*Referência:* ${ref}\n*Pagamento:* ${pag}\n───────────────────\n*Itens:*\n`;
  carrinho.forEach((i,idx)=>msg+=`${idx+1}. ${i.nome} - R$ ${i.preco.toFixed(2)}\n`);
  msg += `───────────────────\nSubtotal: R$ ${total.toFixed(2)}\nEntrega: R$ ${taxaEntrega.toFixed(2)}\n*Total: R$ ${totalComEntrega.toFixed(2)}*\n───────────────────\n🍕 Obrigado pelo pedido!`;

  window.open(`https://wa.me/${shopPhone}?text=${encodeURIComponent(msg)}`, "_blank");
});
