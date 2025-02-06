import StorageController from "../storage/controller/storage.controller";

type ImageCache = {
    [key: string]: string;
};

class ImageCacheService {
    private static instance: ImageCacheService;
    private cache: ImageCache = {};

    private constructor() {}

    public static getInstance(): ImageCacheService {
        if (!ImageCacheService.instance) {
            ImageCacheService.instance = new ImageCacheService();
        }
        return ImageCacheService.instance;
    }

    private truncateForLog(str: string): string {
        return str.length > 50 ? str.substring(0, 50) + '...' : str;
    }

    public async getImage(productId: number, imagePath: string): Promise<string> {
        const cacheKey = `${productId}_${this.truncateForLog(imagePath)}`;
        
        // Check if image is in cache
        if (this.cache[cacheKey]) {
           
            return this.cache[cacheKey];
        }

        // If not in cache, download and store
        try {
            
            const imageData = await StorageController.download(imagePath);
            this.cache[cacheKey] = imageData;
            return imageData;
        } catch (error) {
            console.error('Error downloading image:', error);
            // Return empty string instead of throwing
            return "";
        }
    }

    public clearCache() {
        this.cache = {};
    }
}

export default ImageCacheService.getInstance(); 