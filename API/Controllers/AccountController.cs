using System.Security.Claims;
using API.DTOs;
using API.Services;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AccountController(
            UserManager<AppUser> userManager,
            TokenService tokenService,
            RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized();

            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles == null) return Unauthorized();

            await SetRefreshToken(user);
            return CreateUserObject(user, userRoles);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return Unauthorized();
            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles == null) return Unauthorized();

            await SetRefreshToken(user);
            return CreateUserObject(user, userRoles);
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost("create-user")]
        public async Task<ActionResult> CreateUser(CreateUserDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Потребителското име е заето");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Емайл адресът е зает");
                return ValidationProblem();
            }

            if (!await _roleManager.RoleExistsAsync(registerDto.Role))
            {
                ModelState.AddModelError("role", "Ролята не съществува");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                PhoneNumber = registerDto.PhoneNumber.Trim(),
                DisplayName = registerDto.DisplayName.Trim(),
                Email = registerDto.Email.Trim(),
                UserName = registerDto.UserName.Trim(),
                Bio = registerDto.Bio.Trim()
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, registerDto.Role.Trim());
                await SetRefreshToken(user);
                return BadRequest(result.Errors);
            }

            return BadRequest("Неуспешно създаване на потребител");
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost("edit-user")]
        public async Task<ActionResult> EditUser(EditUserDto editUserDto)
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (user == null) return Unauthorized();

            var userUpdate = await _userManager.FindByNameAsync(editUserDto.UserName.Trim());
            if (userUpdate == null) return NotFound();

            if (editUserDto.UserName.Trim() != userUpdate.UserName)
            {
                return BadRequest(error: "Не може да се променя потребителското име");
            }

            if (editUserDto.Email.Trim() != userUpdate.Email)
            {
                if (await _userManager.Users.AnyAsync(x => x.Email == editUserDto.Email.Trim()))
                {
                    ModelState.AddModelError("email", "Емайл адресът е зает");
                    return ValidationProblem();
                }
                userUpdate.Email = editUserDto.Email.Trim();
            }

            if (editUserDto.Password != null)
            {
                var passwordUpdateResult = await UpdatePassword(userUpdate, editUserDto.Password.Trim());
                if (!passwordUpdateResult.Succeeded) return BadRequest(passwordUpdateResult.Errors);
            }

            userUpdate.PhoneNumber = editUserDto.PhoneNumber.Trim();
            userUpdate.Bio = editUserDto.Bio.Trim();
            userUpdate.DisplayName = editUserDto.DisplayName.Trim();

            var roleUpdateResult = await UpdateRole(userUpdate, editUserDto.Role.Trim());
            if (!roleUpdateResult.Succeeded) return BadRequest(roleUpdateResult.Errors);

            var result = await _userManager.UpdateAsync(userUpdate);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await SetRefreshToken(user);
            return Ok();
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpGet("all-users")]
        public async Task<ActionResult<List<GetUserDto>>> GetAllUsers()
        {
            var users = await _userManager.Users.Include(p => p.Photos).ToListAsync();
            var userDtos = new List<GetUserDto>();
            foreach (var user in users)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if (userRoles == null) continue;
                var userDto = new GetUserDto
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                    UserName = user.UserName,
                    Role = userRoles[0],
                    PhoneNumber = user.PhoneNumber,
                    Bio = user.Bio
                };
                userDtos.Add(userDto);
            }
            return userDtos;
        }

        [Authorize(Roles = "Admin]")]
        [HttpPost("create-role")]
        public async Task<ActionResult<RolesDto>> CreateUserRole(RolesDto createUserRoleDto)
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return Unauthorized();

            if (await _roleManager.RoleExistsAsync(createUserRoleDto.RoleName))
            {
                ModelState.AddModelError("role", "Ролята вече съществува");
                return ValidationProblem();
            }

            var role = new IdentityRole
            {
                Name = createUserRoleDto.RoleName
            };

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded) return BadRequest(result.Errors);
            await SetRefreshToken(user);
            return GetRolesDto(role);
        }


        [Authorize(Roles = "Admin, Manager")]
        [HttpGet("roles")]
        public async Task<ActionResult<List<RolesDto>>> GetRoles()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return Unauthorized();

            var roles = await _roleManager.Roles.Where(x => x.Name != "Admin").ToListAsync();
            var roleNames = new List<RolesDto>();

            foreach (var role in roles)
            {
                var roleName = new RolesDto
                {
                    Id = role.Id,
                    RoleName = role.Name
                };
                roleNames.Add(roleName);
            }
            return roleNames;
        }

        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            var user = await _userManager.Users
            .Include(r => r.RefreshTokens)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            var userRoles = await _userManager.GetRolesAsync(user);
            return CreateUserObject(user, userRoles);
        }
        private UserDto CreateUserObject(AppUser user, IList<string> userRoles = null)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user, userRoles),
                UserName = user.UserName,
                Role = userRoles[0],
                PhoneNumber = user.PhoneNumber,
                Bio = user.Bio,
                Email = user.Email
            };
        }

        private static RolesDto GetRolesDto(IdentityRole role)
        {
            return new RolesDto
            {
                Id = role.Id,
                RoleName = role.Name
            };
        }

        private async Task<IdentityResult> UpdatePassword(AppUser user, string newPassword)
        {
            var passwordValidator = new PasswordValidator<AppUser>();
            var passwordValidationResult = await passwordValidator.ValidateAsync(_userManager, user, newPassword);
            if (!passwordValidationResult.Succeeded) return passwordValidationResult;

            var removePasswordResult = await _userManager.RemovePasswordAsync(user);
            if (!removePasswordResult.Succeeded) return removePasswordResult;

            return await _userManager.AddPasswordAsync(user, newPassword);
        }

        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.None,
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        private async Task<IdentityResult> UpdateRole(AppUser user, string newRole)
        {
            if (newRole != (await _userManager.GetRolesAsync(user))[0])
            {
                if (!await _roleManager.RoleExistsAsync(newRole))
                {
                    ModelState.AddModelError("role", "Ролята не съществува");
                    return IdentityResult.Failed(new IdentityError { Description = "Ролята не съществува" });
                }
                var userRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRoleAsync(user, userRoles[0]);
                return await _userManager.AddToRoleAsync(user, newRole);
            }
            return IdentityResult.Success;
        }
    }
}