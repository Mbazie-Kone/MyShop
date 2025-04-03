export interface Role {
    id: number;
    name: string;
}

export interface UserDto {
    id: number;
    username: string;
    roleName: string;
    createdAt: string;
}