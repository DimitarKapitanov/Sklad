import { Unit } from "./unit"

export interface Product {
    name: string
    category: string
    quantity: number
    unitId: string
    unit: Unit
    description: string
    price: number
    deliveryPrice: number
    isDeleted: boolean
    deletedOn: string
    id: string
    createdOn: string
    modifiedOn: string
}