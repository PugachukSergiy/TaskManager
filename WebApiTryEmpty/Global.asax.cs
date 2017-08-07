using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.Security;
using System.Web.SessionState;

namespace WebApiTryEmpty
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            GlobalConfiguration.Configuration.Routes.MapHttpRoute("Route1", "api/{controller}/{action}");
            GlobalConfiguration.Configuration.Routes.MapHttpRoute("Route2", "api/{controller}/{action}/{id}");
            GlobalConfiguration.Configuration.Routes.MapHttpRoute("Route3", "api/{controller}/{action}/cl/{log}");
            GlobalConfiguration.Configuration.Routes.MapHttpRoute("Route5", "api/{controller}/{action}/s/r/{text}");
            GlobalConfiguration.Configuration.Routes.MapHttpRoute("Route4", "api/{controller}/{action}/{login}/{password}");
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}