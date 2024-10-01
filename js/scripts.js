// IIFE to create a Pokemon repository and keep variables encapsulated
const pokemonRepository = (function () {
  // Array to store Pokemon data
  let pokemonList = [];
  // API URL to fetch Pokemon data
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  
  // Array of available Pokemon types for filtering
  const types = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark",
    "steel", "fairy"
  ];

  // Function to populate the Pokemon type dropdown
  function populateTypeDropdown() {
    const dropdown = document.getElementById("type-dropdown"); // Get the dropdown element
    console.log("Populating type dropdown with available Pokemon types.");
    // Iterate over types and create option elements for the dropdown
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter
      dropdown.appendChild(option); // Add option to dropdown
    });
    console.log("Dropdown populated successfully.");
  }

  // Function to filter Pokemon by type
  function filterByType(type) {
    console.log(`Filtering Pokemon by type: ${type}`);
    const allPokemon = document.querySelectorAll(".pokemon-list li"); // Get all Pokemon list items
    // Iterate over all Pokemon and filter based on selected type
    allPokemon.forEach((pokemonItem) => {
      const pokemonTypes = pokemonItem
        .querySelector(".type-bars")
        .dataset.types.split(",");
      if (type === "" || pokemonTypes.includes(type)) {
        pokemonItem.style.display = "flex"; // Show matching Pokemon
      } else {
        pokemonItem.style.display = "none"; // Hide non-matching Pokemon
      }
    });
  }

  // Event listener for type dropdown changes
  document
    .getElementById("type-dropdown")
    .addEventListener("change", function (event) {
      console.log(`Type dropdown changed: ${event.target.value}`);
      filterByType(event.target.value); // Filter Pokemon based on selected type
    });

  // Function to add a Pokemon to the list
  function add(pokemon) {
    console.log(`Adding Pokemon: ${pokemon.name}`);
    pokemonList.push(pokemon); // Add Pokemon to the pokemonList array
  }

  // Function to get all Pokemon in the list
  function getAll() {
    console.log("Fetching all Pokemon in the list.");
    return pokemonList; // Return the pokemonList array
  }

  // Function to load the Pokemon list from the API
  async function loadList() {
    console.log("Loading Pokemon list from API.");
    try {
      document.getElementById("loading-spinner").style.display = "block"; // Show loading spinner
      const response = await fetch(apiUrl); // Fetch Pokemon data from the API
      const json = await response.json(); // Parse JSON response
      document.getElementById("loading-spinner").style.display = "none"; // Hide loading spinner
      // Add each Pokemon from the API response to the list
      json.results.forEach((item, index) => {
        const pokemon = {
          name: item.name,
          detailsUrl: item.url,
          pokedexNumber: index + 1, // Assign Pokedex number to each Pokemon
        };
        add(pokemon); // Add Pokemon to the list
      });

      // Sort Pokemon by Pokedex number before rendering
      pokemonRepository
        .getAll()
        .sort((a, b) => a.pokedexNumber - b.pokedexNumber);

      // Render each Pokemon in the sorted list
      pokemonRepository.getAll().forEach(function (pokemon) {
        addListItem(pokemon);
      });

      console.log("Pokemon list loaded and sorted successfully.");
    } catch (error) {
      console.error("Failed to load Pokemon list from API:", error); // Log error if API call fails
    }
  }

  // Function to load detailed information for a specific Pokemon
  function loadDetails(pokemon) {
    console.log(`Loading details for Pokemon: ${pokemon.name}`);
    return fetch(pokemon.detailsUrl) // Fetch details from the Pokemon's details URL
      .then((response) => response.json()) // Parse JSON response
      .then((details) => {
        // Add additional details to the Pokemon object
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.types = details.types.map((typeInfo) => typeInfo.type.name);
        pokemon.hp = details.stats[0].base_stat;
        pokemon.attack = details.stats[1].base_stat;
        pokemon.defense = details.stats[2].base_stat;
        pokemon.abilities = details.abilities.map(
          (abilityInfo) => abilityInfo.ability.name
        );
        console.log(`Details loaded for Pokemon: ${pokemon.name}`);
      })
      .catch((error) => {
        console.error(`Failed to load details for ${pokemon.name}:`, error); // Log error if details fetch fails
      });
  }

  // Function to render all Pokemon in the list
  function renderAllPokemon() {
    console.log("Rendering all Pokemon...");
    getAll().forEach(async (pokemon) => {
      await loadDetails(pokemon); // Wait for details to load before adding
      addListItem(pokemon); // Render each Pokemon after details are loaded
    });
    console.log("All Pokemon rendered.");
  }

  // Function to add a Pokemon to the DOM as a list item
  function addListItem(pokemon) {
    console.log(`Creating list item for Pokemon: ${pokemon.name}`);

    let pokemonListElement = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "pokemon-item"); // Add Bootstrap and custom class

    let name = document.createElement("h2");
    name.innerText = pokemon.name;
    listItem.appendChild(name);

    // Add Pokemon image with alt text
    let image = document.createElement("img");
    image.src = pokemon.imageUrl;
    image.classList.add("small-pokemon-image");
    image.alt = `Image of ${pokemon.name}`; // Add alt attribute for accessibility
    listItem.appendChild(image);

    // Add type bars for the Pokemon
    let typeContainer = document.createElement("div");
    typeContainer.classList.add("type-bars");
    typeContainer.dataset.types = pokemon.types.join(","); // Store types in data attribute

    pokemon.types.forEach((type) => {
      let typeBar = document.createElement("div");
      typeBar.classList.add("type-bar");
      typeBar.style.backgroundColor = getTypeColor(type); // Set type color

      let typeLabel = document.createElement("span");
      typeLabel.innerText = type;
      typeLabel.classList.add("type-label");
      typeLabel.style.color = "#fff"; // White text for type labels

      typeBar.appendChild(typeLabel);
      typeContainer.appendChild(typeBar);
    });

    listItem.appendChild(typeContainer);

    // Add button to view Pokemon details in a modal
    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");
    button.innerText = "View Details";
    listItem.appendChild(button);

    pokemonListElement.appendChild(listItem);

    // Event listener for showing Pokemon details in the modal
    button.addEventListener("click", () => {
      showDetails(pokemon);
    });

    console.log(`List item created for Pokemon: ${pokemon.name}`);
  }

  // Function to show Pokemon details in the modal
  function showDetails(pokemon) {
    console.log("Showing details for Pokemon: " + pokemon.name);

    loadDetails(pokemon).then(function () {
      const modalTitle = document.querySelector("#pokemonModalLabel");
      const modalBody = document.querySelector("#pokemonModal .modal-body");

      // Update modal title with Pokemon name and Pokedex number
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

      // Trigger the modal after content is loaded
      $("#pokemonModal").modal("show");
    });
  }

  // Function to close the modal
  function closeModal(modalContainer) {
    console.log("Closing modal.");
    modalContainer.classList.remove("show");

    setTimeout(() => {
      modalContainer.classList.add("hide");
      console.log("Modal closed.");
    }, 500); // Delay for smooth transition
  }

  // Function to get the color associated with a Pokemon type
  function getTypeColor(type) {
    const typeColors = {
      normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
      grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
      ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
      rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
      steel: "#B8B8D0", fairy: "#EE99AC"
    };
    console.log(`Getting color for type: ${type}`);
    return typeColors[type.toLowerCase()] || "#ccc"; // Return color for type or default to grey
  }

  // Event listener for Pokemon search input
  document
    .getElementById("pokemon-search")
    .addEventListener("input", function (event) {
      const searchQuery = event.target.value.toLowerCase();
      console.log(`Searching Pokemon with query: ${searchQuery}`);
      const allPokemon = document.querySelectorAll(".pokemon-list li");
      // Filter Pokemon based on search input
      allPokemon.forEach(function (pokemonItem) {
        const pokemonName = pokemonItem
          .querySelector("h2")
          .innerText.toLowerCase();
        if (pokemonName.includes(searchQuery)) {
          pokemonItem.style.display = "flex"; // Show matching Pokemon
        } else {
          pokemonItem.style.display = "none"; // Hide non-matching Pokemon
        }
      });
    });

  // Event listener for dark mode toggle
  document
    .getElementById("dark-mode-toggle")
    .addEventListener("click", function () {
      document.body.classList.toggle("dark-mode"); // Toggle dark mode class
      const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      localStorage.setItem("theme", theme); // Store theme in localStorage
      console.log(`Toggled dark mode. Current theme: ${theme}`);
    });

  // Event listener for page load to apply saved theme and populate dropdown
  window.addEventListener("load", function () {
    const savedTheme = localStorage.getItem("theme"); // Get saved theme from localStorage
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode"); // Apply dark mode if saved
    }
    console.log("Page loaded. Applying saved theme.");
    populateTypeDropdown(); // Populate the Pokemon type dropdown
  });

  // Load and render Pokemon when the page loads
  loadList().then(() => {
    getAll().forEach((pokemon) => {
      loadDetails(pokemon).then(() => addListItem(pokemon));
    });
  });

  // Return public methods of the Pokemon repository
  return {
    getAll,
    add,
    addListItem,
    loadList,
    loadDetails,
  };
})();
