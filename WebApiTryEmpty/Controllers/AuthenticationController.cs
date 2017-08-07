using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using WebApiTryEmpty.Model;
using System.Web.Configuration;

namespace WebApiTryEmpty.Controllers
{
    public class AuthenticationController : ApiController
    {

        TaskManagerDbContext Context = new TaskManagerDbContext(WebConfigurationManager.ConnectionStrings["TaskManagerDB"].ConnectionString);

        [HttpGet]
        public bool CheckLogin(string log)
        {
            return Context.Users.Any(c => c.Login.Equals(log));
        }

        [HttpGet]
        public HttpResponseMessage Autorization(string login, string password)
        {
            User user = Context.Users.Where(c => c.Login == login && c.Password == password).FirstOrDefault();
            if (user == null) user = new Model.User() { UserId = -1 };

            var cookie = new CookieHeaderValue("UserId", user.UserId.ToString());

            cookie.Expires = DateTimeOffset.Now.AddDays(30);
            cookie.Domain = Request.RequestUri.Host;
            cookie.Path = "/";
            var response = Request.CreateResponse<User>(user);
            response.Headers.AddCookies(new CookieHeaderValue[] { cookie });

            return response;
        }

        [HttpPost]
        public void RegUser([FromBody]User newUser)
        {
            Context.Users.Add(newUser);
            Context.SaveChanges();
        }


    }
}             