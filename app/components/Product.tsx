export interface Product {
    id : number,
    name : string,
    price : number,
    currency : string,
    category : string,
    description : string
}

export async function getProducts() : Promise<Product[]> {
    const res = await fetch("https://run.mocky.io/v3/b54fe93f-f5a1-426b-a76c-e43d246901fd");
    const data : {products : Array<Product>} = await res.json();
    return data.products
}