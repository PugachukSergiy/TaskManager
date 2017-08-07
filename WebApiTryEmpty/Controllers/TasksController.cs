using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using WebApiTryEmpty.Model;
using System.Web.Configuration;

namespace WebApiTryEmpty
{
    public class TasksController : ApiController
    {
        TaskManagerDbContext Context = new TaskManagerDbContext(WebConfigurationManager.ConnectionStrings["TaskManagerDB"].ConnectionString);

        [HttpGet]
        public IEnumerable<Task> GetAllTasks()
        {
            int userId = 0;
            CookieHeaderValue cookie = Request.Headers.GetCookies("UserId").FirstOrDefault();
            if (cookie != null)
            {
                userId = int.Parse(cookie["UserId"].Value);
            }

            return Context.Tasks.Where(c => c.UserId == userId);
        }

        [HttpGet]
        public User GetUserByID(int Id)
        {
            int userId = Id;
            return Context.Users.Include("Tasks").Where(c => c.UserId == userId).FirstOrDefault();
        }

        [HttpPost]
        public void AddNewTask([FromBody]Task task)
        {
            int userId = 0;
            CookieHeaderValue cookie = Request.Headers.GetCookies("UserId").FirstOrDefault();
            if (cookie != null)
            {
                userId = int.Parse(cookie["UserId"].Value);
                task.UserId = userId;
                task.LustUpdate = DateTime.Now;

                if (Context.Tasks.AsNoTracking().Where(c => c.UserId == userId).Count() > 0)
                    task.TaskId = Context.Tasks.AsNoTracking().Where(c => c.UserId == userId).Select(c => c.TaskId).Max() + 1;
                else
                    task.TaskId = 1;

                Context.Tasks.Add(task);
                Context.SaveChanges();
            }
        }

        [HttpDelete]
        public void DeleteTaskByID([FromBody]Task deltask)
        {
            Task task = Context.Tasks.Where(c=>c.UserId== deltask.UserId && c.TaskId== deltask.TaskId).First();
            Context.Tasks.Remove(task);
            Context.SaveChanges();
        }

        [HttpPost]
        public Task UpdateTask([FromBody]Task uptask)
        {
            Task task = Context.Tasks.Where(c => c.UserId == uptask.UserId && c.TaskId == uptask.TaskId).First();
            task.Title = uptask.Title;
            task.Content = uptask.Content;
            task.LustUpdate = DateTime.Now;
            Context.SaveChanges();
            return task;
        }

        [HttpGet]
        public IEnumerable<Task> SearchByTitle(string text)
        {
            int userId = 0;
            CookieHeaderValue cookie = Request.Headers.GetCookies("UserId").FirstOrDefault();
            if (cookie != null)
            {
                userId = int.Parse(cookie["UserId"].Value);
            }
            return Context.Tasks.Where(c => c.UserId == userId && c.Title.Contains(text));
        }

        [HttpGet]
        public IEnumerable<Task> SearchByContent(string text)
        {
            int userId = 0;
            CookieHeaderValue cookie = Request.Headers.GetCookies("UserId").FirstOrDefault();
            if (cookie != null)
            {
                userId = int.Parse(cookie["UserId"].Value);
            }
            return Context.Tasks.Where(c => c.UserId == userId && c.Content.Contains(text));
        }



    }
}