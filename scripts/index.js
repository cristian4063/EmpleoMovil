var id = 0;
var listaId = "";
var listData = [];
var datos = [];

var map;
var marker;
var markersArray = [];

$(document).ready(function () {
    if (localStorage.getItem('MostrarabrirAlertaPrimera')) {
        //$("#mostrarabrirAlertaPrimera").val(localStorage.getItem('Experiencia'));
    }
    else {
        abrirAlert('El Servicio de Empleo Móvil le ofrece a los empleadores una solución para publicar vacantes de manera rápida y gratuita cuando no requieren de los servicios de intermediación de un centro de empleo, y a los buscadores un canal para consultarlas de manera inmediata');
        localStorage.setItem('MostrarabrirAlertaPrimera', '1');
    }
    configurar_db();
    if (localStorage.getItem('Nivel')) {
        $("#selectNivel").val(localStorage.getItem('Nivel'));
    }
    if (localStorage.getItem('Oportunidad')) {
        $("#selectTipoOportunidad").val(localStorage.getItem('Oportunidad'));
    }
    if (localStorage.getItem('Salario')) {
        $("#selectSalario").val(localStorage.getItem('Salario'));
    }
    if (localStorage.getItem('Experiencia')) {
        $("#selectExperiencia").val(localStorage.getItem('Experiencia'));
    }
    cargarDepartamentos();
    $("#map_canvas").hide();
});

//-----------------------------------------------------------------     A     -----------------------------------------------------------------//

function agregarFavoritos(id, titulo, descripcion, vacantes, cargo, salario, experiencia, nivel, profesion, fechaPublicacion, fechaVencimiento, diasVence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) {
    //$("#estrella" + id).attr("src", "images/estrella_llena.png");
    localStorage.setItem("id_guardar", id);
    localStorage.setItem("titulo_guardar", titulo);
    localStorage.setItem("descripcion_guardar", descripcion);
    localStorage.setItem("vacantes_guardar", vacantes);
    localStorage.setItem("cargo_guardar", cargo);
    localStorage.setItem("salario_guardar", salario);
    localStorage.setItem("experiencia_guardar", experiencia);
    localStorage.setItem("nivel_guardar", nivel);
    localStorage.setItem("profesion_guardar", profesion);
    localStorage.setItem("fechaPublicacion_guardar", fechaPublicacion);
    localStorage.setItem("fechaVencimiento_guardar", fechaVencimiento);
    localStorage.setItem("diasVence_guardar", diasVence);
    localStorage.setItem("empleador_guardar", empleador);
    localStorage.setItem("telefono_guardar", telefono);
    localStorage.setItem("indicativo_guardar", indicativo);
    localStorage.setItem("celular_guardar", celular);
    localStorage.setItem("direccion_guardar", direccion);
    localStorage.setItem("email_guardar", email);
    localStorage.setItem("fecha_actualizacion", fecha_actualizacion);
    guardarVacante();
}

//-----------------------------------------------------------------     C     -----------------------------------------------------------------//

