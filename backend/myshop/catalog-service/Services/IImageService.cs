using catalog_service.Models;

namespace catalog_service.Services
{
    public interface IImageService
    {
        Task<List<Image>> SaveImagesAsync(IEnumerable<IFormFile> files, int productId);
        void DeleteImage(List<Image> images);
    }
}
