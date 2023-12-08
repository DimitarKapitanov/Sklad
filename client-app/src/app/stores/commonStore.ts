import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";
import * as Yup from 'yup';

export default class CommonStore {
    error: ServerError | null = null;
    validationSchemaEdit = Yup.object({
        name: Yup.string().required('Името е задължително'),
        price: Yup.string()
            .required('Цената е задължителна')
            .test('is-decimal', 'Цената трябва да има число пред \' . \' след това от 1 до 4 цифри', function (value) {
                const isValidFormat = /^(\d{1,14})[.,](\d{1,4})$/.test(value || '');
                const isNumber = !isNaN(Number(value.replace(',', '.')));
                return isValidFormat && isNumber;
            })
            .test('is-greater-than-delivery-price', 'Цената трябва да е по-голяма от цената за доставка!', function (value) {
                const price = value;
                const deliveryPrice = this.parent.deliveryPrice;
                return Number(price.replace(',', '.')) > Number(deliveryPrice.replace(',', '.'));
            }),
        deliveryPrice: Yup.string()
            .required('Цената за доставка е задължителна')
            .test('is-decimal', 'Цената трябва да има число пред \' . \' след това от 1 до 4 цифри', function (value) {
                const isValidFormat = /^(\d{1,14})[.,](\d{1,4})$/.test(value || '');
                const isNumber = !isNaN(Number(value.replace(',', '.')));
                return isValidFormat && isNumber;
            })
            .test('is-greater-than-price', 'Цената за доставка трябва да е по-малка от цената!', function (value) {
                const price = this.parent.price;
                console.log(price);
                
                const deliveryPrice = value;
                return Number(deliveryPrice.replace(',', '.')) < Number(price.replace(',', '.'));
            }),
    })

    validationSchema = Yup.object({
        products: Yup.array().of(
            Yup.object({
                name: Yup.string().required('Името е задължително'),
                price: Yup.string()
                    .required('Цената е задължителна')
                    .test('is-decimal', 'Цената трябва да има число пред \' . \' след това от 1 до 4 цифри.', function (value) {
                        const isValidFormat = /^(\d{1,14})[.](\d{1,4})$/.test(value || '');
                        const isNumber = !isNaN(Number(value.replace(',', '.')));
                        return isValidFormat && isNumber;
                    })
                    .test('is-greater-than-delivery-price', 'Цената трябва да е по-голяма от цената за доставка!', function (value) {
                        const price = value;
                        const deliveryPrice = this.parent.deliveryPrice;
                        return Number(price.replace(',', '.')) > Number(deliveryPrice.replace(',', '.'));
                    }),
                deliveryPrice: Yup.string()
                    .required('Цената за доставка е задължителна')
                    .test('is-decimal', 'Цената трябва да има число пред \' . \' след това от 1 до 4 цифри.', function (value) {
                        const isValidFormat = /^(\d{1,14})[.](\d{1,4})$/.test(value || '');
                        const isNumber = !isNaN(Number(value.replace(',', '.')));
                        return isValidFormat && isNumber;
                    })
                    .test('is-greater-than-price', 'Цената за доставка трябва да е по-малка от цената!', function (value) {
                        const price = this.parent.price;
                        console.log(price);
                        
                        const deliveryPrice = value;
                        return Number(deliveryPrice.replace(',', '.')) < Number(price.replace(',', '.'));
                    }),
                unitAcronym: Yup.string().max(5, 'Мената единица трябва да е по малка от 5 символа').required('Мярката е задължителна'),
                quantity: Yup.number().min(1, 'Количеството трябва да е по голямо от 0').required('Количеството е задължително'),
                category: Yup.string().required('Категорията е задължителна'),
            }).required('Трябва да има поне един продукт'))
    });
    
    constructor() {
        makeAutoObservable(this);
    }

    serverError = (error: ServerError) => {
        this.error = error;
    }

    
}