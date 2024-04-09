import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from 'uuid';
import agent from "../api/Agent";
import { Category } from "../models/category";
export default class CategoryStore {
    categoryRegistry = new Map<string, Category>();
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get categories() {
        const categories = Array.from(this.categoryRegistry.values());
        return categories;
    }

    get categoryOptions() {
        return this.categories.map(category => ({
            key: category.id,
            text: category.name,
            value: category.name
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

    createCategory = async (category: Category) => {
        this.loading = true;
        try {
            category.id = uuid();
            await agent.Categories.create(category);
            runInAction(() => {
                this.categoryRegistry.set(category.id, category);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}