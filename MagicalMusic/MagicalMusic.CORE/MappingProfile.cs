using AutoMapper;
using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Creator, CreatorDTO>().ReverseMap();

        CreateMap<Song, SongDTO>()
                .ForMember(dest => dest.ArtistName, opt => opt.MapFrom(src => src.Creator != null ? src.Creator.Name ?? string.Empty : string.Empty))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
            .ReverseMap()
            .ForMember(dest => dest.Creator, opt => opt.Ignore()); // נעדכן את Creator דרך CreatorId, לא כאן

        CreateMap<UserDTO, User>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Name}")) // מיפוי מותאם
            .ReverseMap();
    }
}
