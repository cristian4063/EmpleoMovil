var usuario;
var pass;

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
});

function consultarUsuario() {
    if ($('#contactNameField').val() != "" && $('#contactEmailField').val() != "") {
        MostrarDivCargando();
        usuario = $('#contactNameField').val();
        pass = $('#contactEmailField').val();

        var Auth = new Object();
        Auth.usr = usuario;
        Auth.pass = pass;
        var hash = new Object();
        hash.timestamp = "121212121";
        hash.key = "sha1(md5(usr~pass~timestamp~pkey))";
        var iniciosesion = new Object();
        iniciosesion.Auth = Auth;
        iniciosesion.hash = hash;

        $.ajax({
            url: 'http://redempleo.gov.co/index.php?controlador=servicios&accion=il_auth',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(iniciosesion),
            success: function (data, textStatus, xhr) {
                if (data["status"] == "1") {
                    var today = new Date();
                    localStorage.setItem("tiempo", today);
                    localStorage.setItem("nombreUsuario", usuario);
                    OcultarDivCargando();
                    abrirConfirmSesion("Ingreso exitoso!");
                }
                else {
                    $('#contactForm').show();
                    abrirAlert("El usuario o contraseña son incorrectos");  
                    OcultarDivCargando(); 
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(errorThrown);
                abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
                OcultarDivCargando();
            }
        });
    }
}

function abrirConfirmSesion(contenido){
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
                //OcultarDivCargando();
                document.location.href="RegistrarOferta.html";
            }
        }
    });

}