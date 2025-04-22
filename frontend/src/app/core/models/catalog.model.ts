export interface Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    categoryId: number;
    createdAt?: Date;
    updatedAt?: Date;
    images?: Image[];
}

export interface Image {
    id?: number;
    url: string;
    productId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {

}