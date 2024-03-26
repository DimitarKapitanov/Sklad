using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$", ErrorMessage = "Паролата трябва да съдържа малка буква, главна буква и цифра")]
        public string Password { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Потребителското име съдържа невалидни символи.")]
        public string UserName { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Zа-яА-Я\\s]*$", ErrorMessage = "Името съдържа невалидни символи.")]
        public string DisplayName { get; set; }

        [RegularExpression("^[\\w\\s.,!?а-яА-Я]*$", ErrorMessage = "Биографията съдържа невалидни символи.")]
        public string Bio { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Zа-яА-Я0-9_\\-\\s]*$", ErrorMessage = "Ролята съдържа невалидни символи.")]
        public string Role { get; set; }

        [Required]
        [RegularExpression("^(\\+[1-9][\\d]*|00[1-9][\\d]*|0[1-9][\\d]*)$", ErrorMessage = "Невалиден телефонен номер!")]
        public string PhoneNumber { get; set; }
    }
}