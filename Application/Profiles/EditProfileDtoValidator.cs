using Application.DTOs.ProfileDTOs;
using FluentValidation;

namespace Application.Profiles
{
    public class EditProfileDtoValidator : AbstractValidator<EditProfileDto>
    {
        public EditProfileDtoValidator()
        {
            RuleFor(x => x.Username).NotEmpty().Matches(@"^[a-zA-Z0-9]*$").WithMessage("Потребителското име съдържа невалидни символи.");
            RuleFor(x => x.DisplayName).NotEmpty().Matches(@"^[a-zA-Zа-яА-Я\s]*$").WithMessage("Името съдържа невалидни символи.");
            RuleFor(x => x.Bio).Matches(@"^[a-zA-Zа-яА-Я0-9_\-\s]*$").WithMessage("Биографията съдържа невалидни символи.");
            RuleFor(x => x.Password)
            .MinimumLength(6)
            .Matches(@"[A-Z]").WithMessage("Невалидна парола! Паролата трябва да съдържа поне една главна буква.")
            .Matches(@"[a-z]").WithMessage("Невалидна парола! Паролата трябва да съдържа поне една малка буква.")
            .Matches(@"[0-9]").WithMessage("Невалидна парола! Паролата трябва да съдържа поне една цифра.")
            .Matches(@"[^a-zA-Z0-9]").WithMessage("Невалидна парола! Паролата трябва да съдържа поне един символ, който не е буква или цифра."); ;
            RuleFor(x => x.Role).NotEmpty().Matches(@"^[a-zA-Zа-яА-Я0-9_\-\s]*$").WithMessage("Ролята съдържа невалидни символи.");
            RuleFor(x => x.PhoneNumber).NotEmpty().Matches(@"^(\+[1-9][\d]*|00[1-9][\d]*|0[1-9][\d]*)$").WithMessage("Невалиден телефонен номер!");
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Невалиден имейл адрес.");

        }
    }
}