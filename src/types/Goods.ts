export type Goods = {
    id: string; 
    title: string;
    content: string; 
    imagePath: string; 
    userName: string; 
    email: string; 
    firstName: string; 
    lastName: string; 
    createdAt: string;
}

export type Merchandise = {
    id: string; 
    title: string; 
    memberId : string;
    mintId: string; 
    imagePath: string; 
    content: string;
    createAt: string;
}
