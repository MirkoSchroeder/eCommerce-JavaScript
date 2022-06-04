const contenedor = document.getElementById("productos");
const tablaCarrito = document.getElementById("tablaCarrito");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

btnFinalizarCompra.addEventListener("click", finalizarCompra);
btnVaciarCarrito.addEventListener("click", vaciarCarrito);



let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

const listaProd = async () => {
    const response = await fetch("./json.json")
    const data = await response.json();
    productos = data;
    cargarProductos(productos, contenedor);
    cargarCarrito(carrito, tablaCarrito);
    totalCarrito()
}
listaProd()

const getCard = (item) => {
    return (
        `
        <div class="card" style="width: 18rem;">
            <img src="${item.imagen}" class="card-img-top" alt="${item.nombre}">
            <div class="card-body">
                <h5 class="card-title">${item.marca}</h5>
                <p class="card-text">${item.nombre}</p>
                <p class="card-text">$${item.precio}</p>
                <button style="background-color: #0d6efd;; color: white;" onclick=agregarCarrito(${item.id}) class="btn">Agregar al carrito</button>
            </div>
        </div>
    `);
};

const getRow = (item) => {
        return(
            `
        <tr>
            <th scope="row">${item.id}</th>
            <td>${item.nombre}</td>
            <div>
                <td> <button type="button" data-bs-dismiss="modal">-</button> ${item.cantidad} <button type="button" id="btnSumarCarrito" data-bs-dismiss="modal">+</button></td>
            </div>
            <td>$${item.precio * item.cantidad} ($${item.precio})</td>
            <td><img style="width:20px" src="${item.imagen}" alt="imagen"></td>
        </tr>
            `
        )
        
}


const cargarProductos = (datos, nodo) => {
    let acumulador = "";
    datos.forEach((el) => {
        acumulador += getCard(el);
    })
    nodo.innerHTML = acumulador;
};

const cargarCarrito = (datos, nodo) => {
    let acumulador = "";
    datos.forEach((el) => {
        acumulador += getRow(el);
    })
    nodo.innerHTML = acumulador;
};

const agregarCarrito = (id) => {
    const seleccion = productos.find(item => item.id === id);
    const busqueda = carrito.findIndex(el => el.id === id);
    
    if (busqueda === -1) {
        agregadoAlCarrito(seleccion.nombre)
        carrito.push({
            id: seleccion.id,
            nombre: seleccion.nombre,
            precio: seleccion.precio,
            cantidad: 1,
            imagen: seleccion.imagen,
        })
    } else {
        carrito[busqueda].cantidad = carrito[busqueda].cantidad + 1
        agregadoAlCarrito(seleccion.nombre)
    }

    totalCarrito()
    cargarProductos(carrito, tablaCarrito);
    cargarCarrito(carrito, tablaCarrito);

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function finalizarCompra(){
    if(carrito.length > 0){
        localStorage.clear();
        carrito = [];
        cargarCarrito(carrito, tablaCarrito);
        compraFinalizada();
        totalCarrito();
    }else{
        Swal.fire({
            title: 'El carrito esta vacio',
            allowOutsideClick: () => {
              const popup = Swal.getPopup()
              popup.classList.remove('swal2-show')
              setTimeout(() => {
                popup.classList.add('animate__animated', 'animate__headShake')
              })
              setTimeout(() => {
                popup.classList.remove('animate__animated', 'animate__headShake')
              }, 500)
              return true
            }
          })
    }
}


function vaciarCarrito(){
    localStorage.clear();
    carrito = [];
    cargarCarrito(carrito, tablaCarrito)
    carritoVaciado();
    totalCarrito()
}

function agregadoAlCarrito(seleccionNombre){
    Toastify({
        text: `Agregaste ${seleccionNombre} al carrito`,
        duration: 2500,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: 'linear-gradient(to left, #ffb347, #ffcc33)'
        }
    }).showToast();
}

function carritoVaciado(){
    Swal.fire({
        title: 'Vaciaste el carrito',
        allowOutsideClick: () => {
          const popup = Swal.getPopup()
          popup.classList.remove('swal2-show')
          setTimeout(() => {
            popup.classList.add('animate__animated', 'animate__headShake')
          })
          setTimeout(() => {
            popup.classList.remove('animate__animated', 'animate__headShake')
          }, 500)
          return true
        }
      })
}

function compraFinalizada(){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra realizada con exito. Muchas gracias!',
        showConfirmButton: false,
        timer: 4000
    })
}

function totalCarrito(){
    const getProductQty = carrito.reduce((acc, el) => {
        return acc + el.cantidad;
    }, 0);
    nmr = document.getElementById("numeroCarrito");
    nmr.innerHTML = `${getProductQty}`;
}

function onBtnAddClick(e){
    const productId = e.target.id.slice(6);
    const productosStorage = JSON.parse(localStorage.getItem('carrito'));
    objIndex = productosStorage.findIndex((producto => producto.id == productId))
        productosStorage[objIndex].cantidad++
    localStorage.setItem('carrito', JSON.stringify(productosStorage));
    cargarProductos();
}