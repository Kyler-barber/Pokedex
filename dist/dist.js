const pokemonRepository = (function () {
  let e = [],
    t = [
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
  function o(t) {
    console.log(`Adding Pok\xe9mon: ${t.name}`), e.push(t);
  }
  function a() {
    return console.log("Fetching all Pok\xe9mon in the list."), e;
  }
  async function l() {
    console.log("Loading Pok\xe9mon list from API.");
    try {
      document.getElementById("loading-spinner").style.display = "block";
      let e = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=150"),
        t = await e.json();
      (document.getElementById("loading-spinner").style.display = "none"),
        t.results.forEach((e, t) => {
          let a = { name: e.name, detailsUrl: e.url, pokedexNumber: t + 1 };
          o(a);
        }),
        pokemonRepository
          .getAll()
          .sort((e, t) => e.pokedexNumber - t.pokedexNumber),
        pokemonRepository.getAll().forEach(function (e) {
          s(e);
        }),
        console.log("Pok\xe9mon list loaded and sorted successfully.");
    } catch (a) {
      console.error("Failed to load Pok\xe9mon list from API:", a);
    }
  }
  function n(e) {
    return (
      console.log(`Loading details for Pok\xe9mon: ${e.name}`),
      fetch(e.detailsUrl)
        .then((e) => e.json())
        .then((t) => {
          (e.imageUrl = t.sprites.front_default),
            (e.types = t.types.map((e) => e.type.name)),
            (e.hp = t.stats[0].base_stat),
            (e.attack = t.stats[1].base_stat),
            (e.defense = t.stats[2].base_stat),
            (e.abilities = t.abilities.map((e) => e.ability.name)),
            console.log(`Details loaded for Pok\xe9mon: ${e.name}`);
        })
        .catch((t) => {
          console.error(`Failed to load details for ${e.name}:`, t);
        })
    );
  }
  function i() {
    console.log("Rendering all Pok\xe9mon..."),
      a().forEach(async (e) => {
        await n(e), s(e);
      }),
      console.log("All Pok\xe9mon rendered.");
  }
  function s(e) {
    console.log(`Creating list item for Pok\xe9mon: ${e.name}`);
    let t = document.querySelector(".pokemon-list"),
      o = document.createElement("li");
    o.classList.add("list-group-item", "pokemon-item");
    let a = document.createElement("h2");
    (a.innerText = e.name), o.appendChild(a);
    let l = document.createElement("img");
    (l.src = e.imageUrl),
      l.classList.add("small-pokemon-image"),
      o.appendChild(l);
    let i = document.createElement("div");
    i.classList.add("type-bars"),
      (i.dataset.types = e.types.join(",")),
      e.types.forEach((e) => {
        var t;
        let o = document.createElement("div");
        o.classList.add("type-bar"),
          (o.style.backgroundColor =
            ((t = e),
            console.log(`Getting color for type: ${t}`),
            {
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
            }[t.toLowerCase()] || "#ccc"));
        let a = document.createElement("span");
        (a.innerText = e),
          a.classList.add("type-label"),
          (a.style.color = "#fff"),
          o.appendChild(a),
          i.appendChild(o);
      }),
      o.appendChild(i);
    let s = document.createElement("button");
    s.classList.add("btn", "btn-primary"),
      s.setAttribute("data-toggle", "modal"),
      s.setAttribute("data-target", "#pokemonModal"),
      (s.innerText = "View Details"),
      o.appendChild(s),
      t.appendChild(o),
      s.addEventListener("click", () => {
        var t;
        (t = e),
          console.log("Showing details for Pok\xe9mon: " + t.name),
          n(t).then(function () {
            let e = document.querySelector("#pokemonModalLabel"),
              o = document.querySelector("#pokemonModal .modal-body");
            (e.innerText = `#${t.pokedexNumber} ${t.name.toUpperCase()}`),
              (o.innerHTML = `
        <img src="${t.imageUrl}" alt="${t.name}" class="pokemon-modal-image">
        <p>Types: ${t.types.join(", ")}</p>
        <p>Abilities: ${t.abilities.join(", ")}</p>
        <div class="stats">
          <p>HP: ${t.hp}</p>
          <div class="stat-bar"><div class="bar" style="width: ${Math.min(
            t.hp,
            100
          )}%;"></div></div>
          <p>Attack: ${t.attack}</p>
          <div class="stat-bar"><div class="bar" style="width: ${Math.min(
            t.attack,
            100
          )}%;"></div></div>
          <p>Defense: ${t.defense}</p>
          <div class="stat-bar"><div class="bar" style="width: ${Math.min(
            t.defense,
            100
          )}%;"></div></div>
        </div>
      `),
              $("#pokemonModal").modal("show");
          });
      }),
      console.log(`List item created for Pok\xe9mon: ${e.name}`);
  }
  function d(e) {
    console.log("Closing modal."),
      e.classList.remove("show"),
      setTimeout(() => {
        e.classList.add("hide"), console.log("Modal closed.");
      }, 500);
  }
  return (
    document
      .getElementById("type-dropdown")
      .addEventListener("change", function (e) {
        console.log(`Type dropdown changed: ${e.target.value}`),
          (function e(t) {
            console.log(`Filtering Pok\xe9mon by type: ${t}`);
            let o = document.querySelectorAll(".pokemon-list li");
            o.forEach((e) => {
              let o = e.querySelector(".type-bars").dataset.types.split(",");
              "" === t || o.includes(t)
                ? (e.style.display = "flex")
                : (e.style.display = "none");
            });
          })(e.target.value);
      }),
    document
      .getElementById("pokemon-search")
      .addEventListener("input", function (e) {
        let t = e.target.value.toLowerCase();
        console.log(`Searching Pok\xe9mon with query: ${t}`);
        let o = document.querySelectorAll(".pokemon-list li");
        o.forEach(function (e) {
          let o = e.querySelector("h2").innerText.toLowerCase();
          o.includes(t)
            ? (e.style.display = "flex")
            : (e.style.display = "none");
        });
      }),
    document
      .getElementById("dark-mode-toggle")
      .addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        let e = document.body.classList.contains("dark-mode")
          ? "dark"
          : "light";
        localStorage.setItem("theme", e),
          console.log(`Toggled dark mode. Current theme: ${e}`);
      }),
    window.addEventListener("load", function () {
      let e = localStorage.getItem("theme");
      "dark" === e && document.body.classList.add("dark-mode"),
        console.log("Page loaded. Applying saved theme."),
        (function e() {
          let o = document.getElementById("type-dropdown");
          console.log(
            "Populating type dropdown with available Pok\xe9mon types."
          ),
            t.forEach((e) => {
              let t = document.createElement("option");
              (t.value = e),
                (t.textContent = e.charAt(0).toUpperCase() + e.slice(1)),
                o.appendChild(t);
            }),
            console.log("Dropdown populated successfully.");
        })();
    }),
    l().then(() => {
      a().forEach((e) => {
        n(e).then(() => s(e));
      });
    }),
    { getAll: a, add: o, addListItem: s, loadList: l, loadDetails: n }
  );
})();
