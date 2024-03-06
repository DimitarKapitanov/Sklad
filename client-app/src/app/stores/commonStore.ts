import { makeAutoObservable, reaction } from "mobx";
import * as Yup from "yup";
import { ServerError } from "../models/serverError";
import { store } from "./store";

export default class CommonStore {
  validationSchemaEdit = Yup.object({
    name: Yup.string().required('Името не може да бъде празно')
      .min(3, 'Името трябва да е поне 3 символа')
      .max(50, 'Името трябва да е по-малко от 50 символа')
      .matches(/^[^\s].*$/, 'Името не може да започва с празно място')
      .matches(/.*[^\s]$/, 'Името не може да завършва с празно място')
      .matches(/^[a-zA-Z0-9\s]*$|^[а-яА-Я0-9\s]*$/, 'Името може да съдържа само букви и цифри'),
    price: Yup.string()
      .required("Цената е задължителна")
      .test(
        "is-decimal",
        "Цената трябва да има число пред ' . ' след това от 1 до 4 цифри",
        function (value) {
          if (!value) return true;
          const isValidFormat = /^(\d{1,14})[.](\d{1,4})$/.test(value || "");
          const isNumber = !isNaN(Number(value.replace(",", ".")));
          return isValidFormat && isNumber;
        }
      )
      .test(
        "is-greater-than-delivery-price",
        "Цената трябва да е по-голяма от цената за доставка!",
        function (value) {
          if (!value) return true;
          const price = value;
          const deliveryPrice = this.parent.deliveryPrice;
          return (
            Number(price.replace(",", ".")) >
            Number(deliveryPrice.replace(",", "."))
          );
        }
      ),
    deliveryPrice: Yup.string()
      .required("Цената за доставка е задължителна")
      .test(
        "is-decimal",
        "Цената трябва да има число пред ' . ' след това от 1 до 4 цифри",
        function (value) {
          if (!value) return true;
          const isValidFormat = /^(\d{1,14})[.](\d{1,4})$/.test(value || "");
          const isNumber = !isNaN(Number(value.replace(",", ".")));
          return isValidFormat && isNumber;
        }
      )
      .test(
        "is-greater-than-price",
        "Цената за доставка трябва да е по-малка от цената!",
        function (value) {
          if (!value) return true;
          const price = this.parent.price;
          const deliveryPrice = value;
          return (
            Number(deliveryPrice.replace(",", ".")) <
            Number(price.replace(",", "."))
          );
        }
      ),
    description: Yup.string()
      .max(500, 'Описанието трябва да е по-малко от 500 символа')
      .matches(/^[^\s].*$/, 'Описанието не може да започва с празно място')
      .matches(/.*[^\s]$/, 'Описанието не може да завършва с празно място')
      .matches(/^[a-zA-Z0-9\s]*$|^[а-яА-Я0-9\s]*$/, 'Описанието може да съдържа само букви и цифри'),
  });

  validationSchema = Yup.object({
    // deliveryCompany: Yup.string().required("Изберете доставчик"),
    products: Yup.array().of(
      Yup.object({
        name: Yup.string()
          .required('Името не може да бъде празно')
          .min(3, 'Името трябва да е поне 3 символа')
          .max(50, 'Името трябва да е по-малко от 50 символа')
          .matches(/^[^\s].*$/, 'Името не може да започва с празно място')
          .matches(/.*[^\s]$/, 'Името не може да завършва с празно място')
          .matches(/^[a-zA-Z0-9\s]*$|^[а-яА-Я0-9\s]*$/, 'Името може да съдържа само букви и цифри'),
        price: Yup.string()
          .required("Цената е задължителна")
          .test(
            "is-decimal",
            "Цената трябва да има число пред ' . ' след това от 1 до 4 цифри.",
            function (value) {
              if (!value) return true;
              const isValidFormat = /^(\d{1,14})[.](\d{1,4})$/.test(
                value || ""
              );
              const isNumber = !isNaN(Number(value.replace(",", ".")));
              return isValidFormat && isNumber;
            }
          )
          .test(
            "is-greater-than-delivery-price",
            "Цената трябва да е по-голяма от цената за доставка!",
            function (value) {
              if (!value) return true;
              const price = value;
              const deliveryPrice = this.parent.deliveryPrice;
              if (deliveryPrice === undefined) return true;
              return (
                Number(price.replace(",", ".")) >
                Number(deliveryPrice.replace(",", "."))
              );
            }
          ),
        deliveryPrice: Yup.string()
          .required("Цената за доставка е задължителна")
          .test(
            "is-decimal",
            "Цената трябва да има число пред ' . ' след това от 1 до 4 цифри.",
            function (value) {
              if (!value) return true;
              const isValidFormat = /^(\d{1,14})[.](\d{1,4})$/.test(
                value || ""
              );
              const isNumber = !isNaN(Number(value.replace(",", ".")));
              return isValidFormat && isNumber;
            }
          )
          .test(
            "is-greater-than-price",
            "Цената за доставка трябва да е по-малка от цената!",
            function (value) {
              if (!value) return true;
              const price = this.parent.price;
              if (price === undefined) return true;
              const deliveryPrice = value;
              return (
                Number(deliveryPrice.replace(",", ".")) <
                Number(price.replace(",", "."))
              );
            }
          ),
        unitAcronym: Yup.string()
          .max(5, "Мерната единица трябва да е по малка от 5 символа")
          .required("Мярката е задължителна"),
        quantity: Yup.number()
          .typeError("Количеството трябва да е число")
          .min(1, "Количеството трябва да е по голямо от 0")
          .required("Количеството е задължително"),
        category: Yup.string().required("Категорията е задължителна"),
        description: Yup.string()
          .max(500, 'Описанието трябва да е по-малко от 500 символа')
          .matches(/^[^\s].*$/, 'Описанието не може да започва с празно място')
          .matches(/.*[^\s]$/, 'Описанието не може да завършва с празно място')
          .matches(/^[a-zA-Z0-9\s]*$|^[а-яА-Я0-9\s]*$/, 'Описанието може да съдържа само букви и цифри'),
      }).required("Трябва да има поне един продукт")
    ),
  });

