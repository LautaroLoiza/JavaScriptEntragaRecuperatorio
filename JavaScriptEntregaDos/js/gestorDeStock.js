
let productos = [];

function actualizarTotal() {
	const total = productos.reduce((subtotal, producto) => subtotal + producto.precioFinal, 0);
	document.getElementById("total-stock").innerHTML = `Total del stock: <span>$${total}</span>`;
}

function guardarPrecio(inputPrecio, producto) {
    const nuevoPrecio = parseFloat(inputPrecio.value);
    if (nuevoPrecio > 0) {
        producto.precio = nuevoPrecio;
        producto.precioFinal = parseFloat((nuevoPrecio + nuevoPrecio * producto.iva).toFixed(2));
        localStorage.setItem("productos", JSON.stringify(productos));
        document.getElementById("productos-container").innerHTML = "";
        productosEstrutura(productos);
    } else {
        mostrarToast("El precio debe ser mayor a cero.", "error");
    }
}

function productosEstrutura(productos) {
	const productosContainer = document.getElementById("productos-container");
	actualizarTotal();
	productos.forEach(producto => {
		const cardProducto = document.createElement("div");
		cardProducto.innerHTML =
			`<h2 class="titulo-producto">${producto.nombre}</h2>
            <p class="precio">Precio: $${producto.precioFinal}</p>
            <p class="precio precio-sin-impuestos">✏️ Precio sin Impuestos: $${producto.precio}</p>`;
            const precioSinIva = cardProducto.querySelector(".precio-sin-impuestos");
                precioSinIva.addEventListener("click", function () {
                const inputPrecio = document.createElement("input");
                inputPrecio.type = "number";
                inputPrecio.value = producto.precio;
                inputPrecio.className = "input-editar-precio";
                inputPrecio.onblur = () => guardarPrecio(inputPrecio, producto);
                inputPrecio.onkeydown = (e) => { 
                    if (e.key === "Enter"){
                    guardarPrecio(inputPrecio, producto);
                    } 
                 };
                precioSinIva.replaceWith(inputPrecio);
            });
                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.className = "btn-eliminar";
                btnEliminar.addEventListener('click', () => eliminarProducto(producto));
                cardProducto.appendChild(btnEliminar);
                productosContainer.appendChild(cardProducto);
	});
}


function ObtenerProductos() {
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));
    if (productosGuardados) {
        productos = productosGuardados;
        productosEstrutura(productos);
        mostrarToast("Productos cargados correctamente." ,"default");
    } else {
        fetch("data/articulos.json")
            .then(response => response.json())
            .then(data => {
                productos = data.productos;
                productosEstrutura(productos);
                mostrarToast("Productos cargados correctamente.", "success");
            })
            .catch(() => mostrarToast("Hubo un error al cargar los productos.", "error"));
    }
}
ObtenerProductos();

document.getElementById("cerrar-modal").onclick = () => {
    document.getElementById("modalUno").style.display = "none";
};

document.getElementById("cerrar-agregar").onclick = () => {
    document.getElementById("modalDos").style.display = "none";
};

document.getElementById("agregar-producto").onclick = () => {
    const input = document.getElementById("input");
    const precio = parseFloat(document.getElementById("precio").value.replace("$", ""));
    const cantidad = Number(document.getElementById("cantidad").value) || 1;
    const categoria = document.getElementById("categoria").value;
    if (precio > 0 && cantidad > 0) {
        const iva = 0.21;
        productos.push({
            nombre: input.value,
            precio: precio * cantidad,
            cantidad: cantidad,
            iva: iva,
            precioFinal: (precio * cantidad) + (precio * cantidad * iva),
            categoria: categoria
        });
        localStorage.setItem("productos", JSON.stringify(productos));
        document.getElementById("modalDos").style.display = "none";
        document.getElementById("productos-container").innerHTML = "";
        productosEstrutura(productos);
        mostrarToast(`${input.value} agregado correctamente.`, "success");
    } else {
        mostrarToast(precio === "" ? "El precio no puede estar vacío" : precio <= 0 ? "El precio no puede ser negativo o cero" : "La cantidad no puede ser negativa o cero.");
    }
};

document.getElementById("input").onchange = function() {
    const input = document.getElementById("input");
    document.getElementById("modalUno").style.display = "none";
    document.getElementById("modalDos").style.display = "none";
    const productoExiste = productos.find(producto => producto.nombre.toLowerCase() === input.value.toLowerCase());
    if (productoExiste) {
        document.getElementById("modalUno-nombre").textContent = `El producto "${productoExiste.nombre}" ya existe`;
        document.getElementById("modalUno-precio").textContent = `Precio: $${productoExiste.precioFinal}`;
        document.getElementById("modalUno-sin-iva").textContent = `Precio sin Impuestos: $${productoExiste.precio}`;
        document.getElementById("modalUno").style.display = "block";
    } else {
        document.getElementById("modalDos-titulo").textContent = `Ingrese el precio para "${input.value}":`;
        document.getElementById("precio").value = "$";
        document.getElementById("cantidad").value = "1";
        document.getElementById("categoria").value = "";
        document.getElementById("modalDos").style.display = "block";
    }
}

document.getElementById("filtro-categoria").onchange = function() {
    const categoria = document.getElementById("filtro-categoria").value;
    const filtrados = categoria ? productos.filter(p => p.categoria === categoria) : productos;
    document.getElementById("productos-container").innerHTML = "";
    if (filtrados.length === 0) {
        document.getElementById("productos-container").innerHTML = `<p class="sin-productos">No hay productos en esta categoría.</p>`;
    } else {
        productosEstrutura(filtrados);
    }
};
