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
    cargarVacantesEmpleador();
});

function cargarVacantesEmpleador() {

    var texto = "";
    var estadoHtml = "";
    var estado = "";
    var textoEstado = "";
    var textoStatus = "";

    var ofertas = $("#ofertas");
    ofertas.empty();

    MostrarDivCargando();

    var empleador = localStorage.getItem("nombreUsuario");

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantesXEmpleador?empleador=' + empleador,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {

                if (val['Estado'] === "A") {
                    estado = "I";
                    estadoHtml = 'cambiarEstadoVacante(' + val['ID'] + ',\'' + estado + '\')';
                    textoEstado = "Desactivar";
                    textoStatus = "Vacante activa";
                }
                else {
                    estado = "A";
                    estadoHtml = 'cambiarEstadoVacante(' + val['ID'] + ',\'' + estado + '\')';
                    textoEstado = "Activar";
                    textoStatus = "Vacante inactiva";
                }

                n = val['Fecha_vencimiento'].indexOf('T');
                texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2-active" style="font-weight: normal; font-size: 15px; color: black;">' +
                            val['Titulo'] + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
                if (val['Estado'] === "A") {
                    texto += "Activa - ";
                }
                else {
                    texto += "Inactiva - ";
                }
                if (val['DiasVence'] < 0)
                    texto += 'VENCIDA</label>';
                else if (val['DiasVence'] == 0)
                    texto += 'Vence HOY</label>';
                else if (val['DiasVence'] == 1)
                    texto += 'Vence MAÑANA</label>';
                else
                    texto += 'Vence en ' + val['DiasVence'] + ' días</label>';
                texto += '</a>' +
                            '<div class="toggle-content">' +
                                '<p style="text-align:justify;">' +
                                    '<label style="padding-bottom:10px;">' +
                                        val['Descripcion'] +
                                    '</label>' +
                                    '<label>' +
                                        'Número de vacantes: <b>' + val['Num_vacantes'] + '</b></label>' +
                                    '<label>' +
                                        'Cargo: <b>' + val['Cargo'] + '</b></label>' +
                                    '<label>' +
                                        'Salario: <b>' + val['Salario'] + '</b></label>' +
                                    '<label>' +
                                        'Experiencia: <b>' + val['Experiencia'] + '</b></label>' +
                                    '<label>' +
                                        'Nivel de Estudios: <b>' + val['Nivel_estudios'] + '</b></label>' +
                                    '<label>' +
                                        'Profesión: <b>' + val['Profesion'] + '</b></label>' +
                                    '<label>' +
                                        'Departamento: <b>' + val['DepartamentoNombre'] + '</b></label>' +
                                    '<label>' +
                                        'Municipio: <b>' + val['MunicipioNombre'] + '</b></label>' +
                                    '<label>' +
                                        'Fecha Vencimiento: <b>' + val['Fecha_vencimiento'].substring(0, n) + '</b></label>' +
                                    '<label>' +
                                        'Estado: <b>' + textoStatus + '</b></label>' +

                                '</p>' +
                                '<div class="toggle-content" style="padding-bottom: 5px;">' +
                                    '<p><strong>Datos del Empleador:</strong></p>' +
                                    '<div class="one-half-responsive ">' +
                                        '<div class="submenu-navigation">' +
                                            '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Teléfono (Indicativo): <b>' + val['Telefono'] + ' (' + val['Indicativo'] + ')</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Celular: <b>' + val['Celular'] + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Dirección: <b>' + val['Direccion'] + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">E-mail: <b>' + val['Email'] + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="width:100%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                                '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo<label>' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li style="padding-left: 0px;">' +
                                                        '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                        '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                    '</li>' +
                                                '</ul>' +
                                            '</a>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="one-half-responsive">' +
                                        '<div style="text-align: center; width: 30%; float: left;margin-top: 5px;"><a class="button-icon icon-setting button-red" onclick="cargarDatosVacante(' + val['ID'] + ')">Editar</a></div>' +
                                        '<div style="text-align: center; width: 35%; float: left;margin-top: 5px;"><a class="button-icon icon-setting button-red" onclick=\"' + estadoHtml + '\">' + textoEstado + '</a></div>' +
                                        '<div style="text-align: center; width: 35%; float: left;margin-top: 5px;"><a class="button-icon icon-setting button-red" onclick="eliminarVacante(' + val['ID'] + ')">Eliminar</a></div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            });
            $("#ofertas").html(texto);

            $('.deploy-toggle-2').click(function () {
                $(this).parent().find('.toggle-content').toggle(100);
                $(this).toggleClass('toggle-2-active');
                return false;
            });

            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function crearVacante() {
    document.location.href="RegistrarOferta.html";
}

function cargarDatosVacante(vacanteID) {
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacante/' + vacanteID,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {

            localStorage.setItem('id', data['ID']);
            localStorage.setItem('titulo', data['Titulo']);
            localStorage.setItem('tipo', data['TipoID']);
            localStorage.setItem('descripcion', data['Descripcion']);
            localStorage.setItem('numVacantes', data['Num_vacantes']);
            localStorage.setItem('cargo', data['Cargo']);
            localStorage.setItem('salario', data['SalarioID']);
            localStorage.setItem('experiencia', data['ExperienciaID']);
            localStorage.setItem('nivel', data['Nivel_estudiosID']);
            localStorage.setItem('profesion', data['Profesion']);
            localStorage.setItem('departamento', data['Departamento']);
            localStorage.setItem('municipio', data['Municipio']);
            localStorage.setItem('fechaPublicacion', data['Fecha_publicacion']);
            localStorage.setItem('fechaVencimiento', data['Fecha_vencimiento']);
            localStorage.setItem('direccion', data['Direccion']);
            localStorage.setItem('correo', data['Email']);
            localStorage.setItem('indicativo', data['Indicativo']);
            localStorage.setItem('telefono', data['Telefono']);
            localStorage.setItem('celular', data['Celular']);
            localStorage.setItem('latitud', data['Latitud']);
            localStorage.setItem('longitud', data['Longitud']);

            document.location.href = "EditarOferta.html";
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function cambiarEstadoVacante(vacanteID, estado) {

    MostrarDivCargando();

    var empleador = localStorage.getItem("nombreUsuario");
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/cambiarEstadoVacante/?ID=' + vacanteID + '&empleador=' + empleador + '&estado=' + estado,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            abrirConfirm("Se ha cambiado el estado de la vacante exitosamente");
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function confirmarEliminacion(vacanteID) {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>Esta seguro que desea eliminar la vacante ?</p>');
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
                eliminarVacante(vacanteID);
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function eliminarVacante(vacanteID) {

    MostrarDivCargando();

    var empleador = localStorage.getItem("nombreUsuario");
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/eliminarVacante/?ID=' + vacanteID + '&empleador=' + empleador,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            abrirConfirm("La vacante ha sido eliminada exitosamente");
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}