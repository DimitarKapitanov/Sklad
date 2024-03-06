using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RolesDto
    {
        public string Id { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Zа-яА-Я0-9_\-\s]*$", ErrorMessage = "Ролята съдържа невалидни символи.")]
        public string RoleName { get; set; }
    }
}