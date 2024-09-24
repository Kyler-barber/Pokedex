const pokemonRepository = (function () {
  let pokemonList = [];
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  // Types of pokemon
  function populateTypeDropdown() {
    const dropdown = document.getElementById("type-dropdown");
    console.log("Populating type dropdown with available Pokémon types.");
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      dropdown.appendChild(option);
    });
    console.log("Dropdown populated successfully.");
  }

  // Filter
  function filterByType(type) {
    console.log(`Filtering Pokémon by type: ${type}`);
    const allPokemon = document.querySelectorAll(".pokemon-list li");
    allPokemon.forEach((pokemonItem) => {
      const pokemonTypes = pokemonItem
        .querySelector(".type-bars")
        .dataset.types.split(",");
      if (type === "" || pokemonTypes.includes(type)) {
        pokemonItem.style.display = "flex";
      } else {
        pokemonItem.style.display = "none";
      }
    });
  }

  document
    .getElementById("type-dropdown")
    .addEventListener("change", function (event) {
      console.log(`Type dropdown changed: ${event.target.value}`);
      filterByType(event.target.value);
    });

  function add(pokemon) {
    console.log(`Adding Pokémon: ${pokemon.name}`);
    pokemonList.push(pokemon);
  }

  function getAll() {
    console.log("Fetching all Pokémon in the list.");
    return pokemonList;
  }

  // Modify loadList function to sort by pokedexNumber
  async function loadList() {
    console.log("Loading Pokémon list from API.");
    try {
      document.getElementById("loading-spinner").style.display = "block";
      const response = await fetch(apiUrl);
      const json = await response.json();
      document.getElementById("loading-spinner").style.display = "none";
      json.results.forEach((item, index) => {
        const pokemon = {
          name: item.name,
          detailsUrl: item.url,
          pokedexNumber: index + 1, // Assign Pokedex number
        };
        add(pokemon);
      });

      // Sort Pokemon by Pokedex Number before rendering
      pokemonRepository
        .getAll()
        .sort((a, b) => a.pokedexNumber - b.pokedexNumber);

      // Render the sorted Pokemon
      pokemonRepository.getAll().forEach(function (pokemon) {
        addListItem(pokemon);
      });

      console.log("Pokémon list loaded and sorted successfully.");
    } catch (error) {
      console.error("Failed to load Pokémon list from API:", error);
    }
  }

  // Loading details for pokemon
  function loadDetails(pokemon) {
    console.log(`Loading details for Pokémon: ${pokemon.name}`);
    return fetch(pokemon.detailsUrl)
      .then((response) => response.json())
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.types = details.types.map((typeInfo) => typeInfo.type.name);
        pokemon.hp = details.stats[0].base_stat;
        pokemon.attack = details.stats[1].base_stat;
        pokemon.defense = details.stats[2].base_stat;
        pokemon.abilities = details.abilities.map(
          (abilityInfo) => abilityInfo.ability.name
        );
        console.log(`Details loaded for Pokémon: ${pokemon.name}`);
      })
      .catch((error) => {
        console.error(`Failed to load details for ${pokemon.name}:`, error);
      });
  }

  function addListItem(pokemon) {
    console.log(`Creating list item for Pokémon: ${pokemon.name}`);

    let pokemonListElement = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "pokemon-item"); // Added list-group-item for Bootstrap while keeping custom class

    let name = document.createElement("h2");
    name.innerText = pokemon.name;
    listItem.appendChild(name);

    // Add Pokemon Image
    let image = document.createElement("img");
    image.src = pokemon.imageUrl;
    image.classList.add("small-pokemon-image");
    listItem.appendChild(image);

    // Add Type Bars
    let typeContainer = document.createElement("div");
    typeContainer.classList.add("type-bars");
    typeContainer.dataset.types = pokemon.types.join(",");

    pokemon.types.forEach((type) => {
      let typeBar = document.createElement("div");
      typeBar.classList.add("type-bar");
      typeBar.style.backgroundColor = getTypeColor(type);

      let typeLabel = document.createElement("span");
      typeLabel.innerText = type;
      typeLabel.classList.add("type-label");
      typeLabel.style.color = "#fff";

      typeBar.appendChild(typeLabel);
      typeContainer.appendChild(typeBar);
    });

    listItem.appendChild(typeContainer);

    // Add Bootstrap-styled Button for Modal
    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");
    button.innerText = "View Details";
    listItem.appendChild(button);

    pokemonListElement.appendChild(listItem);

    // Event Listener for Modal
    button.addEventListener("click", () => {
      showDetails(pokemon);
    });

    console.log(`List item created for Pokémon: ${pokemon.name}`);
  }

  // Showing details
  function showDetails(pokemon) {
    console.log(`Showing details for Pokémon: ${pokemon.name}`);
    loadDetails(pokemon).then(function () {
      const modalTitle = document.querySelector("#pokemonModalLabel");
      const modalBody = document.querySelector("#pokemonModal .modal-body");

      // Update modal title
      modalTitle.innerText = `#${
        pokemon.pokedexNumber
      } ${pokemon.name.toUpperCase()}`;

      // Populate modal body with Pokemon details
      modalBody.innerHTML = `
        <img src="${pokemon.imageUrl}" alt="${
        pokemon.name
      }" class="pokemon-modal-image">
        <p>Types: ${pokemon.types.join(", ")}</p>
        <p>Abilities: ${pokemon.abilities.join(", ")}</p>
        <div class="stats">
          <p>HP: ${pokemon.hp}</p>
          <div class="stat-bar"><div class="bar" style="width: ${Math.min(
            pokemon.hp,
            100
          )}%;"></div></div>
          <p>Attack: ${pokemon.attack}</p>
          <div class="stat-bar"><div class="bar" style="width: ${Math.min(
            pokemon.attack,
            100
          )}%;"></div></div>
          <p>Defense: ${pokemon.defense}</p>
          <div class="stat-bar"><div class="bar" style="width: ${Math.min(
            pokemon.defense,
            100
          )}%;"></div></div>
        </div>
      `;

      // Show the modal
      $("#pokemonModal").modal("show");
    });
  }

  function closeModal(modalContainer) {
    console.log("Closing modal.");
    modalContainer.classList.remove("show");

    setTimeout(() => {
      modalContainer.classList.add("hide");
      console.log("Modal closed.");
    }, 500);
  }

  function getTypeColor(type) {
    const typeColors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    console.log(`Getting color for type: ${type}`);
    return typeColors[type.toLowerCase()] || "#ccc";
  }

  document
    .getElementById("pokemon-search")
    .addEventListener("input", function (event) {
      const searchQuery = event.target.value.toLowerCase();
      console.log(`Searching Pokémon with query: ${searchQuery}`);
      const allPokemon = document.querySelectorAll(".pokemon-list li");
      allPokemon.forEach(function (pokemonItem) {
        const pokemonName = pokemonItem
          .querySelector("h2")
          .innerText.toLowerCase();
        if (pokemonName.includes(searchQuery)) {
          pokemonItem.style.display = "flex";
        } else {
          pokemonItem.style.display = "none";
        }
      });
    });

  document
    .getElementById("dark-mode-toggle")
    .addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      localStorage.setItem("theme", theme);
      console.log(`Toggled dark mode. Current theme: ${theme}`);
    });

  window.addEventListener("load", function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
    console.log("Page loaded. Applying saved theme.");
    populateTypeDropdown();
  });

  loadList().then(() => {
    getAll().forEach((pokemon) => {
      loadDetails(pokemon).then(() => addListItem(pokemon));
    });
  });

  return {
    getAll,
    add,
    addListItem,
    loadList,
    loadDetails,
  };
})();
