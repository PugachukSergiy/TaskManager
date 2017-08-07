


GetUser();


$('#AddButton').bind('click', AddTask);

$('#AddNewTaskButton').bind('click', function () {
    $('#AddNewTaskForm').show();
    $('#AddNewTaskButton').hide();
});

$('#CancleButton').bind('click', function () {
    $('#AddNewTaskForm').hide();
    $('#AddNewTaskButton').show();
});

$('#SeeAllTasksButton').bind('click', ShowAllTasks);

$('#AddNewTaskForm').hide();

function GetUser() {
    if (!CheckCookie()) return;
    var cookieUserId = Number(getCookie('UserId'));

    $.ajax({
        url: '/api/Tasks/GetUserByID/' + cookieUserId,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#UserName').html(data.Name);
            ShowResult(data.Tasks);
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}

function ShowAllTasks() {
    if (!CheckCookie()) return;
        $.ajax({
            url: '/api/Tasks/GetAllTasks',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#ResultHeader').html("All your tasks:");
                ShowResult(data);
          },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        });
}



function SearchBy(SearcType) {
    if (!CheckCookie()) return;
    var SrText = $('#SearcingText').val();
    if (SrText == '')
    {
        alert('Введите искомый текст');
        return;
    }
    var SerchUri;
    if (SearcType == 'Content') SerchUri = '/api/Tasks/SearchByContent/s/r/'; 
    else if (SearcType == 'Title')  SerchUri = '/api/Tasks/SearchByTitle/s/r/'; 
    else return;
    $.ajax({
        url: SerchUri + SrText,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#ResultHeader').html("Tasks with '" + SrText + "' in " + SearcType + ":");
            ShowResult(data);
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}


function ShowResult(Tasks) {
    var result = "";
    $.each(Tasks, function (index, Task) {
        result += ShowTask(Task);
    });
    $('#ResponseContent').html(result);
}

function ShowTask(Task)
{
    var lustUpdate = new Date(Task.LustUpdate);
    return taskView = "<div id ='" + Task.TaskId + "' class = 'taskView'><input hidden Value='" + Task.TaskId + "'>" + "<div class = 'TaskTitle'>" + Task.Title + "</div><button class='DeleteTaskButton' onclick='DeleteTask(" + Task.UserId + "," + Task.TaskId + ")'>Delete</button><button class='UdateTaskButton' onclick='OpenUpdateForm(" + Task.TaskId + ")'>Update</button>" + "</br><div class = 'TaskContent'>" + Task.Content + "</div><div class='taskViewDate'>" + lustUpdate.getFullYear() + '-' + (lustUpdate.getMonth() + 1) + '-' + (lustUpdate.getDate() + 1) + ' ' + lustUpdate.getHours() + ':' + lustUpdate.getMinutes() + "</div></div>";
}


//Добавление нового задания

function AddTask()
{
    if (!CheckCookie()) return;
    var task =
    {
        Title: $('#TaskTitle').val(),    
        Content: $('#TaskContent').val(),  
    }
    $.ajax({
        url: '/api/Tasks/AddNewTask/',
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            ShowAllTasks();
            $('#TaskTitle').val('');
            $('#TaskContent').val('');
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
    $('#CancleButton').click();
}

//Удаление задания

function DeleteTask(userId, taskId) {
    if (!CheckCookie()) return;
    var task =
    {
        UserId: userId,    
        TaskId: taskId,  
    }
    $.ajax({
        url: '/api/Tasks/DeleteTaskByID',
        type: 'DELETE',
        data: JSON.stringify(task),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            ShowAllTasks();
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}


//Изменение задания

function OpenUpdateForm(taskId)
{
    CloseUpdateForm();
    var form = "<div id='UpdateTaskForm'><input hidden id='UpdateTaskId' value='" + taskId + "'><input id='UpdateTaskTitle' value='" + $('#' + taskId + ' .TaskTitle').html() + "'></br><textarea id='UpdateTaskContent' >" + $('#' + taskId + ' .TaskContent').html() + "</textarea></br><button id='UpdateButton' onclick ='UpdateTask()'>Update</button><button id='CloseUpdateFormButton' onclick ='CloseUpdateForm()'>Cancle</button></div>";
    $('#' + taskId).hide();
    $('#' + taskId).after(form);
}

function CloseUpdateForm()
{
    $('#UpdateTaskForm').remove();
    $('.taskView').show();
}


function UpdateTask()
{
    if(!CheckCookie()) return;
    var task =
    {
        UserId: getCookie('UserId'),
        TaskId: $('#UpdateTaskId').val(),
        Title: $('#UpdateTaskTitle').val(),
        Content: $('#UpdateTaskContent').val()
    }
    CloseUpdateForm();
    $.ajax({
        url: '/api/Tasks/UpdateTask/',
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#' + data.TaskId).replaceWith(ShowTask(data));
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}

function CheckCookie()
{
    var cookieUserId = Number(getCookie('UserId'));
    if (!(cookieUserId > 0))
    {
        alert("Время действия авторизации истекло");
        document.location.href = "/Views/Autorization.cshtml";
        return false;
    }
    return true;
}

// позаимствовано с 'https://learn.javascript.ru/cookie'
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}