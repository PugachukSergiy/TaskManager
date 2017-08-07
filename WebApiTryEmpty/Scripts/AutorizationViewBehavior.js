

$('#Enter').bind('click', Autorization);

$('#Registration').bind('click', function () {
    $('#RegistrationForm').show();
    $('#LoginForm').hide();
});

$('#CancleRegistrationButton').bind('click', function () {
    $('#RegistrationForm').hide();
    $('#LoginForm').show();
    $('#RegistrationLogin').val('');
    $('#RegistrationPassword').val('');
    $('#RegistrationName').val('');
    $('#RegistrationForm input').removeClass('Ready');
});

$('#RegistrationButton').bind('click', RegistrUser);


$('#RegistrationLogin').focusout(CheckLogin);

$('#RegistrationPassword').focusout(function ()
{
    if ($('#RegistrationPassword').val() == '') {
        $('#PasswordStatus').html('Нужно придумать пароль');
        $('#RegistrationPassword').removeClass('Ready');
    }
    else {
        $('#PasswordStatus').html('Готово');
        $('#RegistrationPassword').addClass('Ready');
    }
});

$('#RegistrationName').focusout(function ()
{
    if ($('#RegistrationName').val() == '') {
        $('#NameStatus').html('Нужно придумать имя');
        $('#RegistrationName').removeClass('Ready');
    }
    else {
        $('#NameStatus').html('Готово');
        $('#RegistrationName').addClass('Ready');
    }
});

$('#RegistrationForm').hide();

function Autorization()
{
    if ($('#Login').val() == '') {
        alert('Введите логин');
        return;
    }
    else if ($('#Password').val() == '') {
        alert('Введите пароль');
        return;
    }

    $.ajax({
        url: '/api/Authentication/Autorization/' + $('#Login').val() + '/' + $('#Password').val(),
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.UserId <= 0)
            {
                alert('Неверный логин или пароль');
            }

            else document.location.href = "/Views/Tasks.cshtml";
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}

function CheckLogin()
{
    if ($('#RegistrationLogin').val() == '')
    {
        $('#LoginStatus').html('Нужно придумать логин');
        $('#RegistrationLogin').removeClass('Ready');
        return;
    }

    $.ajax({
        url: '/api/Authentication/CheckLogin/cl/' + $('#RegistrationLogin').val(),
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data) {
                $('#LoginStatus').html('Готово');
                $('#RegistrationLogin').addClass('Ready');
            }
            else {
                $('#LoginStatus').html('Логин занят');
                $('#RegistrationLogin').removeClass('Ready');
            }
        },
        error: function (x, y, z) {
            //alert(x + '\n' + y + '\n' + z);
            $('#LoginStatus').html('Ошибка сервера, попробуйте снова');
            $('#RegistrationLogin').removeClass('Ready');
        }
    });
}

function RegistrUser()
{
    if(!$('#RegistrationLogin').hasClass('Ready')||!$('#RegistrationPassword').hasClass('Ready')||!$('#RegistrationName').hasClass('Ready'))
    {
        alert('Заполните все поля');
        return;
    }

    var user=
    {
        Login: $('#RegistrationLogin').val(),
        Password: $('#RegistrationPassword').val(),
        Name: $('#RegistrationName').val()
    }
    $.ajax({
        url: '/api/Authentication/RegUser/',
        type: 'POST',
        data: JSON.stringify(user),
        contentType: "application/json;charset=utf-8",
        success: function () {
            $('#Login').val($('#RegistrationLogin').val());
            $('#Password').val($('#RegistrationPassword').val());
            $('#CancleRegistrationButton').click();
            Autorization();
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}




// позаимствовано с 'https://learn.javascript.ru/cookie'
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

