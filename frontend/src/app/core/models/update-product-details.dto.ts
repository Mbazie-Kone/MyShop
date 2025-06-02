export interface UpdateProductDetailsDto {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    categoryId: number;
    imageUrls: string[];
}