////////////// ADAPTAÇÃO DO CRUD DA BIBLIOTECA /////////////////

// Chave usada no localStorage para salvar os livros
const STORAGE_KEY = "dietas::foods"

// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================

// Carrega a lista de Alimentos do localStorage
// Se não existir nada salvo, retorna um array vazio
const loadFoods = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Salva a lista de Alimentos no localStorage (convertendo para texto JSON)
const saveFoods = foods =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foods))

// Remove todos os Alimentos do localStorage
const clearFoods = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log("Alimentos Removidos.")
}

// Restaura uma lista inicial de Alimentos (pré-cadastrados)
// Útil para resetar o sistema com dados de exemplo
const resetFoods = () => {
const foods = [
  { name: "Peito de Frango (cozido)", protein: 31, carbs: 0, fat: 3.6, calories: 165, portion: 0 },
  { name: "Arroz Integral (cozido)", protein: 2.6, carbs: 23, fat: 1, calories: 111, portion: 0 },
  { name: "Feijão Preto (cozido)", protein: 8.9, carbs: 23, fat: 0.9, calories: 132, portion: 0 },
  { name: "Brócolis (cozido)", protein: 2.8, carbs: 7, fat: 0.4, calories: 35, portion: 0 },
  { name: "Batata Doce (cozida)", protein: 1.6, carbs: 20, fat: 0.1, calories: 86, portion: 0 },
  { name: "Ovo Cozido", protein: 13, carbs: 1.1, fat: 11, calories: 155, portion: 0 },
  { name: "Aveia em Flocos", protein: 13, carbs: 68, fat: 6.9, calories: 379, portion: 0 },
  { name: "Salmão Grelhado", protein: 25, carbs: 0, fat: 13, calories: 208, portion: 0 },
  { name: "Amêndoas", protein: 21, carbs: 22, fat: 50, calories: 579, portion: 0 },
  { name: "Queijo Cottage", protein: 11, carbs: 3.4, fat: 4.3, calories: 98, portion: 0 }
];


  saveFoods(foods) // salva os alimentos no localStorage
  console.log("Lista de Alimentos salvos.")
  return foods              // retorna os alimentos
}

// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================

// Adiciona um novo alimento (retorna um novo array)
const addFood = (foods, newFood) => [...foods, newFood]

// Atualiza um alimento existente (caso encontre o id)
const updateFood = (foods, id, updates) =>
  foods.map(food => (food.id === id ? { ...food, ...updates } : food))

// Remove um Alimento pelo Nome
const deleteFood = (foods, nome) =>
  foods.filter(food => food.name.toLowerCase() !== nome.toLowerCase())



// ======================== 
// Listagem e formatação
// ========================



// Lista os Alimentos em formato de grupos por quantidade de Macronutrientes

const filterProtein = ([x,...xs]) =>{
  if (x === undefined) {return []}
  else if(x.protein >= x.carbs && x.protein >= x.fat) {
    return [x,...filterProtein(xs)]
  }
  else {return filterProtein(xs)}
}

const filterCarbs = ([x,...xs]) =>{
  if (x === undefined) {return[]}
  else if(x.carbs > x.protein && x.carbs >= x.fat){
    return [x,...filterCarbs(xs)]
  }
  else {return filterCarbs(xs)}
}

const filterFat = ([x,...xs]) => {
  if (x === undefined) {return[]}
  else if(x.fat > x.protein && x.fat > x.carbs){
    return [x,...filterFat(xs)]
  }
  else {return filterFat(xs)}
}

const listFood = (foods) =>{
  return [filterProtein(foods),filterCarbs(foods),filterFat(foods)]
}


// Lista apenas as informações de um alimento específico
const listSpecificFood = (foods, foodName) =>
  foods.filter(food => food.name === foodName)

// Permite formatar a lista de alimentos de forma flexível
// Recebe uma função "formatFn" que define como cada alimento deve aparecer
const formatFoods = (foods, formatFn) =>
  foods.map((food, index) => formatFn(food, index)).join('\n')

// Formatação curta: apenas o nome com numeração
const shortFormat = (food, i) => `${i + 1}. ${food.name}`

// Formatação completa: id, nome, proteínas, carboidratos, calorias e porções
const fullFormat = food =>
  `${food.id} - "${food.name}" (${food.protein},  ${food.carbs}, ${food.calories}, ${food.portion})`



// ========================
// Transformações adicionais
// ========================



// Adiciona uma categoria com base no tipo de alimento (função fornecida pelo usuário)
const addCategoryByName = (foods, classifyNameFn) =>
  foods.map(food => ({ ...food, category: classifyNameFn(food.name) }))

// Aplica uma transformação nos nomes (ex: deixar tudo maiúsculo)
const updateTitles = (foods, transformFn) =>
  foods.map(food => ({ ...food, name: transformFn(food.name) }))

// Permite renomear os campos de cada Alimento (ex: trocar "title" por "nome")
const renameFields = (foods, renamerFn) =>
  foods.map(food => renamerFn(food))



// ========================
// Exporta todas as funções como um objeto Cardapio
// Isso facilita o uso em outros arquivos (ex: ui.js)
// ========================


export const Cardapio = {
  // Persistência
  loadFoods, saveFoods, resetFoods, clearFoods,

  // CRUD
  addFood, updateFood, deleteFood,

  // Exibição
  listFood, listSpecificFood, formatFoods, shortFormat, fullFormat,

  // Transformações
  addCategoryByName, updateTitles, renameFields, filterProtein, filterCarbs, filterFat
}