$(document).ready(function () {

    validarInactividad();
    validarSesion();

    //$("#map_canvas").hide();

});

$(function () {
    $("#selectDepartamentos").combobox();
    $("#toggle").click(function () {
        $("#selectDepartamentos").toggle();
    });

    $('#combobox option').each(function () {
        $(this).removeAttr('selected')
    });

    //Evento change select departamento
    $("#selectDepartamentos").combobox({
        selectFirst: true,
        select: function (event, ui) {
            //                    alert(ui.item.text); alert(ui.item.value);
            $('input.ui-autocomplete-input:eq(1)').val("");
            cargarMunicipios();
        },
        focus: function (event, ui) { event.preventDefault(); }
    });

    $("#selectMunicipios").combobox({
        selectFirst: true,
        focus: function (event, ui) { event.preventDefault(); }
    });

    $("#toggle").click(function () {
        $("#selectMunicipios").toggle();
    });
});

function validarInactividad(){
    if(localStorage.getItem("nombreUsuario")) {
        $("#header").append('<a onclick="cerrar()" style="float:right;overflow:visible;padding-right: 10px;"><img style="width:35px;margin-top:-30px;" src="images/icons/user/exit.png" alt="img"></a>');
        $("#opc_Sesion").css("display", "none");
    }
    else {
        $("#opc_Sesion").css("display", "block");
        $("#opc_Registrar").css("display", "none");
        $("#opc_VerMias").css("display", "none");
    }
}

function validarSesion(){

    if(localStorage.getItem("tiempo")) {
        var today = new Date();
        var after = new Date(localStorage.getItem("tiempo"));
        var diffMs = (today - after);
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutos

        if(diffMins >= 15) { //Tiempo de inactividad 15 minutos
            abrirAlertSesion("Su sesión se cerrará por inactividad");
        }
        else {
            localStorage.setItem("tiempo", today);
        }
    } 
}

function configurar_db() {
    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS vacantes (id, titulo, nombre_tipo, descripcion, vacantes, cargo, nombre_salario, sector, nombre_experiencia, nombre_nivel, profesion, nombre_departamento, nombre_municipio, fecha_publicacion, fecha_vencimiento, dias_vence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion)');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 200000);
    db.transaction(execute, error, exito);

}

function cargarDeptos() {
    MostrarDivCargando();
    $('#selectDepartamentos').empty();

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerDepartamentos',
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {
                $('#selectDepartamentos').append('<option value="' + val['ID'] + '">' + val['Nombre'] + '</option>');
            });
            if (localStorage.getItem('Departamento')) {
                $("#selectDepartamentos").val(localStorage.getItem('Departamento'));
            }
            else {
                localStorage.setItem('Departamento', $("#selectDepartamentos").val());
            }
            $('input.ui-autocomplete-input:eq(0)').val($('#selectDepartamentos option:selected').text());
            cargarMunicipios();
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.")
        }
    });
}

function cargarMunicipios() {
    MostrarDivCargando();
    $('#selectMunicipios').empty();
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerMunicipios?departamento=' + $("#selectDepartamentos").val(),
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {
                $('#selectMunicipios').append('<option value="' + val['ID'] + '">' + val['Nombre'] + '</option>');
            });
            if (localStorage.getItem('Municipio')) {
                $("#selectMunicipios").val(localStorage.getItem('Municipio'));
            }
            else {
                localStorage.setItem('Municipio', $("#selectMunicipios").val());
            }
            $('input.ui-autocomplete-input:eq(1)').val($('#selectMunicipios option:selected').text());
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.")
        }
    });
}

function cargar_niveles() {
    $("#select_nivel>option").remove();
    var texto = "";
    var url = "http://servicedatosabiertoscolombia.cloudapp.net/v1/Unidad_Administrativa_Especial_Servicio_Publico_de_Empleo/niveleducativo?$format=json";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function (data) {
            $.each(data, function (i, field) {
                var cant = field.length;
                $.each(field, function (x, item) {
                    texto += " <option value='" + field[x].ided + "'>" + field[x].niveleductivo + "</option>";
                });
                $("#select_nivel").append(texto);
                $("#select_nivel").val("4");
                $("#select_nivel").selectmenu('refresh');
            });
        },
        error: function (x, y, z) {
            
        }, 
        timeout: 15000                          
    });
}

function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

function abrirPrimerAlert(contenido){

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Bienvenidos al Servicio de Empleo Móvil',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function abrirAlert(contenido){

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function abrirAlertMap(contenido){

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                cargarOfertas("");
            }
        }
    });
}

function abrirConfirm(contenido){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                document.location.href="lista_ofertas_empleador.html";
            }
        }
    });

}

function abrirAlertSesion(contenido){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                cerrar();
            }
        }
    });

}

function cerrar()
{
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("tiempo");
    document.location.href = "inicio-sesion.html";
}