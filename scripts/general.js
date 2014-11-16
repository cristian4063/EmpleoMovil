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
    var height = window.innerHeight;
    height_fin = height + "px";
    $('#content').css('min-height', height_fin);
    setInterval("Tamanio()", 500);
    validarInactividad();
    validarSesion();
});

//-----------------------------------------------------------------     A     -----------------------------------------------------------------//

function abrirAlert(contenido) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho = windowWidth - (windowWidth / 10);
    $('#content-alert').html('<p>' + contenido + '</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Aviso',
        minWidth: ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function () {
                $(this).dialog("close");
            }
        }
    });
}

function abrirAlertMap(contenido) {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho = windowWidth - (windowWidth / 10);
    $('#content-alert').html('<p>' + contenido + '</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth: ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function () {
                $(this).dialog("close");
                cargarOfertas("");
            }
        }
    });
}

function abrirAlertSesion(contenido) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho = windowWidth - (windowWidth / 10);
    $('#content-alert').html('<p>' + contenido + '</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth: ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function () {
                $(this).dialog("close");
                cerrar();
            }
        }
    });
}

function abrirConfirm(contenido) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho = windowWidth - (windowWidth / 10);
    $('#content-alert').html('<p>' + contenido + '</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth: ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function () {
                $(this).dialog("close");
                document.location.href = "lista_ofertas_empleador.html";
            }
        }
    });
}

function abrirConfirmSesion(contenido) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho = windowWidth - (windowWidth / 10);
    $('#content-alert').html('<p>' + contenido + '</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth: ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function () {
                $(this).dialog("close");
                //OcultarDivCargando();
                document.location.href = "lista_ofertas_empleador.html";
            }
        }
    });
}

function abrirPaginaFacebook(nombre, id) {
    var url = 'http://empleomovil.apphb.com/Vacantes/Details/' + id;
    var title = 'Comparta esta vacante';
    var descr = 'Descripción de la vacante de prueba';
    var image = 'http://goo.gl/B8AWrE';
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=auto,left=auto,toolbar=0,status=0,width=auto,height=auto');
}

function abrirPaginaTwitter(nombre, id) {
    var url = 'http://empleomovil.apphb.com/Vacantes/Details/' + id;
    window.open("https://twitter.com/intent/tweet?url=" + url + "&text=Oportunidad de empleo: " + nombre, "_blank", "closebuttoncaption=Regresar");
}

function abrirPrimerAlert(contenido) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho = windowWidth - (windowWidth / 10);
    $('#content-alert').html('<p>' + contenido + '</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Bienvenidos al Servicio de Empleo Móvil',
        minWidth: ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function () {
                $(this).dialog("close");
            }
        }
    });
}

//-----------------------------------------------------------------     C     -----------------------------------------------------------------//

function CancelarDenuncia(id) {
    $("#btnDen" + id).show();
    $("#comboDen" + id).hide();
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

//-----------------------------------------------------------------     D     -----------------------------------------------------------------//

function Denunciar(id) {
    $("#btnDen" + id).hide();
    $("#comboDen" + id).show();
}

function doesConnectionExist() {
    var xhr = new XMLHttpRequest();
    var file = "http://lavanderialabruja.com/images/logo.png";  //  Cambiar despues por una imagen del proyecto
    var randomNum = Math.round(Math.random() * 10000);

    xhr.open('HEAD', file + "?rand=" + randomNum, false);

    try {
        xhr.send();

        if (xhr.status >= 200 && xhr.status < 304) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

//-----------------------------------------------------------------     G     -----------------------------------------------------------------//

function GuardarDenuncia(id, titulo, descripcion, vacantes, cargo, salario, experiencia, nivel, profesion, fechaPublicacion, fechaVencimiento, diasVence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) {
    var denuncia = new Object();
    denuncia.Fecha = null;
    denuncia.Tipo = $("#selectMotivoDenuncia" + id + " option:selected").html();
    denuncia.vacanteID = id;
    denuncia.Email = email;
    denuncia.TituloEmail = "La vacante '" + titulo + "' publicada a través del Servicio de Empleo Móvil ha sido denunciada";
    denuncia.TextoEmail = "Señor/a " + empleador + "<br/><br/>" +
          "La vacante '" + titulo + "' ha sido denunciada por varios usuarios de la app. Por precaución la vacante ha sido automáticamente despublicada.<br/><br/>" +
          "RESUMEN DE LA VACANTE:<br/><br/>" +
          "Título de la vacante: " + titulo + "<br/>" +
          "Tipo de oportunidad”: " + $("#selectTipoOportunidad option:selected").html() + "<br/>" +
          "Descripción de la vacante: " + descripcion + "<br/>" +
          "Cargo: " + cargo + "<br/>" +
          "Salario ofrecido: " + salario + "<br/>" +
          "Experiencia mínima requerida: " + experiencia + "<br/>" +
          "Nivel de estudio mínimo requerido: " + nivel + "<br/>" +
          "Profesión: " + profesion + "<br/>" +
          "Ubicación: " + $("#departamento option:selected").html() + "/" + $("#municipio option:selected").html() + "<br/>" +
          "Dirección de referencia: " + direccion + "<br/>" +
          "Correo Electrónico de Contacto: " + email + "<br/>" +
          "Teléfono de Contacto: " + telefono + "<br/><br/>" +
          "Servicio de Empleo Móvil - Este es un correo electrónico automático, por favor no lo responda";

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/agregarDenuncia',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(denuncia),
        success: function (data, textStatus, xhr) {
            abrirAlert(data);
            if (data == "Denuncia guardada correctamente") {
                $("#btnDen" + id).show();
                $("#comboDen" + id).hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert(errorThrown);
        }
    });
}

//-----------------------------------------------------------------     M     -----------------------------------------------------------------//

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

//-----------------------------------------------------------------     O     -----------------------------------------------------------------//

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

//-----------------------------------------------------------------     S     -----------------------------------------------------------------//

function swapStyleSheet(sheet) {
    document.getElementById('pagestyle').setAttribute('href', sheet);
}

//-----------------------------------------------------------------     T     -----------------------------------------------------------------//

function Tamanio() {
    var height = window.innerHeight;
    height_fin = height + "px";
    $('#content').css('min-height', height_fin);
}

//-----------------------------------------------------------------     V     -----------------------------------------------------------------//

function validarInactividad() {
    if (localStorage.getItem("nombreUsuario")) {
        $("#header").append('<a onclick="cerrar()" style="float:right;overflow:visible;padding-right:10px;"><img style="width:35px;margin-top:-30px;" src="images/icons/user/exit.png" alt="img"></a>');
        $("#opc_Sesion").css("display", "none");
        $('#menu_usuario_empleador').html("Bienvenid@ " + localStorage.getItem("nombreUsuario"));
    }
    else {
        $("#opc_Sesion").css("display", "block");
        $("#opc_Registrar").css("display", "none");
        $("#opc_VerMias").css("display", "none");
    }
}

function validarSesion() {

    if (localStorage.getItem("tiempo")) {
        var today = new Date();
        var after = new Date(localStorage.getItem("tiempo"));
        var diffMs = (today - after);
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutos

        if (diffMins >= 15) { //Tiempo de inactividad 15 minutos
            abrirAlertSesion("Su sesión se cerrará por inactividad");
        }
        else {
            localStorage.setItem("tiempo", today);
        }
    }
}

function cerrar()
{
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("tiempo");
    document.location.href = "inicio-sesion.html";
}