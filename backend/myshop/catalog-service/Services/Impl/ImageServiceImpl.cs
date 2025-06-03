using catalog_service.Models;

namespace catalog_service.Services.Impl
{
    public class ImageServiceImpl : IImageService
    {
        public void DeleteImage(List<Image> images)
        {
            throw new NotImplementedException();
        }

        public Task<List<Image>> SaveImagesAsync(IFormFileCollection files, int productId)
        {
            throw new NotImplementedException();
        }
    }
}
