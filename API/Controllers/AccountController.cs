using System.Security.Claims;
using API.DTOs;
using API.Services;
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
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService, RoleManager<IdentityRole> roleManager, ILogger<AccountController> logger)
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
                PhoneNumber = registerDto.PhoneNumber,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName,
                Bio = registerDto.Bio
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, registerDto.Role);

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

            return GetRolesDto(role);
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpGet("roles")]
        public async Task<ActionResult<List<RolesDto>>> GetRoles()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return Unauthorized();

            var roles = await _roleManager.Roles.ToListAsync();
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
    }
}