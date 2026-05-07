export interface IProduct {
    id: string;
    sizes: string[];
    name: string;
    brand: string;
    description: string;
    price: number;
    imgUrl: string[];

    descriptionFull: string
    material: string;
    careInstructions: string;
}