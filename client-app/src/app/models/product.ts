import { Unit } from "./unit"

export interface Product {
    name: string
    category: string
    quantity: number
    unitId: string
    unitAcronym: string
    description: string
    price: string
    deliveryPrice: string
    isDeleted: boolean
    id: string
    createdOn: Date | null
    modifiedOn: Date | null
    deletedOn: Date | null
    unitDto: Unit
}

export interface FormattedProduct extends Product {
    priceFormatted: string;
    deliveryPriceFormatted: string;
}

export interface UploadedProduct {
    id: string
    name: string
    category: string
    quantity: number
    unitId: string
    description: string
    price: string
    deliveryPrice: string
}