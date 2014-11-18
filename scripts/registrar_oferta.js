var map;
var marker;
var markersArray = [];

$(document).ready(function () {
    if (!doesConnectionExist()) {
        location.href = "vacantes_favoritas.html";
    }
    if (doesConnectionExist()) {
        $("#label-internet-connection").text("Online");
        $("#div-internet-connection").css("background-color", "#80d580");
    } else {
        $("#label-internet-connection").text("Offline");
        $("#div-internet-connection").css("background-color", "#ec8787");
    }

    localStorage.setItem('latitud', 0);
    localStorage.setItem('longitud', 0);

    cargarDepartamentosCrud();
});

$(function() {
    /*$( "#txtfechaPublicacion" ).datepicker({
        minDate: new Date(),
        onClose: function( selectedDate ) {
            $( "#txtfechaVencimiento" ).datepicker( "option", "disabled", false );
            $( "#txtfechaVencimiento" ).datepicker( "option", "minDate", selectedDate );
            $( "#txtfechaVencimiento" ).datepicker( "option", "maxDate", AddRestrictedDays(15) );
        }
    });*/
    $( "#txtfechaVencimiento" ).datepicker({
        minDate: new Date(),
        maxDate: AddRestrictedDays(15)
    });
});

function AddRestrictedDays(arg) {
    var d = new Date();
    //var d = $('#txtfechaPublicacion').datepicker('getDate');
    var d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + arg);
    return d;
}

function crearMapa() {
    setTimeout(function() {
        geoCiudad($("#municipio option:selected").html());
    }, 500);
}

function geoCiudad(cityName) {
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': ''+ cityName +', co'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            InitializeReg(lat, lon);
        } else {
            alert("Something got wrong " + status);
        }
    });
}

function InitializeReg(lat, lon) {

    google.maps.visualRefresh = true;
    var cityCenter = new google.maps.LatLng(lat, lon);

    var mapOptions = {
        zoom: 14,
        center: cityCenter,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    google.maps.event.addListener(map, "click", function(event)
    {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {

    deleteOverlays();

    marker = new google.maps.Marker({
        position: location, 
        map: map
    });

    localStorage.setItem('latitud', location.lat());
    localStorage.setItem('longitud', location.lng());

    marker.setIcon('images/marker.png');
    markersArray.push(marker);
}

function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
    markersArray.length = 0;
    }
}

function guardar()
{
    var titulo = $("#txtTitulo").val();
    var tipo = $("#selectTipo").val();
    var tipoTexto = $("#selectTipo option:selected").html();
    var descripcion = $("#txtDescripcion").val();
    var numVacantes = $("#selectVacantes").val();
    var cargo = $("#txtCargo").val();
    var salario = $("#selectSalario").val();
    var experiencia = $("#selectExperiencia").val();
    var experienciaTexto = $("#selectExperiencia option:selected").html();
    var nivel = $("#select_nivel").val();
    var nivelTexto = $("#select_nivel option:selected").html();
    var profesion = $("#txtProfesion").val();
    var salarioTexto = $("#selectSalario option:selected").html();
    var departamento = $("#departamento").val();
    var departamentoTexto = $("#departamento option:selected").html();
    var municipio = $("#municipio").val();
    var municipioTexto = $("#municipio option:selected").html();
    var direccion = $("#txtDireccion").val();
    var correo = $("#txtCorreo").val();
    var indicativo = $("#selectIndicativo").val();
    var telefono = $("#txtTelefono").val();
    var celular = $("#txtCelular").val();
    var fechaVencimiento = $("#txtfechaVencimiento").val();

    if(titulo && tipo && descripcion && cargo && departamento != null && municipio != null && correo && telefono && fechaVencimiento) {

        localStorage.setItem('titulo', titulo);
        localStorage.setItem('tipo', tipo);
        localStorage.setItem('descripcion', descripcion);
        localStorage.setItem('numVacantes', numVacantes);
        localStorage.setItem('cargo', cargo);
        localStorage.setItem('salario', salario);
        localStorage.setItem('experiencia', experiencia);
        localStorage.setItem('nivel', nivel);
        localStorage.setItem('profesion', profesion);
        localStorage.setItem('departamento', departamento);
        localStorage.setItem('municipio', municipio);
        localStorage.setItem('direccion', direccion);
        localStorage.setItem('correo', correo);
        localStorage.setItem('indicativo', indicativo);
        localStorage.setItem('telefono', telefono);
        localStorage.setItem('celular', celular);
        localStorage.setItem('fechaVencimiento', fechaVencimiento);

        $("#detalleTitulo").text(titulo);
        $("#detalleDesc").text(descripcion);
        $("#detalleNumVacantes").text(numVacantes);
        $("#detalleCargo").text(cargo);
        $("#detalleSalario").text(salarioTexto);
        $("#detalleExperiencia").text(experienciaTexto);
        $("#detalleNivel").text(nivelTexto);
        $("#detalleDepto").text(departamentoTexto);
        $("#detalleMuni").text(municipioTexto);
        $("#detalleCorreo").text(correo);
        $("#detalleTelefono").text(telefono);
        $("#detalleFechaPublicacion").text(new Date());
        $("#detalleFechaVencimiento").text(fechaVencimiento);

        $("#formularioVacante").css("display", "none");
        $("#detalleVacante").css("display", "block");
    }
}

function agregarVacante() {

    MostrarDivCargando();

    var vacante = new Object();
    vacante.ID = null;
    vacante.Titulo = localStorage.getItem('titulo');
    vacante.TipoID = localStorage.getItem('tipo');
    vacante.Descripcion = localStorage.getItem('descripcion');
    vacante.Num_vacantes = localStorage.getItem('numVacantes');
    vacante.Cargo = localStorage.getItem('cargo');
    vacante.SalarioID = localStorage.getItem('salario');
    vacante.ExperienciaID = localStorage.getItem('experiencia');
    vacante.Nivel_estudiosID = localStorage.getItem('nivel');
    vacante.Profesion = localStorage.getItem('profesion');
    vacante.Municipio = localStorage.getItem('municipio');
    vacante.Departamento = localStorage.getItem('departamento');
    vacante.Fecha_vencimiento = localStorage.getItem('fechaVencimiento') + " 23:59:59";
    vacante.Direccion = localStorage.getItem('direccion');
    vacante.Email = localStorage.getItem('correo');
    vacante.Indicativo = localStorage.getItem('indicativo');
    vacante.Telefono = localStorage.getItem('telefono');
    vacante.Celular = localStorage.getItem('celular');

    if(localStorage.getItem('latitud') != 0 && localStorage.getItem('longitud') != 0) {
        vacante.Latitud = localStorage.getItem('latitud');
        vacante.Longitud = localStorage.getItem('longitud');
    }
    else {
        vacante.Latitud = "0";
        vacante.Longitud = "0";
    }

    vacante.Empleador = localStorage.getItem("nombreUsuario");

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/agregarVacante',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(vacante),
        success: function (data, textStatus, xhr) {
            abrirConfirm("la vacante ha sido registrada exitosamente!!");
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function regresar()
{
    $("#detalleVacante").css("display", "none");
    $("#formularioVacante").css("display", "block");
    $("#contactForm").show();
}

function gestionarVacantes() {
    document.location.href="lista_ofertas_empleador.html";
}