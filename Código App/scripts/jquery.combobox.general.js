$(function () {
    $("#departamento").combobox();
    $("#toggle").click(function () {
        $("#departamento").toggle();
    });

    $('#combobox option').each(function () {
        $(this).removeAttr('selected')
    });

    //Evento change select departamento
    $("#departamento").combobox({
        selectFirst: true,
        select: function (event, ui) {
            //                    abrirAlert(ui.item.text); abrirAlert(ui.item.value);
            $('input.ui-autocomplete-input:eq(1)').val("");
            cargarMunicipios();
        },
        focus: function (event, ui) { event.preventDefault(); }
    });

    $("#municipio").combobox({
        selectFirst: true,
        focus: function (event, ui) { event.preventDefault(); }
    });

    $("#toggle").click(function () {
        $("#municipio").toggle();
    });
});

function cargarDepartamentos() {
    MostrarDivCargando();
    $('#departamento').empty();

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerDepartamentos',
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {
                $('#departamento').append('<option value="' + val['ID'] + '">' + val['Nombre'] + '</option>');
            });
            if (localStorage.getItem('Departamento')) {
                $("#departamento").val(localStorage.getItem('Departamento'));
            }
            else {
                localStorage.setItem('Departamento', $("#departamento").val());
            }
            $('input.ui-autocomplete-input:eq(0)').val($('#departamento option:selected').text());
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
    $('#municipio').empty();
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerMunicipios?departamento=' + $("#departamento").val(),
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {
                $('#municipio').append('<option value="' + val['ID'] + '">' + val['Nombre'] + '</option>');
            });
            if (localStorage.getItem('Municipio')) {
                $("#municipio").val(localStorage.getItem('Municipio'));
            }
            else {
                localStorage.setItem('Municipio', $("#municipio").val());
            }
            $('input.ui-autocomplete-input:eq(1)').val($('#municipio option:selected').text());
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.")
        }
    });
}

function cargarDepartamentosCrud() {
    MostrarDivCargando();
    $('#departamento').empty();

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerDepartamentos',
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {
                $('#departamento').append('<option value="' + val['ID'] + '">' + val['Nombre'] + '</option>');
            });
            if (localStorage.getItem('departamento')) {
                $("#departamento").val(localStorage.getItem('departamento'));
            }
            else {
                localStorage.setItem('departamento', $("#departamento").val());
            }
            $('input.ui-autocomplete-input:eq(0)').val($('#departamento option:selected').text());
            cargarMunicipiosCrud();
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.")
        }
    });
}

function cargarMunicipiosCrud() {
    MostrarDivCargando();
    $('#municipio').empty();
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerMunicipios?departamento=' + $("#departamento").val(),
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {
                $('#municipio').append('<option value="' + val['ID'] + '">' + val['Nombre'] + '</option>');
            });
            if (localStorage.getItem('municipio')) {
                $("#municipio").val(localStorage.getItem('municipio'));
            }
            else {
                localStorage.setItem('municipio', $("#municipio").val());
            }
            $('input.ui-autocomplete-input:eq(1)').val($('#municipio option:selected').text());
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.")
        }
    });
}