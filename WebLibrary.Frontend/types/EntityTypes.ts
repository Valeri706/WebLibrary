export type TypeAuthor = {
    id: number;
    name: string,
    biography?: string,
    birthDate?: string,
    deathDate?: string,
}

export type TypeCategory = {
    id: number;
    name: string,
    description: string
}

export type TypeBook = {
    id: number;
    title: string,
    summary: string,
    publishedDate: string,
    coverImageUrl?: string,
    authorId: number,
    categoryId?: number
}

export type TypeUser = {
    id: number;
    email: string;
    name: string,
    registeredAt: string,
    role: number,
    birth?: string,
}