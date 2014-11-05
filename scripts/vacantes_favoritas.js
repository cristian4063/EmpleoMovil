$(document).ready(function () {
    $("#div_sin_favoritas").hide();
    if (doesConnectionExist()) {
        $("#label-internet-connection").text("Online");
        $("#div-internet-connection").css("background-color", "#80d580");
        ActualizarFavoritas();
    } else {
        $("#label-internet-connection").text("Offline");
        $("#div-internet-connection").css("background-color", "#ec8787");
        consultarVacante();
    }
});

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

function ActualizarFavoritas() {
    $("#div_sin_favoritas").hide();
    MostrarDivCargando();
    eliminarTodasfavoritas();
    if (localStorage.getItem('vacantesGuardadas') != null) {
        $.ajax({
            url: 'http://apiempleo.apphb.com/api/Vacante/actualizarVacantesFavoritas?listaFavoritas=' + localStorage.getItem('vacantesGuardadas').replace(/id/g, '') + '',
            type: 'POST',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                localStorage.setItem("vacantesGuardadas", "");
                $.each(data, function (i, val) {
                    var vacanteFavorita = new Object();
                    vacanteFavorita.ID = val['ID'];
                    vacanteFavorita.Titulo = val['Titulo'];
                    vacanteFavorita.Tipo = val['Tipo'];
                    vacanteFavorita.Descripcion = val['Descripcion'];
                    vacanteFavorita.Num_vacantes = val['Num_vacantes'];
                    vacanteFavorita.Cargo = val['Cargo'];
                    vacanteFavorita.Salario = val['Salario'];
                    vacanteFavorita.Sector = val['Sector'];
                    vacanteFavorita.Experiencia = val['Experiencia'];
                    vacanteFavorita.Nivel_estudios = val['Nivel_estudios'];
                    vacanteFavorita.Profesion = val['Profesion'];
                    vacanteFavorita.DepartamentoNombre = val['DepartamentoNombre'];
                    vacanteFavorita.MunicipioNombre = val['MunicipioNombre'];
                    vacanteFavorita.Fecha_publicacion = val['Fecha_publicacion'];
                    vacanteFavorita.Fecha_vencimiento = val['Fecha_vencimiento'];
                    vacanteFavorita.DiasVence = val['DiasVence'];
                    vacanteFavorita.Empleador = val['Empleador'];
                    vacanteFavorita.Telefono = val['Telefono'];
                    vacanteFavorita.Indicativo = val['Indicativo'];
                    vacanteFavorita.Celular = val['Celular'];
                    vacanteFavorita.Direccion = val['Direccion'];
                    vacanteFavorita.Email = val['Email'];
                    vacanteFavorita.Ultima_Actualizacion = val['Ultima_Actualizacion'];
                    actualizarVacanteFavorita(vacanteFavorita);
                });
                OcultarDivCargando();
                consultarVacante();
            },
            error: function (xhr, textStatus, errorThrown) {
                abrirAlert(errorThrown);
                OcultarDivCargando();
            }
        });
    }
    else {
        OcultarDivCargando();
        $("#div_sin_favoritas").fadeIn();
    }
}

function actualizarVacanteFavorita(vacanteFavorita) {
    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 200000);
    db.transaction(execute, error, exito);

    function execute(tx) {
        tx.executeSql('INSERT INTO vacantes (id, titulo, nombre_tipo, descripcion, vacantes, cargo, nombre_salario, sector, nombre_experiencia, nombre_nivel, profesion, nombre_departamento, nombre_municipio, fecha_publicacion, fecha_vencimiento, dias_vence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) ' +
                'VALUES ("' + vacanteFavorita.ID + '", "' + vacanteFavorita.Titulo + '" , "' + vacanteFavorita.Tipo + '", "' + vacanteFavorita.Descripcion + '", "' + vacanteFavorita.Num_vacantes + '", "' + vacanteFavorita.Cargo + '", "' + vacanteFavorita.Salario + '", "' + vacanteFavorita.Sector + '", "' + vacanteFavorita.Experiencia + '", "' + vacanteFavorita.Nivel_estudios + '", "' + vacanteFavorita.Profesion + '", "' + vacanteFavorita.DepartamentoNombre + '", "' + vacanteFavorita.MunicipioNombre + '", "' + vacanteFavorita.Fecha_publicacion + '", "' + vacanteFavorita.Fecha_vencimiento + '", "' + vacanteFavorita.DiasVence + '", "' + vacanteFavorita.Empleador + '", "' + vacanteFavorita.Telefono + '", "' + vacanteFavorita.Indicativo + '", "' + vacanteFavorita.Celular + '", "' + vacanteFavorita.Direccion + '", "' + vacanteFavorita.Email + '", "' + vacanteFavorita.Ultima_Actualizacion + '")');
    }

    // Transaction error callback
    function error(err) {
        console.log(err);
        alert("Error de operación: " + err);
    }

    function exito() {
        if (localStorage.getItem('vacantesGuardadas'))
            localStorage.setItem("vacantesGuardadas", localStorage.getItem("vacantesGuardadas") + "id" + vacanteFavorita.ID + ",");
        else
            localStorage.setItem("vacantesGuardadas", "id" + vacanteFavorita.ID + ",");
        console.log("Operación Exitosa!");
    }
}

