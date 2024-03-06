import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/Agent";
import { router } from "../api/router/Routes";
import { NewUserFormValues, User, UserFormValues, UserInfo } from "../models/user";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;

    userRegistry = new Map<string, UserInfo>();
    usersOptions: { key: string, text: string, value: string }[] = [];
    loadingUsers = false;

    search: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    private setUserRegistry = (users: UserInfo) => {
        this.userRegistry.set(users.id, users);
    }

    login = async (creds: UserFormValues) => {
        const user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        store.modalStore.closeModal();
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.getCurrentUser();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }

    loadUsers = async () => {
        this.setLoadingUsers(true);
        this.userRegistry.clear();
        try {
            const users = await agent.Account.userList();
            runInAction(() => {
                users.forEach(user => {
                    this.setUserRegistry(user);
                    this.usersOptions.push({
                        key: user.id,
                        text: user.displayName,
                        value: user.id
                    });
                })
            });
            this.setLoadingUsers(false);
        } catch (error) {
            console.log(error);
            this.setLoadingUsers(false);
        }
    }

    createUser = async (user: NewUserFormValues) => {
        try {
            await agent.Account.createUser(user);
            runInAction(() => {
                this.loadUsers();
                store.modalStore.closeModal();
            });
        } catch (error) {
            console.log(error);
        }
    }

    get getUsers() {
        return Array.from(this.userRegistry.values()).filter(user =>
            user.displayName?.toLowerCase().includes(this.search.toLowerCase().trim()) ||
            user.email?.toLowerCase().includes(this.search.toLowerCase().trim()) ||
            user.phoneNumber?.toLowerCase().includes(this.search.toLowerCase().trim()) ||
            user.userName?.toLowerCase().includes(this.search.toLowerCase().trim()) ||
            user.bio?.toLowerCase().includes(this.search.toLowerCase().trim()
            ));
    }

    setLoadingUsers = (state: boolean) => {
        this.loadingUsers = state;
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }

    setSearch = (search: string) => {
        this.search = search;
    }
}
