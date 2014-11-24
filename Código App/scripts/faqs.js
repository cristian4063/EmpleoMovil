var pagina_actual = 1;
var ultima_pagina = 1;
var primera_pagina = 1;
var numero_items = 0;

$(document).ready(function () {
    if (!doesConnectionExist()) {
        location.href = "vacantes_favoritas.html";
    } else {
        cargar_preguntas();
    }
    if (doesConnectionExist()) {
        $("#label-internet-connection").text("Online");
        $("#div-internet-connection").css("background-color", "#80d580");
    } else {
        $("#label-internet-connection").text("Offline");
        $("#div-internet-connection").css("background-color", "#ec8787");
    }

});

function cargar_preguntas() {
    $('#loading').css("display", "block");
    var texto = "";

    var url = "http://apiempleo.apphb.com/api/Vacante/obtenerFAQs";
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        success: function (data, textStatus, xhr) {
            pagina_actual = 1;
            ultima_pagina = 1;
            primera_pagina = 1;
            numero_items = 0;
            pagina = 1;
            numeropp = 0;
            cont = 0;

            $.each(data, function (i, val) {
                texto += '<div class="todas ' + pagina + '"><div class="clear" style="height: 10px;">' +
                        '</div>' +
                        '<em class="speach-left-title">' +
                            '<h3>' +
                                'Pregunta:</h3>' +
                        '</em>' +
                        '<p class="speach-left">' +
                            val['Pregunta'] + '</p>' +
                        '<em class="speach-right-title">' +
                            '<h3>' +
                                'Respuesta:</h3>' +
                        '</em>' +
                        '<p class="speach-right blue-bubble">' +
                            val['Respuesta'] + '</p>' +
                        '<div class="decoration">' +
                        '</div></div>';

                cont++;
                numeropp++;

                if (numeropp == 5) {
                    pagina++;
                    numeropp = 0;
                }
            });

            numero_items = cont;

            if (cont < 5) {
                $('#label_registros').text("FAQs 1 a " + cont + " de " + cont);
            }
            else {
                $('#label_registros').text("FAQs 1 a " + 5 * pagina_actual + " de " + cont);
            }

            if (cont % 5 == 0) {
                ultima_pagina = pagina - 1;
            }
            else {
                ultima_pagina = pagina;
            }

            if (ultima_pagina < 2) {
                $('#flechas_paginacion_izq').hide();
                $('#flechas_paginacion_der').hide();
            }
            else {
                $('#flechas_paginacion_izq').hide();
                $('#flechas_paginacion_der').show();
            }

            $("#preguntas").html(texto);
            $('#preguntas .todas').hide();
            $('#preguntas .' + primera_pagina).show();
            $('#loading').css("display", "none");
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown);
            $('#loading').css("display", "none");
        }
    });
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

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

function Paginacion() {
    $('#preguntas .todas').hide();
    $('#preguntas .' + primera_pagina).show();
}

function paginarAnterior() {
    if (pagina_actual != primera_pagina) {
        $('#preguntas .todas').hide();
        pagina_actual = pagina_actual - 1;
        if (pagina_actual == primera_pagina) {
            $('#flechas_paginacion_izq').hide();
            $('#flechas_paginacion_der').show();
        }
        else {
            $('#flechas_paginacion_izq').show();
            $('#flechas_paginacion_der').show();
        }
        $('#preguntas .' + pagina_actual).show();
        items_pagina = (5 * (pagina_actual - 1)) + 1;
        if (pagina_actual == 1) {
            items_final = 5;
        }
        else {
            items_final = 5 * pagina_actual;
        }
        $('#label_registros').text("FAQs " + items_pagina + " a " + items_final + " de " + cont);
    }
}

function paginarSiguiente() {
    if (pagina_actual != ultima_pagina) {
        $('#preguntas .todas').hide();
        pagina_actual = pagina_actual + 1;
        if (pagina_actual == ultima_pagina) {
            $('#flechas_paginacion_der').hide();
            $('#flechas_paginacion_izq').show();
        }
        else {
            $('#flechas_paginacion_der').show();
            $('#flechas_paginacion_izq').show();
        }
        $('#preguntas .' + pagina_actual).show();
        items_pagina = (5 * (pagina_actual - 1)) + 1;
        if (pagina_actual == ultima_pagina) {
            items_final = numero_items;
        }
        else {
            items_final = 5 * pagina_actual;
        }
        $('#label_registros').text("FAQs " + items_pagina + " a " + items_final + " de " + cont);
    }
}