function cargarOfertas(palabra) {
    $("#map_canvas").hide();

    var detalle = $("#detalle");
    detalle.empty();

    MostrarDivCargando();
    var vectorConectores = ["a", "ante", "bajo", "con", "contra", "de", "desde", "en", "entre", "hacia", "hasta", "para", "por", "según", "segun", "sin", "sobre", "tras", " ", "  ", "   ", ""];

    if (palabra != "") {
        palabra = palabra.trim();
        var palabrasSeparadas = palabra.split(" ");
        var fraseDefinitiva = "";
        var palabraAuxiliar = "";

        for (x = 0; x < palabrasSeparadas.length; x++) {
            palabraAuxiliar = palabrasSeparadas[x];
            palabrasSeparadas[x] = palabraAuxiliar.trim().toLowerCase();
        }

        fraseDefinitiva += palabrasSeparadas[0];

        for (x = 1; x < palabrasSeparadas.length; x++) {
            if ($.inArray(palabrasSeparadas[x], vectorConectores) == -1) {
                fraseDefinitiva += " AND ";
                fraseDefinitiva += palabrasSeparadas[x];
            }
        }

        palabra = fraseDefinitiva;
    }

    var texto = "";
    var ofertas = $("#ofertas");
    ofertas.empty();
    var vacantesGuardadas = localStorage.getItem("vacantesGuardadas");
    var n = 0;

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantes?palabra=' + $("#text_busqueda").val() + '&tipo=' + $("#selectTipoOportunidad").val() + '&salario=' + $("#selectSalario").val() + '&experiencia=' + $("#selectExperiencia").val() + '&nivel=' + $("#selectNivel").val() + '&municipio=' + $("#municipio").val(),
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var cantidad = data.length;
            if (cantidad == 0) {
                abrirAlert("No existen vacantes con los filtros seleccionados, intente seleccionando valores diferentes.")
            }
            $.each(data, function (i, val) {
                //abrirAlert(val['Titulo']);
                var rutaEstrella = "images/estrella_vacia.png";
                var metodoFavorito = 'agregarFavoritos(' + val['ID'] + ',\'' + val['Titulo'] + '\',\'' + val['Descripcion'] + '\',\'' + val['Num_vacantes'] + '\',\'' + val['Cargo'] + '\',\'' + val['Salario'] + '\',\'' + val['Experiencia'] + '\',\'' + val['Nivel_estudios'] + '\',\'' + val['Profesion'] + '\',\'' + val['Fecha_publicacion'] + '\',\'' + val['Fecha_vencimiento'] + '\',\'' + val['DiasVence'] + '\',\'' + val['Empleador'] + '\',\'' + val['Telefono'] + '\',\'' + val['Indicativo'] + '\',\'' + val['Celular'] + '\',\'' + val['Direccion'] + '\',\'' + val['Email'] + '\',\'' + val['Ultima_Actualizacion'] + '\')';
                var metodoDenuncia = 'GuardarDenuncia(' + val['ID'] + ',\'' + val['Titulo'] + '\',\'' + val['Descripcion'] + '\',\'' + val['Num_vacantes'] + '\',\'' + val['Cargo'] + '\',\'' + val['Salario'] + '\',\'' + val['Experiencia'] + '\',\'' + val['Nivel_estudios'] + '\',\'' + val['Profesion'] + '\',\'' + val['Fecha_publicacion'] + '\',\'' + val['Fecha_vencimiento'] + '\',\'' + val['DiasVence'] + '\',\'' + val['Empleador'] + '\',\'' + val['Telefono'] + '\',\'' + val['Indicativo'] + '\',\'' + val['Celular'] + '\',\'' + val['Direccion'] + '\',\'' + val['Email'] + '\',\'' + val['Ultima_Actualizacion'] + '\')';
                var textoFavorita = "Agregar a favoritas";
                if (localStorage.getItem('vacantesGuardadas')) {
                    if (vacantesGuardadas.indexOf("id" + val['ID'] + ",") == -1) {
                        rutaEstrella = "images/estrella_vacia.png";
                    }
                    else {
                        rutaEstrella = "images/estrella_llena.png";
                        metodoFavorito = "yaAgregado()";
                        textoFavorita = "Agregada a favoritas";
                    }
                }
                n = val['Fecha_vencimiento'].indexOf('T');
                texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2" style="font-weight: normal; font-size: 15px; color: black;">' +
                                val['Titulo'] + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
                if (val['DiasVence'] == 0)
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
                                    'Departamento: <b>' + $("#departamento option:selected").text() +'</b></label>' +
                                '<label>' +
                                    'Municipio: <b>' + $("#municipio option:selected").text() +'</b></label>' +
                                '<label>' +
                                    'Fecha Vencimiento: <b>' + val['Fecha_vencimiento'].substring(0, n) + '</b></label>' +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong style="font-size: medium;">DATOS DE CONTACTO DEL EMPLEADOR:</strong></p>' +
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
                                        '<a name="#" style="width:60%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                            '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo</label>' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li style="padding-left: 0px;">' +
                                                    '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                    '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                '</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a name="#" style="width:40%; float:left; padding-top: 10px !important; padding-bottom: 10px !important; text-align: center;">' +
                                            '<label style="padding-left: 10px;">' + textoFavorita + '</label>' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li style="padding-left: 0px;">' +
                                                    '<img id="estrella' + val['ID'] + '" src="' + rutaEstrella + '" onclick=\"' + metodoFavorito + '\" style="margin: 0 auto; width: 30px;" />' +
                                                '</li>' +
                                            '</ul>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="one-half-responsive" style="text-align:center !important;">' +
                                     '<div id="btnDen' + val['ID'] + '" style="width: 100%; float: left; padding-top: 5px; padding-bottom: 5px; display:block; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1);"><a name="#" onclick="Denunciar(' + val['ID'] + ')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                     '<div id="comboDen' + val['ID'] + '" style="width: 96%; float: left;margin-left: 2%; display:none; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1); padding-top: 5px; padding-bottom: 5px;">Motivo de la denuncia: <br />' +
                                     '<select class="styled-select" style="width:100% !important; margin-bottom: 5px;" name="selectMotivoDenuncia' + val['ID'] + '" id="selectMotivoDenuncia' + val['ID'] + '">' +
                                        '<option value="1">Vacante sospechosa / engañosa</option>' +
                                        '<option value="2">Lenguaje no adecuado</option>' +
                                        '<option value="3">Información de contacto errónea </option>' +
                                        '<option value="4">Sospecha de Trata de personas</option>' +
                                    '</select>' +
                                    '<br /> <a name="#" onclick=\"' + metodoDenuncia + '\" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a name="#" onclick="CancelarDenuncia(' + val['ID'] + ')" class="button-icon icon-setting button-red">Cancelar</a>' +
                                    '</div>' +
                                '</div>' +
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
            if (cantidad != 0) {
                if (cantidad == 1) {
                    abrirAlert('Se ha encontrado ' + cantidad + ' oportunidad.');
                }
                else {
                    abrirAlert('Se han encontrado ' + cantidad + ' oportunidades.');
                }

            }
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function cargarVacante(vacanteID) {
    var texto = "";
    var detalle = $("#detalle");
    detalle.empty();
    var n = 0;
    var vacantesGuardadas = localStorage.getItem("vacantesGuardadas");

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacante/' + vacanteID,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {

            var rutaEstrella = "images/estrella_vacia.png";
            var metodoFavorito = 'agregarFavoritos(' + data['ID'] + ',\'' + data['Titulo'] + '\',\'' + data['Descripcion'] + '\',\'' + data['Num_vacantes'] + '\',\'' + data['Cargo'] + '\',\'' + data['Salario'] + '\',\'' + data['Experiencia'] + '\',\'' + data['Nivel_estudios'] + '\',\'' + data['Profesion'] + '\',\'' + data['Fecha_publicacion'] + '\',\'' + data['Fecha_vencimiento'] + '\',\'' + data['DiasVence'] + '\',\'' + data['Empleador'] + '\',\'' + data['Telefono'] + '\',\'' + data['Indicativo'] + '\',\'' + data['Celular'] + '\',\'' + data['Direccion'] + '\',\'' + data['Email'] + '\',\'' + data['Ultima_Actualizacion'] + '\')';
            var metodoDenuncia = 'GuardarDenuncia(' + data['ID'] + ',\'' + data['Titulo'] + '\',\'' + data['Descripcion'] + '\',\'' + data['Num_vacantes'] + '\',\'' + data['Cargo'] + '\',\'' + data['Salario'] + '\',\'' + data['Experiencia'] + '\',\'' + data['Nivel_estudios'] + '\',\'' + data['Profesion'] + '\',\'' + data['Fecha_publicacion'] + '\',\'' + data['Fecha_vencimiento'] + '\',\'' + data['DiasVence'] + '\',\'' + data['Empleador'] + '\',\'' + data['Telefono'] + '\',\'' + data['Indicativo'] + '\',\'' + data['Celular'] + '\',\'' + data['Direccion'] + '\',\'' + data['Email'] + '\',\'' + data['Ultima_Actualizacion'] + '\')';
            var textoFavorita = "Agregar a favoritas";
            if (localStorage.getItem('vacantesGuardadas')) {
                if (vacantesGuardadas.indexOf("id" + data['ID'] + ",") == -1) {
                    rutaEstrella = "images/estrella_vacia.png";
                }
                else {
                    rutaEstrella = "images/estrella_llena.png";
                    metodoFavorito = "yaAgregado()";
                    textoFavorita = "Agregada a favoritas";
                }
            }
            n = data['Fecha_vencimiento'].indexOf('T');
            texto += '<div class="container">' +
                    '<div class="toggle-2">' +
                        '<a href="#" class="deploy-toggle-2 toggle-2-active" style="font-weight: normal; font-size: 15px; color: black;">' +
                            data['Titulo'] + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
            if (data['DiasVence'] == 0)
                texto += 'Vence HOY</label>';
            else if (data['DiasVence'] == 1)
                texto += 'Vence MAÑANA</label>';
            else
                texto += 'Vence en ' + data['DiasVence'] + ' días</label>';
            texto += '</a>' +
                    '<div class="toggle-content" style="overflow: hidden; display: block;">' +
                        '<p style="text-align:justify;">' +
                            '<label style="padding-bottom:10px;">' +
                                data['Descripcion'] +
                            '</label>' +
                            '<label>' +
                                'Número de vacantes: <b>' + data['Num_vacantes'] + '</b></label>' +
                            '<label>' +
                                'Cargo: <b>' + data['Cargo'] + '</b></label>' +
                            '<label>' +
                                'Salario: <b>' + data['Salario'] + '</b></label>' +
                            '<label>' +
                                'Experiencia: <b>' + data['Experiencia'] + '</b></label>' +
                            '<label>' +
                                'Nivel de Estudios: <b>' + data['Nivel_estudios'] + '</b></label>' +
                            '<label>' +
                                'Profesión: <b>' + data['Profesion'] + '</b></label>' +
                            '<label>' +
                                'Departamento: <b>' + $("#departamento option:selected").text() + '</b></label>' +
                            '<label>' +
                                'Municipio: <b>' + $("#municipio option:selected").text() + '</b></label>' +
                            '<label>' +
                                'Fecha Vencimiento: <b>' + data['Fecha_vencimiento'].substring(0, n) + '</b></label>' +
                        '</p>' +
                        '<div class="toggle-content" style="overflow: hidden; display: block;">' +
                            '<p><strong>DATOS DE CONTACTO DEL EMPLEADOR:</strong></p>' +
                            '<div class="one-half-responsive ">' +
                                '<div class="submenu-navigation">' +
                                    '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Teléfono (Indicativo): <b>' + data['Telefono'] + ' (' + data['Indicativo'] + ')</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Celular: <b>' + data['Celular'] + '</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Dirección: <b>' + data['Direccion'] + '</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">E-mail: <b>' + data['Email'] + '</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="width:60%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                        '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo<label>' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li style="padding-left: 0px;">' +
                                                '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + data['Titulo'] + '\', ' + data['ID'] + ')"/></div>' +
                                                '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + data['Titulo'] + '\', ' + data['ID'] + ')"/></div>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="width:40%; float:left; padding-top: 10px !important; padding-bottom: 10px !important; text-align: center;">' +
                                        '<label style="padding-left: 10px;">' + textoFavorita + '</label>' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li style="padding-left: 0px;">' +
                                                '<img id="estrella' + data['ID'] + '" src="' + rutaEstrella + '" onclick=\"' + metodoFavorito + '\" style="margin: 0 auto; width: 30px;" />' +
                                            '</li>' +
                                        '</ul>' +
                                    '</a>' +
                                '</div>' +
                            '</div>' +
                            '<div class="one-half-responsive" style="text-align:center !important;">' +
                                    '<div id="btnDen' + data['ID'] + '" style="width: 100%; float: left; padding-top: 5px; padding-bottom: 5px; display:block; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1);"><a name="#" onclick="Denunciar(' + data['ID'] + ')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                    '<div id="comboDen' + data['ID'] + '" style="width: 96%; float: left;margin-left: 2%; display:none; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1); padding-top: 5px; padding-bottom: 5px;">Motivo de la denuncia: <br />' +
                                    '<select class="styled-select" style="width:100% !important; margin-bottom: 5px;" name="selectMotivoDenuncia' + data['ID'] + '" id="selectMotivoDenuncia' + data['ID'] + '">' +
                                    '<option value="1">Vacante sospechosa / engañosa</option>' +
                                    '<option value="2">Lenguaje no adecuado</option>' +
                                    '<option value="3">Información de contacto errónea </option>' +
                                    '<option value="4">Sospecha de Trata de personas</option>' +
                                '</select>' +
                                '<br /> <a name="#" onclick=\"' + metodoDenuncia + '\" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a name="#" onclick="CancelarDenuncia(' + data['ID'] + ')" class="button-icon icon-setting button-red">Cancelar</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="formSubmitButtonErrorsWrap">' +
                    '<br />' +
                    '<input type="submit" class="buttonWrap button button-dark contactSubmitButton" id="mapButton" value="Volver al mapa" data-formid="contactForm" onclick="volverMapa();" />' +
                '</div>' +
            '</div>' +
            '</div>';

            $("#detalle").html(texto);

            $('.deploy-toggle-2').click(function () {
                $(this).parent().find('.toggle-content').toggle(100);
                $(this).toggleClass('toggle-2-active');
                return false;
            });

            $("#map_canvas").hide();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert(errorThrown);
        }
    });
}

