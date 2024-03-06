import { Unit } from "./unit"

export interface Product {
    name: string
    category: string
    quantity: number
    unitId: string
    unitAcronym: string
    description: string
    price: number
    deliveryPrice: number
    isDeleted: boolean
    id: string
    createdOn: Date | null
    modifiedOn: Date | null
    deletedOn: Date | null
    unitDto: Unit
}