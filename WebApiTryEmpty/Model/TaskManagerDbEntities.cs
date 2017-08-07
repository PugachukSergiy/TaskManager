using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApiTryEmpty.Model
{
    public class User
    {
        public int UserId { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }

        public string Name { get; set; }

        public List<Task> Tasks { get; set; }
    }

    public class Task
    {
        [Key, Column(Order = 1)]
        public int UserId { get; set; }
        [Key, Column(Order = 2)]
        public int TaskId { get; set; }

        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime LustUpdate { get; set; }

        public List<Tag> Tasgs { get; set; }
    }

    public class Tag
    {
        public int TagId { get; set; }
        public string TagName {get; set; }
        public List<Task> Tasks { get; set; }
    }

    public class TaskManagerDbContext : DbContext
    {
        public TaskManagerDbContext(string connectionString) : base(connectionString)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Tag> Tags { get; set; }
    }
}