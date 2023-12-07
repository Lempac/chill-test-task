'use client'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, toIterator } from "@nextui-org/react";
import Link from "next/link";
import React, { Key, useEffect, useState } from "react";
import {Card, CardBody} from "@nextui-org/card";
import { createRoot } from "react-dom/client";
import { getProducts, Product } from "./components/Product";

export default function Home() {
  const [ProductCategories, setProductCategories] = useState(new Array<{key: string, label: string}>);
  const [Products, setProducts] = useState(new Array<Product>);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductCategory, setProductCategory] = useState(0);
  
  useEffect(() => {
    getProducts()
    .then(products => {
      setProducts(products);
      return new Set(products.map(product => product.category)).add("All");
    })
    .then(products_categories => {
      let data : {key: string, label: string}[] = [];
      products_categories.forEach(category => {
        data.push({
          key: category,
          label: category
        })
      })
      setProductCategories(data);
      setProductCategory(ProductCategories.length-1);
    })
  }, []);
  
  const selectedValue = React.useMemo(
    () => {
      if (ProductCategories[selectedProductCategory] == undefined) setProductCategory(ProductCategories.length-1);
      return ProductCategories[selectedProductCategory]?.key
    },
    [selectedProductCategory, ProductCategories, Products]
  );
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      Update(selectedValue, searchTerm, Products)
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <div className="p-6">
      <h1 className="text-4xl">Products</h1>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4 mt-2 items-center">
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="bordered" 
            >
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            selectionMode="single"
            selectedKeys={toIterator(ProductCategories)}
            disallowEmptySelection
            onSelectionChange={keys => {
              let value = (keys as Set<Key>).values().next().value
              setProductCategory(ProductCategories.map(category => category.key).indexOf(value))
              Update(value, searchTerm, Products);
            }}
            items={ProductCategories}
          >
            { 
              category => {
                return <DropdownItem key={category.key}>{category.label}</DropdownItem>
              }
            }
          </DropdownMenu>
        </Dropdown>
        <Input type="search" label="Search" onChange={e => setSearchTerm(e.target.value)} className="max-w-xs"/>
      </div>
      <div className="grid gap-2" id="products">
        {
          Array.from(Products).map(product => {
            return <Product key={product.id} product={product}></Product>
          })
        }
      </div>
    </div>
  )
}

async function Update(category = "All", searchTerm: string = '', selectedProduct : Array<Product>) {
  const node_products = document.getElementById('products')!;
  let products = await FilterCategory(category, selectedProduct);
  products = Search(searchTerm, products);
  const root = createRoot(node_products);
  root.render(products.map(product => {
    return <Product key={product.id} product={product}></Product>
  }))
}

function MatchProduct(Product : Product, Search : string){
  let regSearch = RegExp(Search, 'ig')
  return (Product.name.match(regSearch) || []).length + (Product.category.match(regSearch) || []).length + (Product.price.toString().match(regSearch) || []).length;
}

function Search(searchTerm: string, selectedProduct : Array<Product>) {
  if (searchTerm == '') return selectedProduct;
  let sorted_products = selectedProduct.sort((p1, p2) => MatchProduct(p2, searchTerm) - MatchProduct(p1, searchTerm));
  return sorted_products.filter(product => MatchProduct(product, searchTerm) > 0);
}

async function FilterCategory(category: string, products : Array<Product>){
  return category == "All" ? await getProducts() : products.filter(product => product.category == category);
}

function Product({product}: any) {
  const { name, price, category, currency, id } = product as Product || {};

  return (
    <Card className="max-w-sm transition ease-in-out delay-150 hover:scale-110 duration-300">
      <CardBody>
        <Link 
          href={{
          pathname: "/product_details",
          query: {
            id: id
          }
        }}
        >
          <div>
            <h1 className="text-xl">{name}</h1>
            <div>
              <p>Price: {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(price)}</p>
              <p>Category: {category}</p>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
    
  )
}
