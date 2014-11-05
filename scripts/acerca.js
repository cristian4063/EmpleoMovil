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

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}