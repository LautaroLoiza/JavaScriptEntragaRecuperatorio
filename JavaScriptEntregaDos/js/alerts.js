function eliminarProducto(producto) {
    Swal.fire({
        title: '¿Eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f87171'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const index = productos.findIndex(p => p === producto);
            productos.splice(index, 1);
            localStorage.setItem("productos", JSON.stringify(productos));
            document.getElementById("productos-container").innerHTML = "";
            productosEstrutura(productos);
            mostrarToast('Producto eliminado');
        }
    });
}

function mostrarToast(mensaje, tipo = "default") {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
            background: tipo === "success" ? "#06d6a0" : "#1a1a2e",
            borderRadius: "8px",
            fontWeight: "600"
        }
    }).showToast();
}
