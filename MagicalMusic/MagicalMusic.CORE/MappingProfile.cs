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
      .ForMember(dest => dest.CreatorId, opt => opt.MapFrom(src => src.CreatorId)) // ← זה מה שחסר
      .ReverseMap()
      .ForMember(dest => dest.Creator, opt => opt.Ignore()) // כי נטען לפי CreatorId
      .ForMember(dest => dest.CreatorId, opt => opt.MapFrom(src => src.CreatorId)); // ← גם פה חשוב להוסיף


        CreateMap<UserDTO, User>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Name}")) // מיפוי מותאם
            .ReverseMap();
        CreateMap<TranscriptionResponse, TranscriptionResultDto>()
            .ForMember(dest => dest.FileName, opt => opt.Ignore()) // כי ב-Response אין FileName
            .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Text));

        CreateMap<TranscriptionResultDto, TranscriptionResponse>()
            .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Text));

    }
}
