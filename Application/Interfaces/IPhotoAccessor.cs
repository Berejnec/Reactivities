using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResult?> AddPhoto(IFormFile file);
        Task<string?> DeletePhoto(string publicId);
        Task<Unit> SetMain(string publicId);
    }
}