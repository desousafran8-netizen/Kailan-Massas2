const menuEl = document.getElementById("menu");
const bannerImg = document.getElementById("banner-img");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const dadosCliente = document.getElementById("dados-cliente");
const notaSection = document.getElementById("nota");
const notaConteudo = document.getElementById("nota-conteudo");

let carrinho = [];
let total = 0;
const shopPhone = "5561983043534"; // número da loja

function calcularTaxaEntrega() {
  const agora = new Date();
  const h = agora.getHours() + agora.getMinutes() / 60;
  if (h >= 7.5 && h < 18) return 2.00;
  if (h >= 18 && h <= 22.5) return 3.00;
  return 0.00;
}
let taxaEntrega = calcularTaxaEntrega();

const imagens = {
  tradicionais:"https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
  especiais:"https://cdn.pixabay.com/photo/2017/11/22/19/41/pizza-2971169_1280.jpg",
  lanches:"https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  salgadinhos:"https://cdn.pixabay.com/photo/2021/01/22/13/35/snack-5940811_1280.jpg",
  omeletes:"https://cdn.pixabay.com/photo/2020/09/25/12/48/omelette-5602334_1280.jpg",
  bebidas:"https://cdn.pixabay.com/photo/2016/03/05/22/34/coca-cola-1233243_1280.jpg"
};

// cardápio (igual ao seu)
const cardapio = {
  tradicionais:[{nome:"Frango", precoM:35, precoG:45, ingredientes:"Mussarela, frango, orégano"},
    {nome:"Milho", precoM:35, precoG:45, ingredientes:"Mussarela, milho, orégano"},
    {nome:"Mussarela", precoM:35, precoG:45, ingredientes:"Mussarela, orégano"},
    {nome:"Presunto", precoM:35, precoG:45, ingredientes:"Mussarela, presunto, orégano"},
    {nome:"Banana", precoM:35, precoG:45, ingredientes:"Mussarela, banana, açúcar e canela"},
    {nome:"Marguerita", precoM:35, precoG:45, ingredientes:"Mussarela, tomate, orégano"}],
  especiais:[
    {nome:"Calabresa", precoM:36, precoG:46, ingredientes:"Mussarela, calabresa, orégano"},
    {nome:"Frango com Catupiry", precoM:38, precoG:49, ingredientes:"Mussarela, frango, catupiry"},
    {nome:"Portuguesa", precoM:38, precoG:49, ingredientes:"Presunto, calabresa, pimentão, cebola, ovo"},
    {nome:"Moda da Casa", precoM:37, precoG:47, ingredientes:"Presunto, frango, milho, azeitona"},
    {nome:"Americana", precoM:38, precoG:49, ingredientes:"Presunto, bacon, ovo"},
    {nome:"Paulista", precoM:39, precoG:49, ingredientes:"Presunto, tomate, cebola, bacon"},
    {nome:"Chocolate", precoM:36, precoG:48, ingredientes:"Chocolate"},
    {nome:"Choconana", precoM:37, precoG:50, ingredientes:"Banana, chocolate"},
    {nome:"Três Queijos", precoM:37, precoG:48, ingredientes:"Mussarela, catupiry, cheddar"}
  ],
  lanches:[{nome:"X TUDO ESPECIAL", preco:16},{nome:"Cachorro Quente na Chapa", preco:10}],
  salgadinhos:[{nome:"Coxinha de Frango", preco:1}],
  omeletes:[{nome:"Omelete Especial", preco:17}],
  bebidas:[{nome:"Coca-Cola 2L", preco:15}]
};

function mostrarMenu(categoria){
  menuEl.innerHTML = "";
  bannerImg.src = imagens[categoria] || bannerImg.src;

  // botão especial para pizza metade/metade
  if (categoria === "tradicionais" || categoria === "especiais") {
    const metadeBtn = document.createElement("button");
    metadeBtn.textContent = "🍕 Fazer Pizza Metade a Metade";
    metadeBtn.classList.add("menu-btn");
    metadeBtn.addEventListener("click", abrirPizzaMetade);
    menuEl.appendChild(metadeBtn);
  }

  cardapio[categoria].forEach(item=>{
    const div = document.createElement("div");
    div.classList.add("item");
    let html = `<h3>${item.nome}</h3>`;
    if(item.ingredientes) html+= `<p>${item.ingredientes}</p>`;
    if(item.precoM && item.precoG){
      html += `<p>Preço M: R$ ${item.precoM} | G: R$ ${item.precoG}</p>
      <select class="tamanho">
        <option value="M">M</option>
        <option value="G">G</option>
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

// função pizza metade/metade
function abrirPizzaMetade(){
  const sabores = [...cardapio.tradicionais, ...cardapio.especiais];
  const sabor1 = prompt("Escolha o 1º sabor (ex: Frango, Calabresa):");
  const sabor2 = prompt("Escolha o 2º sabor (ex: Marguerita, Portuguesa):");
  const tamanho = prompt("Tamanho M ou G?");
  if (!sabor1 || !sabor2) return alert("Selecione dois sabores válidos!");

  const p1 = sabores.find(s=>s.nome.toLowerCase()===sabor1.toLowerCase());
  const p2 = sabores.find(s=>s.nome.toLowerCase()===sabor2.toLowerCase());
  if (!p1 || !p2) return alert("Sabor não encontrado.");

  const preco = tamanho.toUpperCase()==="G" ?
      ((p1.precoG + p2.precoG) / 2) :
      ((p1.precoM + p2.precoM) / 2);

  carrinho.push({nome:`Pizza ${sabor1}/${sabor2} (${tamanho.toUpperCase()})`, preco});
  atualizarCarrinho();
  alert("🍕 Pizza metade a metade adicionada!");
}

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
  const totalComEntrega = total + taxaEntrega;
  totalEl.innerHTML = `Subtotal: R$ ${total.toFixed(2)} <br> Taxa: R$ ${taxaEntrega.toFixed(2)} <br><strong>Total: R$ ${totalComEntrega.toFixed(2)}</strong>`;
}

document.querySelectorAll(".menu-btn").forEach(btn=>{
  btn.addEventListener("click",()=>mostrarMenu(btn.dataset.category));
});

document.getElementById("finalizar").addEventListener("click",()=>{
  if(carrinho.length===0) return alert("Adicione itens antes de finalizar!");
  dadosCliente.classList.remove("hidden");
});

document.getElementById("form-dados").addEventListener("submit",e=>{
  e.preventDefault();
  dadosCliente.classList.add("hidden");
  notaSection.classList.remove("hidden");
  gerarNota();
});

function gerarNota(){
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
  <p><strong>Pagamento:</strong> ${pag}</p><ul>`;
  carrinho.forEach((i,idx)=> html+= `<li>${idx+1}. ${i.nome} - R$ ${i.preco.toFixed(2)}</li>`);
  html+= `</ul><p><strong>Entrega:</strong> R$ ${taxaEntrega.toFixed(2)}</p>
  <p><strong>Total:</strong> R$ ${totalComEntrega.toFixed(2)}</p>`;
  notaConteudo.innerHTML = html;
}

document.getElementById("imprimir").addEventListener("click",()=>window.print());

document.getElementById("enviar").addEventListener("click",()=>{
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const rua = document.getElementById("rua").value;
  const ref = document.getElementById("referencia").value;
  const pag = document.getElementById("pagamento").value;
  taxaEntrega = calcularTaxaEntrega();
  const totalComEntrega = total + taxaEntrega;

  let msg = `🧾 *Comanda Kailan Massas*\n
