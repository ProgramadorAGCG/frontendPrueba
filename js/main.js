

window.addEventListener('load', (e) => {
    const url = window.location.pathname;
    const boton = document.getElementById('btnEnviar');
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        if (url === "/create.html") cursoInsert();
        else if (url === "/crearExcel.html") insertarDatosExcel();
        else cursoUpdate();
    });
    cursoSelect();
    if(url === "/crearExcel.html") archivoCargar();
    
});

function cursoSelect() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/curso/select/",
        dataType: "json",
        success: function (data) {
            var tabla = '';
            $.each(data["resultado"], function (llave, valor) {
                var template = '<div class="card bg-info carta">';
                template += '<div class="card-body">';
                template += '<p>' + valor["id"] + '</p>';
                template += '<p>' + valor["nombre"] + '</p>';
                template += '<p>' + valor["creditos"] + '</p>';
                template += '<div><a href="#" class="btn btn-warning" data-toggle="modal" data-target="#myModal" onclick=cursoGet(' + valor["id"] + ')><i class="bx bx-info-circle"></i></a>';
                template += '<a href="#" class="btn btn-danger" onclick="return cursoEliminar(' + valor["id"] + ')"><i class="bx bxs-trash-alt"></i></a></div>';
                template += '</div></div>';
                tabla += template;
            });
            $('#contenido').html(tabla);
        }
    });
}

function cursoGet(id) { /*27*/
    $.ajax({
        type: "GET",
        /** http://localhost:5000/curso/get/27 */
        url: "http://localhost:5000/curso/get/" + id + "/",
        dataType: "json",
        success: function (data) {
            $('#txtId').val(data["resultado"]["id"]);
            $('#txtNombre').val(data["resultado"]["nombre"]);
            $('#txtCreditos').val(data["resultado"]["creditos"]);
            $('#tituloModal').html(`Actualizando el curso: ${data["resultado"]["nombre"]}`);
        }
    });
}

function cursoEliminar(id) {
    $.ajax({
        type: "DELETE",
        url: "http://localhost:5000/curso/delete/" + id + "/",
        dataType: "json",
        success: function (data) {
            cursoSelect();
            crearMensaje(data["resultado"]);
        }
    });
    return false;
}

function crearMensaje(mensaje) {
    const elementoMensaje = document.getElementById('mensaje');
    elementoMensaje.classList.add("visible");
    elementoMensaje.removeChild(elementoMensaje.lastChild);
    const parrafo = document.createElement("P");
    parrafo.appendChild(document.createTextNode(mensaje));
    elementoMensaje.appendChild(parrafo);
}


function cursoInsert() {
    var registros = new FormData();
    registros.append("txtNombre", $('#txtNombre').val());
    registros.append("txtCreditos", $('#txtCreditos').val());
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/curso/create/",
        data: registros,
        dataType: 'json',
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (data) {
            window.location.href = "index.html";
        }
    });
}

function cursoUpdate() {
    var registros = new FormData();
    registros.append("txtId", $('#txtId').val());
    registros.append("txtNombre", $('#txtNombre').val());
    registros.append("txtCreditos", $('#txtCreditos').val());
    $.ajax({
        type: "PUT",
        url: "http://localhost:5000/curso/update/" + registros.get("txtId") + "/",
        data: registros,
        dataType: 'json',
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (data) {
            cursoSelect();
            crearMensaje(data["mensaje"]);
        }
    });
}


function archivoCargar() {
    const archivoExcel = document.getElementById('archivoExcel');
    archivoExcel.addEventListener('change', (e) => {
        var registros = new FormData();
        registros.append("archivoExcel", $('#archivoExcel')[0].files[0]);
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/curso/cargarexcel/",
            data: registros,
            dataType: 'json',
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (data) {
                let tabla = '';
                $.each(data["cursos"], function (llave, valor) {
                    let template = '<tr>';
                    template += '<td>' + valor[0] + '</td>';
                    template += '<td>' + valor[1] + '</td>';
                    template += '</tr>'
                    tabla += template;
                });
                $('#tablaExcel').html(tabla);
            }
        });
    });
}

function insertarDatosExcel() {
    const tablaExcel = document.getElementById('tablaExcel');
    const hijos = tablaExcel.children;
    console.log(hijos);
    let arreglo = [];
    for (const iterator of hijos) {
        const hijo1 = iterator.firstElementChild.textContent;
        const hijo2 = iterator.lastElementChild.textContent;
        let elemento = [hijo1, hijo2];
        arreglo.push(elemento);
    }
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/curso/crear/",
        data: JSON.stringify(arreglo),
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function (data) {
            window.location.href = "index.html";
        }
    });
}