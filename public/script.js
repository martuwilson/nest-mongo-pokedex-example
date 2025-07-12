// Variables globales
let currentOffset = 0;
const limit = 20;
let isLoading = false;

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const typeFilter = document.getElementById('typeFilter');
const randomBtn = document.getElementById('randomBtn');
const pokemonDetail = document.getElementById('pokemonDetail');
const pokemonGrid = document.getElementById('pokemonGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const closeBtn = document.getElementById('closeBtn');
const errorCloseBtn = document.getElementById('errorCloseBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadInitialPokemon();
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    randomBtn.addEventListener('click', getRandomPokemon);
    loadMoreBtn.addEventListener('click', loadMorePokemon);
    closeBtn.addEventListener('click', closePokemonDetail);
    errorCloseBtn.addEventListener('click', closeErrorMessage);
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });
    
    // Filtro por tipo
    typeFilter.addEventListener('change', filterByType);
}

// Funciones principales
async function loadInitialPokemon() {
    try {
        showLoading(true);
        const pokemon = await fetchPokemonList(currentOffset, limit);
        await displayPokemonGrid(pokemon.results);
        currentOffset += limit;
    } catch (error) {
        console.error('Error loading initial Pokemon:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

async function loadMorePokemon() {
    if (isLoading) return;
    
    try {
        isLoading = true;
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        
        const pokemon = await fetchPokemonList(currentOffset, limit);
        await displayPokemonGrid(pokemon.results, true);
        currentOffset += limit;
    } catch (error) {
        console.error('Error loading more Pokemon:', error);
        showError();
    } finally {
        isLoading = false;
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Cargar más Pokémon';
    }
}

async function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    try {
        showLoading(true);
        const pokemon = await fetchPokemonByName(query);
        displayPokemonDetail(pokemon);
    } catch (error) {
        console.error('Error searching Pokemon:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

async function getRandomPokemon() {
    try {
        showLoading(true);
        const randomId = Math.floor(Math.random() * 1010) + 1;
        const pokemon = await fetchPokemonByName(randomId.toString());
        displayPokemonDetail(pokemon);
    } catch (error) {
        console.error('Error getting random Pokemon:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

async function filterByType() {
    const selectedType = typeFilter.value;
    if (!selectedType) {
        // Si no hay tipo seleccionado, recargar la lista original
        currentOffset = 0;
        pokemonGrid.innerHTML = '';
        loadInitialPokemon();
        return;
    }
    
    try {
        showLoading(true);
        const typeData = await fetchPokemonByType(selectedType);
        const pokemonList = typeData.pokemon.slice(0, 50); // Limitar a 50 para performance
        
        pokemonGrid.innerHTML = '';
        await displayPokemonGrid(pokemonList.map(p => p.pokemon));
    } catch (error) {
        console.error('Error filtering by type:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

// Funciones de API
async function fetchPokemonList(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon list');
    return await response.json();
}

async function fetchPokemonByName(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error('Pokemon not found');
    return await response.json();
}

async function fetchPokemonByType(type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon by type');
    return await response.json();
}

async function fetchPokemonSpecies(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching species:', error);
        return null;
    }
}

// Funciones de display
async function displayPokemonGrid(pokemonList, append = false) {
    if (!append) {
        pokemonGrid.innerHTML = '';
    }
    
    const pokemonPromises = pokemonList.map(async (pokemon) => {
        try {
            const pokemonData = await fetchPokemonByName(pokemon.name);
            return createPokemonCard(pokemonData);
        } catch (error) {
            console.error(`Error loading ${pokemon.name}:`, error);
            return null;
        }
    });
    
    const pokemonCards = await Promise.all(pokemonPromises);
    pokemonCards.filter(card => card !== null).forEach(card => {
        pokemonGrid.appendChild(card);
    });
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-grid-card';
    card.addEventListener('click', () => displayPokemonDetail(pokemon));
    
    const types = pokemon.types.map(type => 
        `<span class="type-badge type-${type.type.name}">${translateType(type.type.name)}</span>`
    ).join('');
    
    card.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
             alt="${pokemon.name}" class="pokemon-grid-image">
        <h3 class="pokemon-grid-name">${pokemon.name}</h3>
        <p class="pokemon-grid-id">#${pokemon.id.toString().padStart(3, '0')}</p>
        <div class="pokemon-grid-types">${types}</div>
    `;
    
    return card;
}

async function displayPokemonDetail(pokemon) {
    // Actualizar información básica
    document.getElementById('pokemonId').textContent = pokemon.id.toString().padStart(3, '0');
    document.getElementById('pokemonName').textContent = pokemon.name;
    document.getElementById('pokemonImage').src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    document.getElementById('pokemonImage').alt = pokemon.name;
    
    // Tipos
    const typesContainer = document.getElementById('pokemonTypes');
    typesContainer.innerHTML = pokemon.types.map(type => 
        `<span class="type-badge type-${type.type.name}">${translateType(type.type.name)}</span>`
    ).join('');
    
    // Estadísticas
    displayStats(pokemon.stats);
    
    // Información general
    displayGeneralInfo(pokemon);
    
    // Movimientos
    displayMoves(pokemon.moves);
    
    // Mostrar el detalle
    pokemonDetail.style.display = 'block';
    pokemonDetail.scrollIntoView({ behavior: 'smooth' });
    
    // Activar la primera pestaña
    switchTab('stats');
}

function displayStats(stats) {
    const maxStat = 255; // Valor máximo típico para estadísticas
    
    stats.forEach(stat => {
        const statName = stat.stat.name.replace('-', '');
        const statValue = stat.base_stat;
        const percentage = (statValue / maxStat) * 100;
        
        const valueElement = document.getElementById(`${statName}Value`);
        const barElement = document.getElementById(`${statName}Bar`);
        
        if (valueElement && barElement) {
            valueElement.textContent = statValue;
            barElement.style.width = `${percentage}%`;
        }
    });
}

function displayGeneralInfo(pokemon) {
    document.getElementById('pokemonHeight').textContent = `${pokemon.height / 10} m`;
    document.getElementById('pokemonWeight').textContent = `${pokemon.weight / 10} kg`;
    document.getElementById('pokemonExperience').textContent = pokemon.base_experience;
    
    const abilitiesContainer = document.getElementById('pokemonAbilities');
    abilitiesContainer.innerHTML = pokemon.abilities.map(ability => 
        `<span class="ability-badge">${ability.ability.name}</span>`
    ).join('');
}

function displayMoves(moves) {
    const movesContainer = document.getElementById('pokemonMoves');
    const limitedMoves = moves.slice(0, 20); // Mostrar solo los primeros 20 movimientos
    
    movesContainer.innerHTML = limitedMoves.map(move => 
        `<div class="move-item">${move.move.name.replace('-', ' ')}</div>`
    ).join('');
}

// Funciones de utilidad
function switchTab(tabName) {
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Activar la pestaña seleccionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function translateType(type) {
    const translations = {
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Eléctrico',
        'psychic': 'Psíquico',
        'ice': 'Hielo',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'fairy': 'Hada',
        'normal': 'Normal',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'steel': 'Acero'
    };
    
    return translations[type] || type;
}

function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

function showError() {
    errorMessage.style.display = 'block';
}

function closeErrorMessage() {
    errorMessage.style.display = 'none';
}

function closePokemonDetail() {
    pokemonDetail.style.display = 'none';
}

// Función para manejar clicks en las tarjetas del grid
document.addEventListener('click', (e) => {
    if (e.target.closest('.pokemon-grid-card')) {
        const card = e.target.closest('.pokemon-grid-card');
        const pokemonName = card.querySelector('.pokemon-grid-name').textContent;
        
        fetchPokemonByName(pokemonName)
            .then(pokemon => displayPokemonDetail(pokemon))
            .catch(error => {
                console.error('Error loading Pokemon detail:', error);
                showError();
            });
    }
});

// Función para búsqueda en tiempo real (opcional)
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query.length >= 3) {
            // Implementar sugerencias de búsqueda aquí si se desea
        }
    }, 300);
});

// Función para manejar errores de imagen
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/200x200/334155/CBD5E1?text=No+Image';
    }
}, true);

// Función para lazy loading de imágenes (opcional)
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Función para animaciones de entrada
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in-out forwards';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pokemon-grid-card').forEach(card => {
        observer.observe(card);
    });
}

// Inicializar funciones adicionales cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Agregar funcionalidad de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePokemonDetail();
            closeErrorMessage();
        }
    });
});
