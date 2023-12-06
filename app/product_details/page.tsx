'use client'

import { useSearchParams } from "next/navigation";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts } from "@/app/components/getProducts";

export default function Info() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id'));
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(() => {
        getProducts().then(products => {
            let {name, category, currency, description, price} = products[id-1];
            setName(name);
            setCategory(category);
            setCurrency(currency);
            setDescription(description);
            setPrice(price);
        })
    }, [name, category, currency, description, price])

    return (
        <div className="p-4">
            <Card className="max-w-md mb-3">
                <CardBody>
                    <h1 className="text-2xl">{name}</h1>
                    <h2>Price: {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency == '' ? 'EUR' : currency
                    }).format(price)}</h2>
                    <h2>Category: {category}</h2>
                    <h2>{description}</h2>
                </CardBody>
            </Card>
            <Button variant="bordered" onClick={() => router.back()}>Back</Button>
        </div>
    )
}