import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/Agent";
import { Category } from "../models/category";

export default class CategoryStore {
    categoryRegistry = new Map<string, Category>();

    constructor() {
        makeAutoObservable(this);
    }

    get categories() {
        const categories = Array.from(this.categoryRegistry.values());
        console.log(categories);

        return categories;
    }

    get categoryOptions() {
        return this.categories.map(category => ({
            key: category.id,
            text: category.name,
            value: category.id
        }));
    }

    loadCategories = async () => {
        try {
            const categories = await agent.Categories.list();
            runInAction(() => {
                categories.forEach(category => {
                    this.categoryRegistry.set(category.id, category);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

}