function CancelarDenuncia(id) {
    $("#btnDen" + id).show();
    $("#comboDen" + id).hide();
}

function consultarVacante() {
    var db = window.openDatabase("bd_vacantes", "1.0", "vacantes", 200000);

    db.transaction(consultar_listaVacantes, errorConsultarVacantes, function () {
        console.log("Consultó las vacantes")
    });

    function consultar_listaVacantes(tx) {
        tx.executeSql("SELECT * FROM vacantes ORDER BY fecha_vencimiento ASC", [], validar_listadoVacantes, function (error) {
            console.log("Error consultado el listado de vacantes: " + error)
        });
    }

    function errorConsultarVacantes(err) {
        console.log(err);
        alert("Error consultando listado de vacantes" + err);
    }
}

function Denunciar(id) {
    $("#btnDen" + id).hide();
    $("#comboDen" + id).show();
    //alert("Denuncia: "+id)
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

function eliminarfavorita(id) {
    var id_vacante = id;
    function execute(tx) {
        tx.executeSql('DELETE FROM vacantes WHERE id = \'' + id_vacante + '\'');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        localStorage.setItem("vacantesGuardadas", localStorage.getItem("vacantesGuardadas").replace("id" + id_vacante + ",", ""));
        $("#vacanteFavorita_" + id_vacante).fadeOut();
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 200000);
    db.transaction(execute, error, exito);
}


function eliminarTodasfavoritas() {
    function execute(tx) {
        tx.executeSql('DELETE FROM vacantes');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        $("#ofertas").empty();
        console.log("Eliminación exitosa.")
    }

    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 200000);
    db.transaction(execute, error, exito);

}