  orderCreateValidationSchema = Yup.object().shape({
    partner: Yup.string().required('Изберете клиент'),
    warehouse: Yup.string().required('Изберете склад'),
    deliveryAddress: Yup.string().required('Изберете адрес за доставка'),
    product: Yup.object().shape({
      quantity: Yup.number()
        .min(1, "Количеството трябва да е по голямо от 1")
        .required("Количеството е задължително")
        .test('is-enough', 'Няма достатъчно количество', function (value) {
          const { id } = this.parent;
          if (id) {
            const product = store.orderStore.productRegistry.get(id);
            if (!product) {
              return true;
            }
            if (product.quantity < value) {
              return false;
            }
          }
          return true;
        }),
      price: Yup.number().required("Цената е задължителна"),
    }),
  });


  validationSchemaStatistics = Yup.object().shape({
    filter: Yup.string().required("Моля, изберете справка!"),
    startDate: Yup.date()
      .required("Моля, изберете начална дата!")
      .max(
        new Date(Date.now() - 7200000),
        "Началната дата не може да е в бъдещето!"
      ),
    endDate: Yup.date()
      .required("Моля, изберете крайна дата не по-голяма от днешната дата!")
      .min(
        Yup.ref("startDate"),
        "Крайната дата трябва да е по-голяма от началната дата!"
      )
      .max(
        new Date(Date.now() - 3600000),
        "Крайната дата не може да е в бъдещето!"
      ),
  });

  newPartnerValidationSchema = Yup.object().shape({
    createCompanyDto: Yup.object({
      name: Yup.string().required("Името на фирмата е задължително"),
      city: Yup.string().required("Градът е задължителен"),
      address: Yup.string().required("Адресът е задължителен"),
      bulstat: Yup.string().required("Булстатът е задължителен"),
      phone: Yup.string()
        .required("Телефонът е задължителен")
        .matches(
          /^(\+)?([ 0-9]){10,}$/,
          "Телефонният номер трябва да е валиден"
        ),
      email: Yup.string()
        .required("Имейлът е задължителен")
        .email("Трябва да въведете валиден имейл"),
      companyOwnerName: Yup.string().required(
        "Името на собственика е задължително"
      ),
    }).required("Трябва да има поне една фирма"),
    phone: Yup.string()
      .required("Телефонът е задължителен")
      .matches(/^(\+)?([ 0-9]){10,}$/, "Телефонният номер трябва да е валиден"),
    email: Yup.string()
      .required("Имейлът е задължителен")
      .email("Трябва да въведете валиден имейл"),
    deliveryAddress: Yup.object({
      city: Yup.string(),
      address: Yup.string()
    })
  });

  newWarehouseValidationSchema = Yup.object().shape({
    name: Yup.string().required("Името на склада е задължително"),
    contactPersonId: Yup.string().required("Изберете контактно лице"),
    description: Yup.string().required("Описанието е задължително"),
  });

  createUserValidationSchema = Yup.object({
    displayName: Yup.string().required("Името е задължително"),
    userName: Yup.string().matches(
      /^[a-zA-Z0-9]+$/,
      "Потребителското име трябва да се състои само от букви и цифри"
    ).required("Потребителското име е задължително"),
    email: Yup.string().required("Имейлът е задължителен").email("Въведете валиден имейл"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Паролата трябва да съдържа малка буква, главна буква и цифра"
      )
      .min(4, "Паролата трябва да е поне 4 символа")
      .max(8, "Паролата трябва да е не повече от 8 символа")
      .required("Паролата е задължителна"),
    phoneNumber: Yup.string()
      .required("Телефонът е задължителен")
      .matches(/^(\+)?([ 0-9]){10,}$/, "Телефонният номер трябва да е валиден"),
  });

  userEditValidationSchema = Yup.object({
    displayName: Yup.string().matches(
      /^[a-zA-Zа-яА-Я0-9\s]+$/,
      "Потребителското име трябва да се състои само от букви и цифри"
    ).required("Полето е задължително"),
    email: Yup.string().required("Имейлът е задължителен").email("Въведете валиден имейл"),
    phoneNumber: Yup.string()
      .required("Телефонът е задължителен")
      .matches(/^(\+)?([ 0-9]){10,}$/, "Телефонният номер трябва да е валиден"),
    role: Yup.string().required('Полето е задължително'),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Паролата трябва да съдържа малка буква, главна буква и цифра"
      )
      .min(4, "Паролата трябва да е поне 4 символа")
      .max(8, "Паролата трябва да е не повече от 8 символа")
      .nullable(),
    bio: Yup.string().matches(
      /^[a-zA-Zа-яА-Я0-9\s]+$/,
      "Биографията трябва да се състои само от букви и цифри"
    ).nullable()
  })

  error: ServerError | null = null;

  token: string | null = localStorage.getItem("jwt");
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.token,
      token => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );
  }

  serverError = (error: ServerError) => {
    this.error = error;
  };

  setToken = (token: string | null) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };


  dateString = (date: Date | null) => {
    if (date === null) return "";
    const dateToString = new Date(date);
    return dateToString.toLocaleString('bg-BG', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(',', '');
  }

}