function cargarVacantesMapa(palabra) {

    var ofertas = $("#ofertas");
    ofertas.empty();

    var detalle = $("#detalle");
    detalle.empty();

    MostrarDivCargando();

    var vectorConectores = ["a", "ante", "bajo", "con", "contra", "de", "desde", "en", "entre", "hacia", "hasta", "para", "por", "según", "segun", "sin", "sobre", "tras", " ", "  ", "   ", ""];

    if (palabra != "") {
        palabra = palabra.trim();
        var palabrasSeparadas = palabra.split(" ");
        var fraseDefinitiva = "";
        var palabraAuxiliar = "";

        for (x = 0; x < palabrasSeparadas.length; x++) {
            palabraAuxiliar = palabrasSeparadas[x];
            palabrasSeparadas[x] = palabraAuxiliar.trim().toLowerCase();
        }

        fraseDefinitiva += palabrasSeparadas[0];

        for (x = 1; x < palabrasSeparadas.length; x++) {
            if ($.inArray(palabrasSeparadas[x], vectorConectores) == -1) {
                fraseDefinitiva += " AND ";
                fraseDefinitiva += palabrasSeparadas[x];
            }
        }

        palabra = fraseDefinitiva;
    }

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantesMapa?palabra=' + $("#text_busqueda").val() + '&tipo=' + $("#selectTipoOportunidad").val() + '&salario=' + $("#selectSalario").val() + '&experiencia=' + $("#selectExperiencia").val() + '&nivel=' + $("#selectNivel").val() + '&municipio=' + $("#municipio").val(),
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var cantidad = data.length;
            if (cantidad != 0) {
                $.each(data, function (i, val) {
                    listData[i] = { "ID": "" + val['ID'] + "", "Nombre": "" + val['Titulo'] + "", "GeoLat": "" + val['Latitud'] + "", "GeoLong": "" + val['Longitud'] + "" };
                });
                setTimeout(function () {
                    Initialize(listData);
                }, 500);
                $("#map_canvas").show();
            }
            else {
                abrirAlert("No existe información geo-referenciada suficiente.");
            }
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function configurar_db() {
    function execute(tx) {
//        tx.executeSql('DROP TABLE vacantes');
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

//-----------------------------------------------------------------     E     -----------------------------------------------------------------//

function enviar(opcion) {
    if ($("#departamento").val() == null || $('input.ui-autocomplete-input:eq(0)').val() == "") {
        abrirAlert("Debe seleccionar un departamento.")
    }
    else {
        if ($("#municipio").val() == null || $('input.ui-autocomplete-input:eq(1)').val() == "") {
            abrirAlert("Debe seleccionar un municipio.")
        }
        else {
            localStorage.setItem('Departamento', $("#departamento").val());
            localStorage.setItem('Municipio', $("#municipio").val());
            localStorage.setItem('Nivel', $("#selectNivel").val());
            localStorage.setItem('Oportunidad', $("#selectTipoOportunidad").val());
            localStorage.setItem('Salario', $("#selectSalario").val());
            localStorage.setItem('Experiencia', $("#selectExperiencia").val());

            if (opcion == 1) {
                cargarOfertas($("#text_busqueda").val());
            }
            else {
                cargarVacantesMapa($("#text_busqueda").val());
            }
        }
    }
}

//-----------------------------------------------------------------     I     -----------------------------------------------------------------//

function Initialize(data) {
    // Google has tweaked their interface somewhat - this tells the api to use that new UI
    google.maps.visualRefresh = true;

    var city = new google.maps.LatLng(data[0].GeoLat, data[0].GeoLong);

    // These are options that set initial zoom level, where the map is centered globally to start, and the type of map to show
    var mapOptions = {
        zoom: 14,
        center: city,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    // Using the JQuery "each" selector to iterate through the JSON list and drop marker pins
    $.each(data, function (i, item) {
        var marker = new google.maps.Marker({
            'position': new google.maps.LatLng(item.GeoLat, item.GeoLong),
            'map': map,
            'title': item.PlaceName
        });

        // Make the marker-pin blue!
        marker.setIcon('images/marker.png');

        // put in some information about each json object - in this case, the opening hours.
        var infowindow = new google.maps.InfoWindow({
            content: "<div class='infoDiv'><h2>" + item.Nombre + "</h2><div><input type='submit' class='buttonWrap button button-dark contactSubmitButton' onclick='cargarVacante(" + item.ID + ")' value='Ver detalles' /></div></div>"
        });

        // finally hook up an "OnClick" listener to the map so it pops up out info-window when the marker-pin is clicked!
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

    })
}

//-----------------------------------------------------------------     V     -----------------------------------------------------------------//

function volverMapa() {
    var detalle = $("#detalle");
    detalle.empty();
    $("#map_canvas").show();
}

//-----------------------------------------------------------------     Y     -----------------------------------------------------------------//

function yaAgregado() {
    abrirAlert("La vacante ya ha sido agregada como favorita.");
}