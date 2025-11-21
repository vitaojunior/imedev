const cardContainer = document.querySelector(".card-container");
const filtroPlataforma = document.querySelector("#filtro-plataforma");
const campoBusca = document.querySelector("input[type='text']");
let dados = [];

// Adiciona um evento para tocar o áudio após a primeira interação do usuário
document.body.addEventListener('click', tocarAudio, { once: true });

function tocarAudio() {
    const audio = document.getElementById('retro-audio');
    audio.volume = 0.2; // Ajuste o volume conforme necessário
    audio.play().catch(error => {
        // O autoplay pode ser bloqueado pelo navegador, o que é normal.
        console.log("A reprodução automática do áudio foi bloqueada pelo navegador.");
    });
}

function renderizarCards(jogosParaRenderizar) {
    cardContainer.innerHTML = "";

    for (const jogo of jogosParaRenderizar) {
        const article = document.createElement("article");
        article.classList.add("card"); // Adiciona a classe card para estilização

        // Cria o HTML para as tags
        const tagsHtml = jogo.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        article.innerHTML = `
        <h2>${jogo.nome}</h2>
        <p><strong>Ano:</strong> ${jogo.data_criacao} | <strong>Plataforma:</strong> ${jogo.plataforma}</p>
        <p>${jogo.descricao}</p>
        <div class="tags-container">${tagsHtml}</div>
        <a href="${jogo.link}" target="_blank">SABER MAIS...</a>
        `;
        cardContainer.appendChild(article);
    }

    // Agora que todos os cards estão no DOM, aplicamos a animação
    const cards = cardContainer.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => card.classList.add('visivel'), index * 100); // Efeito escalonado
    });
}

function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();
    const plataformaSelecionada = filtroPlataforma.value;

    const dadosFiltrados = dados.filter(jogo => {
        // Verifica se o nome do jogo corresponde ao termo de busca
        const correspondeBusca = jogo.nome.toLowerCase().includes(termoBusca);
        
        // Verifica se a plataforma corresponde à selecionada (ou se "Todas" foi selecionada)
        const correspondePlataforma = !plataformaSelecionada || jogo.plataforma === plataformaSelecionada;
        
        return correspondeBusca && correspondePlataforma;
    });

    renderizarCards(dadosFiltrados);
}

// Função para extrair plataformas únicas e popular o <select>
function popularSeletorDePlataformas(jogos) {
    if (!filtroPlataforma) {
        console.error('O elemento <select> com id "filtro-plataforma" não foi encontrado.');
        return;
    }

    // Extrai todas as plataformas do array de jogos
    const todasAsPlataformas = jogos.map(jogo => jogo.plataforma);
    
    // Usa um Set para obter apenas os valores únicos e depois converte para array
    const plataformasUnicas = [...new Set(todasAsPlataformas)];

    // Ordena as plataformas em ordem alfabética
    plataformasUnicas.sort();

    // Cria e adiciona um <option> para cada plataforma única
    plataformasUnicas.forEach(plataforma => {
        const option = document.createElement('option');
        option.value = plataforma;
        option.textContent = plataforma;
        filtroPlataforma.appendChild(option);
    });
}

// Garante que o script será executado após o carregamento completo do HTML
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        dados = await response.json(); // Armazena os dados na variável global
        
        // Agora que os dados estão carregados, podemos popular o filtro e renderizar os cards
        popularSeletorDePlataformas(dados);
        renderizarCards(dados);

    } catch (error) {
        console.error("Não foi possível carregar os dados dos jogos:", error);
    }
});
