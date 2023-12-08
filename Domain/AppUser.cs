using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DislpayName { get; set; }
        public string Bio { get; set; }
    }
}