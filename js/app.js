const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');


formulario.addEventListener('submit', validarFormulario)

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.getElementById('termino').value;

    if( terminoBusqueda === '') {
        alerta('Introduce un término de búsqueda');
        return;
    }
    buscarImagenes(terminoBusqueda);
}

function buscarImagenes(termino) {
    const key = '30188482-4eb1959150027a308bf27e95a';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}`;

    fetch(url)
        .then( (respuesta) => 
            respuesta.json()
        )
        .then( (datos) => {
            mostrarImagenes(datos);
        })
}


function mostrarImagenes(datos) {
    const { hits, total } = datos;
    if(total === 0) {
        alerta('Búsqueda sin restultados');
        return;
    }
    console.log(hits)

    // Limpia el html en caso de que haya búsquedas anteriores
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

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
}



function alerta(mensaje) {
    Swal.fire({
        icon: 'warning',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      })
}