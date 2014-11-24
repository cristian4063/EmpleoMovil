//-----------------------------------------------------------------     A     -----------------------------------------------------------------//

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

//-----------------------------------------------------------------     C     -----------------------------------------------------------------//

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

    function validar_listadoVacantes(tx, results) {
        var len = results.rows.length;
        var texto = "";
        var n = 0;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var rutaEstrella = "images/estrella_llena.png";
                var textoFavorita = "Quitar de favoritas";
                var metodoDenuncia = 'GuardarDenuncia(' + results.rows.item(i).id + ',\'' + results.rows.item(i).titulo + '\',\'' + results.rows.item(i).descripcion + '\',\'' + results.rows.item(i).vacantes + '\',\'' + results.rows.item(i).cargo + '\',\'' + results.rows.item(i).nombre_salario + '\',\'' + results.rows.item(i).nombre_experiencia + '\',\'' + results.rows.item(i).nombre_nivel + '\',\'' + results.rows.item(i).profesion + '\',\'' + results.rows.item(i).fecha_publicacion + '\',\'' + results.rows.item(i).fecha_vencimiento + '\',\'' + results.rows.item(i).dias_vence + '\',\'' + results.rows.item(i).empleador + '\',\'' + results.rows.item(i).telefono + '\',\'' + results.rows.item(i).indicativo + '\',\'' + results.rows.item(i).celular + '\',\'' + results.rows.item(i).direccion + '\',\'' + results.rows.item(i).email + '\',\'' + results.rows.item(i).fecha_actualizacion + '\')';
                n = results.rows.item(i).fecha_vencimiento.indexOf('T');

                texto += '<div class="container" id="vacanteFavorita_' + results.rows.item(i).id + '">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2" style="font-weight: normal; font-size: 15px; color: black;">' +
                                results.rows.item(i).titulo + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
                if (results.rows.item(i).dias_vence == 1)
                    texto += 'Vence HOY</label>';
                else if (results.rows.item(i).dias_vence == 2)
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
                                                '<br /> <a name="#" onclick=\"' + metodoDenuncia + '\" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a name="#" onclick="CancelarDenuncia(' + results.rows.item(i).id + ')" class="button-icon icon-setting button-red">Cancelar</a>' +
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

    function errorConsultarVacantes(err) {
        console.log(err);
        alert("Error consultando listado de vacantes" + err);
    }
}

//-----------------------------------------------------------------     E     -----------------------------------------------------------------//

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

//-----------------------------------------------------------------     G     -----------------------------------------------------------------//

function guardarVacante() {
    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 100000);
    db.transaction(GuardarVacanteBD, errorOperacion, operacionEfectuada);

    function GuardarVacanteBD(tx) {
        var id = localStorage.getItem("id_guardar");
        var titulo = localStorage.getItem("titulo_guardar");
        var nombre_tipo = $("#selectTipoOportunidad option:selected").text();
        var descripcion = localStorage.getItem("descripcion_guardar");
        var vacantes = localStorage.getItem("vacantes_guardar");
        var cargo = localStorage.getItem("cargo_guardar");
        var salario = localStorage.getItem("salario_guardar");
        var experiencia = localStorage.getItem("experiencia_guardar");
        var nivel = localStorage.getItem("nivel_guardar");
        var profesion = localStorage.getItem("profesion_guardar");
        var departamento = $("#departamento option:selected").text();
        var municipio = $("#municipio option:selected").text();
        var fecha_publicacion = localStorage.getItem("fechaPublicacion_guardar");
        var fecha_vencimiento = localStorage.getItem("fechaVencimiento_guardar");
        var dias_vence = localStorage.getItem("diasVence_guardar");
        var empleador = localStorage.getItem("empleador_guardar");
        var telefono = localStorage.getItem("telefono_guardar");
        var indicativo = localStorage.getItem("indicativo_guardar");
        var celular = localStorage.getItem("celular_guardar");
        var direccion = localStorage.getItem("direccion_guardar");
        var email = localStorage.getItem("email_guardar");
        var fecha_actualizacion = localStorage.getItem("fecha_actualizacion");

        tx.executeSql('INSERT INTO vacantes (id, titulo, nombre_tipo, descripcion, vacantes, cargo, nombre_salario, sector, nombre_experiencia, nombre_nivel, profesion, nombre_departamento, nombre_municipio, fecha_publicacion, fecha_vencimiento, dias_vence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) ' +
        'VALUES ("' + id + '", "' + titulo + '" , "' + nombre_tipo + '", "' + descripcion + '", "' + vacantes + '", "' + cargo + '", "' + salario + '", " ", "' + experiencia + '", "' + nivel + '", "' + profesion + '", "' + departamento + '", "' + municipio + '", "' + fecha_publicacion + '", "' + fecha_vencimiento + '", "' + dias_vence + '", "' + empleador + '", "' + telefono + '", "' + indicativo + '", "' + celular + '", "' + direccion + '", "' + email + '", "' + fecha_actualizacion + '")');
    }

    // Transaction error callback
    function errorOperacion(err) {
        console.log(err);
        abrirAlert("Error de operación: " + err);
    }

    function operacionEfectuada() {
        $("#estrella" + localStorage.getItem("id_guardar")).attr("src", "images/estrella_llena.png")
        if (localStorage.getItem('vacantesGuardadas'))
            localStorage.setItem("vacantesGuardadas", localStorage.getItem("vacantesGuardadas") + "id" + localStorage.getItem("id_guardar") + ",");
        else
            localStorage.setItem("vacantesGuardadas", "id" + localStorage.getItem("id_guardar") + ",");
        console.log("Operación Exitosa!");
        abrirAlert("La vacante ha sido almacenada como favorita");
    }
}