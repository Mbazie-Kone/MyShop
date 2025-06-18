export interface ProductInputDto {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    productCode: string;
    sku: string;
    categoryId: number;
    images?: Image[];
    deletedImageIds?: number[];
}

export interface Image {
    id?: number;
    url: string;
    productId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    id: number;
    name: string;
}