using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Паролата трябва да съдържа малка буква, главна буква и цифра")]
        public string Password { get; set; }

        [Required]
        public string DisplayName { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Role { get; set; }

        public string Bio { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }
}