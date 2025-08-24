// ui.js

// Importa o objeto "Cardapio" do arquivo lib.js.
// Isso nos dá acesso a todas as funções de gerenciamento de dados que criamos,
// como saveFoods, loadFoods, addFood, etc.
import { Cardapio } from './lib.js';

// chamando as funções com os botoes
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listener ao botão
    document.getElementById('btnSalvar').addEventListener('click', salvarComida);
    document.getElementById('btnRemover').addEventListener('click', removerComida);
});

// O evento 'DOMContentLoaded' garante que o código só será executado depois
// que a página HTML estiver totalmente carregada.
document.addEventListener('DOMContentLoaded', () => {

    // ======================================
    // Seção 1: Lógica de Navegação da Interface
    // ======================================

    // Seleciona todos os botões de navegação na barra lateral.
    const navButtons = Array.from(document.querySelectorAll('.nav-button'));
    // Seleciona todas as seções de conteúdo da página.
    const pageContents = Array.from(document.querySelectorAll('.page-content'));
    // Seleciona o formulário de adição de alimentos para conectar a um evento.
    //const formAdd = document.getElementById('form');

    // Função pura: calcula o novo estado da navegação.
    // Ela recebe o ID da página de destino e retorna um novo array
    // de objetos, indicando qual página deve estar ativa.
    const getNewActiveState = (targetId) => {
        return pageContents.map(page => ({
            id: page.id,
            isActive: page.id === targetId // Retorna true se a página atual é a de destino.
        }));
    };

    // Função de efeito colateral: aplica o novo estado à interface.
    // Ela recebe o estado calculado e atualiza as classes CSS no DOM
    // para mostrar a página correta e destacar o botão correspondente.
    const applyStateToDOM = (state, buttons, pages) => {
        // Remove a classe 'active' de todos os botões e páginas para "limpar" a tela.
        buttons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active-page'));
        
        // Encontra o ID da página que deve ser ativada.
        const activePageId = state.find(s => s.isActive).id;
        // Encontra o botão e a página que correspondem a esse ID.
        const targetButton = buttons.find(btn => btn.dataset.page === activePageId);
        const targetPage = pages.find(page => page.id === activePageId);

        // Adiciona a classe 'active' ou 'active-page' aos elementos corretos,
        // tornando-os visíveis e destacados.
        if (targetButton) {
            targetButton.classList.add('active');
        }
        if (targetPage) {
            targetPage.classList.add('active-page');
        }
    };

    // Adiciona um "ouvinte de evento de clique" a cada botão da barra lateral.
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Pega o ID da página que está no atributo 'data-page' do botão clicado.
            const targetId = event.currentTarget.dataset.page;
            
            // 1. Calcula o novo estado da navegação.
            const newState = getNewActiveState(targetId);

            // 2. Aplica o novo estado ao HTML (ao DOM).
            applyStateToDOM(newState, navButtons, pageContents);

             if (targetId === 'food-list') {
            renderFoods();
        }
        });
    });
})

    // ======================================
    // Seção 2: Lógica de Adição de Alimentos
    // ======================================
    
    // Pega os valores dos campos do formulário e cria um objeto com eles.
    // O ID é passado como argumento, pois ele precisa ser único.
    const askFoodData = (id) => ({
      id: id,
      name: document.getElementById('name').value,
      // Converte as strings dos inputs para números flutuantes (decimais).
      // O '.replace' garante que a vírgula (,) seja substituída por ponto (.)
      // para que o parseFloat funcione corretamente.
      carbs: parseFloat(document.getElementById('carb').value.replace(',', '.')),
      protein: parseFloat(document.getElementById('prot').value.replace(',', '.')),
      fat: parseFloat(document.getElementById('gord').value.replace(',', '.')),
      calories: parseFloat(document.getElementById('cal').value.replace(',', '.')),
    });
    
    // Função principal que é chamada quando o formulário é enviado.
    const salvarComida = (event) => {
        // Previne o comportamento padrão de recarregar a página ao enviar o formulário.
        event.preventDefault();

        // 1. Carrega a lista de alimentos atualizada do localStorage.
        const currentFoods = Cardapio.loadFoods();

        // 2. Calcula um novo ID. Se a lista não estiver vazia, ele pega o maior
        // ID existente e adiciona 1 para garantir que o novo ID seja único.
        const nextId = currentFoods.length > 0 ? Math.max(...currentFoods.map(food => food.id)) + 1 : 1;

        // 3. Pega os dados do formulário e cria um novo objeto de alimento,
        // usando o ID que acabamos de calcular.
        const novoAlimento = askFoodData(nextId);

        // 4. Usa a função `addFood` da biblioteca para adicionar o novo
        // alimento à lista existente.
        const updatedFoods = Cardapio.addFood(currentFoods, novoAlimento);
        
        // 5. Usa a função `saveFoods` da biblioteca para salvar a lista
        // completa e atualizada de volta no localStorage.
        Cardapio.saveFoods(updatedFoods);

        console.log("Alimento adicionado com sucesso:", novoAlimento);
        
        // Limpa todos os campos do formulário para o próximo uso.
        //formAdd.reset();

        // Chamar para quando for adicionado um item
        renderFoods()
    };

    // Adiciona um "ouvinte de evento de submissão" ao formulário de adição.
    // Quando o formulário é submetido, a função `salvarComida` é chamada.
    // formAdd.addEventListener('submit', salvarComida);

    // ======================================
    // Seção 3: Lógica de Exibição de Alimentos
    // ======================================

    // Essa parte será para chamar a função de Listar Alimentos

    const renderFoods = () =>{
        // Vai servir para carregar todas as comidas que há na lista, ou seja, as que estão no Local Storage
        const loadedFoods = Cardapio.loadFoods();

        const allFoods = loadedFoods.length === 0 ? Cardapio.resetFoods() : loadedFoods

        // Chamar a 'listFoods' para cada um dos filtros que foi aplicado
        const[proteinFoods, cabrsFoods, fatFoods] = Cardapio.listFood(allFoods);

        // Aqui serve para obter a referência aos elementos que estão no HTML pelo seu id
        const proteinList = document.getElementById('protein-list');
        const carbList = document.getElementById('carbs-list');
        const fatList = document.getElementById('fat-list');

        // Aqui vai servir para limpar a lista antes de renderizar, para poder evitar duplicatas a cada atualização da página
        proteinList.innerHTML = '';
        carbList.innerHTML = '';
        fatList.innerHTML = '';

        // Aqui será uma função auxiliar para criar um item de lista (<li>) com os dados dos alimentos
        const createListItem = (food) =>{
            const li= document.createElement('li');
            li.textContent = `${food.name} (P: ${food.protein}g, C: ${food.carbs}g, G: ${food.fat}g)`;
            return li;
        }

        // Aqui será a parte que irá iterar sobre cada lista filtrada e adicionará os itens ao HTML
        proteinFoods.forEach(food => proteinList.appendChild(createListItem(food)));
        cabrsFoods.forEach(food => carbList.appendChild(createListItem(food)));
        fatFoods.forEach(food => fatList.appendChild(createListItem(food)));

    }

    // Inicia a renderização quando a página abrir
    renderFoods()
     
    
     // ======================================
     // Seção 4: Lógica de Exclusão de Alimentos
     // ======================================

     // Essa parte servirá para esperar que seja enviado uma submissão para a parte de exclusão
     
     const removerComida = (event) => { 
        event.preventDefault(); // Isso está servindo para evitar que a página seja reccaregada quando o item for removido

        // Essa parte está evitando que nomes digitados errados por espaçamento sejam desconsiderados. O "trim" corrige esse erro
        const nameToRemove = document.getElementById('campo-excluir').value.trim();

        if (!nameToRemove) {
            alert("Por Favor, digite o nome do alimento que irá ser excluido.")
            return;
        }

        const presentFoods = Cardapio.loadFoods()
        
        // Essa parte irá filtrar a lista, pois irá usar a função para remover o alimento selecionado
        const newList = Cardapio.deleteFood(presentFoods,nameToRemove)
        if(newList.length <presentFoods.length) {
            // Salva a nova lista no Local Storage se a remoção funcionar
            Cardapio.saveFoods(newList);
            alert(`O alimento ${nameToRemove} foi removido com sucesso!!`)
            document.getElementById('campo-excluir').value = '' // Serve para limpar o campo
            renderFoods(); // Vai renderizar a lista de novo
        } else {
            alert(`O alimento "${nameToRemove}" não foi encontrado na lista.`)
        }

     }
