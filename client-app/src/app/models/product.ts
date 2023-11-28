export interface Product {
    name: string
    category: string
    quantity: number
    unitId: string
    unitName: string
    unitAcronym: string
    description: string
    price: number
    deliveryPrice: number
    isDeleted: boolean
    id: string
    createdOn: Date | null
    modifiedOn: Date | null
    deletedOn: Date | null
}