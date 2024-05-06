let pokeNombres = [];
let equipoActual = [];
let equiposPokemon = [];

// Función para agregar el Puchamon al arreglo
document.getElementById("btn_agregar").addEventListener("click", async function() {
    const pokemonAgregado = document.getElementById("pokemon");
    const pokeNombre = pokemonAgregado.value.toLowerCase();
    try {
        const pokemonIngresado = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokeNombre);
        const pokeInfo = await pokemonIngresado.json();
        
        if (equipoActual.length < 3) {
            const poke = {
                id: pokeInfo.id,
                nombre: pokeInfo.name,
                imagen: pokeInfo.sprites.front_default,
                experiencia: pokeInfo.base_experience,
                habilidad: pokeInfo.abilities[0].ability.name
            };
            
            equipoActual.push(poke);
            pokemonAgregado.value = "";
            console.log("Pokémon agregado: " + pokeNombre);
            mostrarAlerta("Puchamon agregado correctamente.", "success");
            
            if (equipoActual.length === 3) {
                document.getElementById("pokemon").disabled = true;
                document.getElementById("btn_agregar").disabled = true;
                equiposPokemon.push(equipoActual.slice()); // Guardar el equipo actual en el historial y luego la alerta
                mostrarAlerta("Equipo completo.", "warning");
            }
        } 
    } catch (error) {
        console.error("Error al obtener los datos del Pokémon: ", error);
    }
});

// Función para mostrar la información de los Pokémons
document.getElementById("btn_mostrar").addEventListener("click", function() {
    const pokeLista = document.getElementById("lista_pokemones");
    pokeLista.innerHTML = "";
    equipoActual.sort((a, b) => b.experiencia - a.experiencia);

    equipoActual.forEach(poke => {
        const poke_elemento = document.createElement("div");
        poke_elemento.classList.add("col-sm-4", "mb-4");
        poke_elemento.innerHTML = `
            <div class="card progress-bar progress-bar-striped bg-secondary fw-bold">
                <h5 class="card-title text-primary text-uppercase py-3 progress-bar progress-bar-striped bg-warning">${poke.nombre}</h5>
                <img src="${poke.imagen}" class="card-img-top" alt="${poke.nombre}">
                <div class="card-body progress-bar progress-bar-striped bg-warning text-dark">
                    <p class="card-text text-wrap">Número de Pokédex: #${poke.id}</p>
                    <p class="card-text text-wrap">Experiencia base: ${poke.experiencia} XP</p>
                    <p class="card-text text-wrap">Primera habilidad: ${poke.habilidad}</p>
                </div>
            </div>
        `;
        pokeLista.appendChild(poke_elemento);
    });
});


// Función para reestablecer el equipo
document.getElementById("btn_reset").addEventListener("click", function() {
    mostrarAlerta("A la trash con este equipo ԅ(¯﹃¯ԅ)", "secondary");
    equipoActual = [];
    const pokeLista = document.getElementById("lista_pokemones");
    pokeLista.innerHTML = "";
    document.getElementById("pokemon").disabled = false;
    document.getElementById("btn_agregar").disabled = false;
});

// Función para mostrar el historial de equipos
document.getElementById("btn_historial").addEventListener("click", function() {
    const historialEquipos = document.getElementById("historial_equipos");
    historialEquipos.innerHTML = "";
  
    equiposPokemon.forEach((equipo, index) => {
      // Ordenar el equipo por XP de mayor a menor
      const equipoOrdenado = equipo.sort((a, b) => b.experiencia - a.experiencia);
  
      const equipoDiv = document.createElement("div");
      equipoDiv.classList.add("card", "mb-4");
      equipoDiv.innerHTML = `
        <div class="card-header progress-bar progress-bar-striped bg-warning">
          <h5 class="card-title">EQUIPO ${index + 1}</h5>
        </div>
        <div class="card-body progress-bar-striped bg-dark">
          ${equipoOrdenado.map(poke => `
            <div class="card mb-4 progress-bar progress-bar-striped bg-secondary">
              <div class="row">
                <div class="col-sm-5 my-3">
                  <img src="${poke.imagen}" class="card-img" alt="${poke.nombre}">
                </div>
                <div class="col-sm-7">
                  <div class="card card-body mx-2 my-4 fw-bold progress-bar progress-bar-striped bg-warning wh-100">
                    <h5 class="card-title text-uppercase text-primary">${poke.nombre}</h5>
                    <p class="card-text text-wrap">Número de Pokédex: #${poke.id}</p>
                    <p class="card-text text-wrap">Experiencia base: ${poke.experiencia}</p>
                    <p class="card-text text-wrap">Primera habilidad: ${poke.habilidad}</p>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      historialEquipos.appendChild(equipoDiv);
    });
  });

// Validaciones HTTP
document.getElementById("btn_agregar").addEventListener("click", async function() {
  const pokeNombre = document.getElementById("pokemon").value.toLowerCase();

  if (pokeNombre === "") {
    mostrarAlerta("Dale manin, introduce el nombre de un Puchamón ╰（‵□′）╯", "danger");
  } else {
    try { // La idea del try es primero ver si es posible un fetch a un DNS publico
      const pruebaDNS = await fetch('https://pokeapi.co/api/v2/pokemon/');
      if (pruebaDNS.ok) {
        const pokemonIngresado = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokeNombre);
        if (!pokemonIngresado.ok) {
          mostrarAlerta("Nombre de Pokémon incorrecto. ಠಿ_ಠ", "warning");
        } else {
          const pokeInfo = await pokemonIngresado.json();
        }
      } else {
        mostrarAlerta("No hay conexión a Internet. Verifica tu conexión y vuelve a intentarlo (´。＿。｀)", "danger");
      }
    } catch (error) {
      mostrarAlerta("No hay conexión a Internet. Verifica tu conexión y vuelve a intentarlo (´。＿。｀)", "danger");
    }
  }
});

// Alerta para cuando se quieran re pasar sin poner equipos.
document.getElementById("btn_historial").addEventListener("click", async function() {
  const pokeNombre = document.getElementById("pokemon").value.toLowerCase();
  if (equiposPokemon.length === 0) {
    mostrarAlerta("No has hecho ningún equipo man (* ￣︿￣)", "danger");
    }
});

// Guardar equipo actual en el historial al reestablecer
document.getElementById("btn_reset").addEventListener("click", function() {
    if (equipoActual.length > 0) {
        equiposPokemon.push(equipoActual.slice());
    }
});

// Formato para alertas personalizadas, se ve seco de otra forma
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement("div");
    alerta.classList.add("alert", `alert-${tipo}`, "mt-3");
    alerta.textContent = mensaje;

    const contenedor = document.querySelector(".container");
    contenedor.insertAdjacentElement("afterbegin", alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}