function GuardarDenuncia(id) {
    //alert("Guardar: "+id+" Motivo: "+$("#selectMotivoDenuncia"+id).val());
    var denuncia = new Object();
    denuncia.Fecha = null;
    denuncia.Tipo = $("#selectMotivoDenuncia" + id + " option:selected").html();
    denuncia.vacanteID = id;

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/agregarDenuncia',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(denuncia),
        success: function (data, textStatus, xhr) {
            alert(data);
            if (data == "Denuncia guardada correctamente") {
                $("#btnDen" + id).show();
                $("#comboDen" + id).hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

function Tamanio() {
    var height = window.innerHeight;
    height_fin = height + "px";
    $('#content').css('min-height', height_fin);
}

function validar_listadoVacantes(tx, results) {
    var len = results.rows.length;
    var texto = "";
    var n = 0;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var rutaEstrella = "images/estrella_llena.png";
            var textoFavorita = "Quitar de favoritas";
            n = results.rows.item(i).fecha_vencimiento.indexOf('T');

            texto += '<div class="container" id="vacanteFavorita_' + results.rows.item(i).id + '">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2" style="font-weight: normal; font-size: 15px; color: black;">' +
                                results.rows.item(i).titulo + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
            if (results.rows.item(i).dias_vence == 0)
                texto += 'Vence HOY</label>';
            else if (results.rows.item(i).dias_vence == 1)
                texto += 'Vence MAÑANA</label>';
            else
                texto += 'Vence en ' + results.rows.item(i).dias_vence + ' días</label>';
            texto += '</a>' +
                            '<div class="toggle-content">' +
                                '<p style="text-align:justify;">' +
                                    '<label style="padding-bottom:10px;">' +
                                        results.rows.item(i).descripcion +
                                    '</label>' +
                                    '<label>' +
                                        'Número de vacantes: <b>' + results.rows.item(i).vacantes + '</b></label>' +
                                    '<label>' +
                                        'Cargo: <b>' + results.rows.item(i).cargo + '</b></label>' +
                                    '<label>' +
                                        'Salario: <b>' + results.rows.item(i).nombre_salario + '</b></label>' +
                                    '<label>' +
                                        'Sector: <b>' + results.rows.item(i).sector + '</b></label>' +
                                    '<label>' +
                                        'Experiencia: <b>' + results.rows.item(i).nombre_experiencia + '</b></label>' +
                                    '<label>' +
                                        'Nivel de Estudios: <b>' + results.rows.item(i).nombre_nivel + '</b></label>' +
                                    '<label>' +
                                        'Profesión: <b>' + results.rows.item(i).profesion + '</b></label>' +
                                    '<label>' +
                                        'Departamento: <b>' + results.rows.item(i).nombre_departamento + '</b></label>' +
                                    '<label>' +
                                        'Municipio: <b>' + results.rows.item(i).nombre_municipio + '</b></label>' +
                                    '<label>' +
                                        'Fecha Vencimiento: <b>' + results.rows.item(i).fecha_vencimiento.substring(0, n) + '</b></label>' +
                                '</p>' +
                                '<div class="toggle-content">' +
                                    '<p><strong style="font-size: medium;">DATOS DE CONTACTO DEL EMPLEADOR:</strong></p>' +
                                    '<div class="one-half-responsive ">' +
                                        '<div class="submenu-navigation">' +
                                            '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Teléfono (Indicativo): <b>' + results.rows.item(i).telefono + ' (' + results.rows.item(i).indicativo + ')</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Celular: <b>' + results.rows.item(i).celular + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Dirección: <b>' + results.rows.item(i).direccion + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">E-mail: <b>' + results.rows.item(i).email + '</b></li>' +
                                                '</ul>' +
                                            '</a>';
            if ($("#label-internet-connection").text() == "Online")
                texto += '<a name="#" style="width:60%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                                '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo<label>' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li style="padding-left: 0px;">' +
                                                        '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + results.rows.item(i).titulo + '\', ' + results.rows.item(i).id + ')"/></div>' +
                                                        '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + results.rows.item(i).titulo + '\', ' + results.rows.item(i).id + ')"/></div>' +
                                                    '</li>' +
                                                '</ul>' +
                                            '</a>';


            texto += '<a name="#" style="width:40%; float:left; padding-top: 10px !important; padding-bottom: 10px !important; text-align: center;">' +
                                                '<label style="padding-left: 10px;">Quitar de favoritos</label>' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li style="padding-left: 0px;">' +
                                                        '<img id="estrella' + results.rows.item(i).id + '" src="' + rutaEstrella + '" onclick=\"eliminarfavorita(' + results.rows.item(i).id + ');\" style="margin: 0 auto; width: 30px;" />' +
                                                    '</li>' +
                                                '</ul>' +
                                            '</a>' +
                                                        '</div>' +
                                                    '</div>';

            if ($("#label-internet-connection").text() == "Online")
                texto += '<div class="one-half-responsive" style="text-align:center !important;">' +
                                                 '<div id="btnDen' + results.rows.item(i).id + '" style="width: 100%; float: left; padding-top: 5px; padding-bottom: 5px; display:block; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1);"><a name="#" onclick="Denunciar(' + results.rows.item(i).id + ')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                                 '<div id="comboDen' + results.rows.item(i).id + '" style="width: 96%; float: left;margin-left: 2%; display:none; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1); padding-top: 5px; padding-bottom: 5px;">Motivo de la denuncia: <br />' +
                                                 '<select class="styled-select" style="width:100% !important; margin-bottom: 5px;" name="selectMotivoDenuncia' + results.rows.item(i).id + '" id="selectMotivoDenuncia' + results.rows.item(i).id + '">' +
                                                    '<option value="1">Vacante sospechosa / engañosa</option>' +
                                                    '<option value="2">Lenguaje no adecuado</option>' +
                                                    '<option value="3">Información de contacto errónea </option>' +
                                                    '<option value="4">Sospecha de Trata de personas</option>' +
                                                '</select>' +
                                                '<br /> <a name="#" onclick="GuardarDenuncia(' + results.rows.item(i).id + ')" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a name="#" onclick="CancelarDenuncia(' + results.rows.item(i).id + ')" class="button-icon icon-setting button-red">Cancelar</a>' +
                                                '</div>' +
                                            '</div>';
            texto += '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '</div>';
        }

        $("#ofertas").html(texto);

        $('.deploy-toggle-2').click(function () {
            $(this).parent().find('.toggle-content').toggle(100);
            $(this).toggleClass('toggle-2-active');
            return false;
        });
        OcultarDivCargando();
        $("#div_sin_favoritas").fadeOut();
    }
    else {
        $("#div_sin_favoritas").fadeIn();
    }
}