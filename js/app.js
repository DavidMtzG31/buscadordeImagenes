const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');
const paginacionDiv = document.getElementById('paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


formulario.addEventListener('submit', validarFormulario)

function validarFormulario(e) {
    e.preventDefault();
    
    spinner();

    const terminoBusqueda = document.getElementById('termino').value;

    if( terminoBusqueda === '') {
        alerta('Introduce un término de búsqueda');
        return;
    }
        buscarImagenes();

}

function buscarImagenes() {

    const termino = document.getElementById('termino').value;
    const key = '30188482-4eb1959150027a308bf27e95a';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then( (respuesta) => 
            respuesta.json()
        )
        .then( (datos) => {
            totalPaginas = calcularPaginas(datos.totalHits);
            mostrarImagenes(datos);
        })
}


function calcularPaginas(total) {
    return parseInt( Math.ceil(total / registrosPorPagina) )
}



// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total) {
    for(let i = 1; i <= total; i++) {
        yield i;
    }
}




function mostrarImagenes(datos) {
    const { hits, total } = datos;
    if(total === 0) {
        alerta('Búsqueda sin restultados');
        return;
    }

    // Limpia el html en caso de que haya búsquedas anteriores
    limpiarHTML();

    // Iterar sobre el arreglo de imagenes y construir el html
    hits.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <a href="${largeImageURL}" target="_blank" rel=”noreferrer noopener”> <img class="w-full" src="${previewURL}"> </a>
                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me gusta </span> </p>
                        <p class="font-bold"> ${views} <span class="font-light"> Veces vista </span> </p>
                        <a 
                            class=" block w-full bg-blue-800  hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel=”noreferrer noopener”
                        > 
                            Ver Imagen 
                        </a>
                    </div>
                </div>
            </div>
        `;   
    });

    // Limpiar paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    // Generar nuevo HTML del paginador
    imprimirPaginador();
}



function alerta(mensaje) {
    Swal.fire({
        icon: 'warning',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      })
}

function imprimirPaginador() {
    const iterador = crearPaginador(totalPaginas);

    while(true) {
        const {value, done} = iterador.next();

        if(done) return;

        // Caso contrario genera un botór por casa elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();

        }

        paginacionDiv.appendChild(boton);

    }
}

function limpiarHTML() {
        while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {
    limpiarHTML();
    const divSpiner = document.createElement('div');
    divSpiner.classList.add('sk-circle');
    divSpiner.innerHTML = `
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    `
    resultado.appendChild(divSpiner);
}