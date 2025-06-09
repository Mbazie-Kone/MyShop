export interface UpdateProductDetailsDto {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    productCode: string;
    sku: string;
    categoryId: number;
    imageUrls: string[];
}