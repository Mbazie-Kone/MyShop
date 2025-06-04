using catalog_service.Models;

namespace catalog_service.Services.Impl
{
    public class ImageServiceImpl : IImageService
    {
        private readonly string _folderPath;
        private readonly string[] _allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };

        public ImageServiceImpl(IWebHostEnvironment env)
        {
            _folderPath = Path.Combine(env.ContentRootPath, "public", "products");

            if (!Directory.Exists(_folderPath))
                Directory.CreateDirectory(_folderPath);
        }

        public async Task<List<Image>> SaveImagesAsync(IEnumerable<IFormFile> files, int productId)
        {
            var images = new List<Image>();

            foreach (var file in files.Take(10))
            {
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(ext))
                    throw new InvalidOperationException($"Unsupported format: {ext}");

                var fileName = Guid.NewGuid() + ext;
                var path = Path.Combine(_folderPath, fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await file.CopyToAsync(stream);

                images.Add(new Image
                {
                    Url = $"assets/products/{fileName}",
                    ProductId = productId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }

            return images;
        }

        public Task DeleteImage(IEnumerable<Image> images)
        {
            foreach (var image in images)
            {
                var fullPath = Path.Combine(_folderPath, Path.GetFileName(image.Url));
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                } 
            }

            return Task.CompletedTask;
        }  
    }
}
