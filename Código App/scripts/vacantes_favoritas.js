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

//-----------------------------------------------------------------     A     -----------------------------------------------------------------//

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