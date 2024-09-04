// Pegando os elementos do DOM
const expenseForm = document.querySelector("form");
const expenseName = document.getElementById("expense");
const expenseAmount = document.getElementById("amount");
const expenseCategory = document.getElementById("category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");


// Criando um evento de submit no formulário
expenseForm.onsubmit = (event) => {
  // Previne o comportamento padrão do formulário
  event.preventDefault();
  // Criando um novo objeto de despesa
  const newExpense = {
    id: new Date().getTime(),
    name: expenseName.value,
    category_id: expenseCategory.value,
    category_name: expenseCategory.options[expenseCategory.selectedIndex].text,
    amount: expenseAmount.value,
    create_at: new Date(),
  }

  //Chamando a função para adicionar a despesa a lista
  expenseAdd(newExpense);
}

// Adicionando um evento de input no campo de valor da despesa
expenseAmount.oninput = () => {
  let value = expenseAmount.value.replace(/\D/g, "");
  value = Number(value) / 100;

  expenseAmount.value = formatCurrencyBRL(value);
}

// Função para formatar o valor para o padrão BRL
function formatCurrencyBRL(value) {

  // Convertendo o valor para moeda BRL
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  // Retornando o valor formatado
  return value;
}

// Função para adicionar uma nova despesa na lista
function expenseAdd(newExpense) {
  try {
    //Cria o elemento (li) para adicionar na lista (ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //Cria o ícone da categoria da despesa
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", `Ícone de tipo ${newExpense.category_name}`);

    //Cria as informações da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.name;

    // Cria o categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    //Adiciona nome e categoria no elemento (div)
    expenseInfo.append(expenseName, expenseCategory);

    //Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    //Adiciona ícone de remover despesa
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "Remover");

    //Adiciona as informações da despesa no elemento (li)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    //Adiciona o item na lista
    expenseList.append(expenseItem);

    // Limpando o formulário para adicionar um novo item
    formClear();

    //Atualiza os totais
    updateTotals();

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas");
    console.log(error);
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    //Recupera todos os elementos (li) da lista (ul)
    const items = expenseList.children;

    //Atualiza a quantidade de despesas da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

    //Variável para incrementar total das despesas
    let total = 0;

    //Percorre todos os elementos (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      //Remover caracteres não numéricos e trocar vírgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");

      //Converter o valor para float
      value = parseFloat(value);

      //Verificar se o valor é um número válido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número.");
      }

      //Incrementa o valor total
      total += Number(value);
    }

    //Criar a span para adicionar o elemento R$ formatado
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    //Formata o valor e remove o símbolo R$ que sera exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    //Limpa o conteúdo do elemento
    expenseTotal.innerHTML = "";

    //Adiciona o simbolo e o valor total formatado
    expenseTotal.append(symbolBRL, total);

    //Atualiza o total das despesas
    // expenseTotal.textContent = formatCurrencyBRL(total);

  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais");
  }
}

//Evento que capta o clique nos itens da lista
expenseList.onclick = (event) => {

  //Verifica se o elemento clicado é o ícone de remover
  if (event.target.classList.contains("remove-icon")) {

    //Recupera o elemento pai do ícone de remover
    const item = event.target.closest(".expense");

    //Remove o item da lista
    item.remove();

    //Atualiza os totais
    updateTotals();
  }
}

function formClear() {
  expenseName.value = "";
  expenseAmount.value = "";
  expenseCategory.value = "";

  //Coloca o foco no campo do nome da despesa
  expenseName.focus(); 
}