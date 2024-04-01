import { makeAutoObservable, runInAction } from "mobx";
import { redirect } from "react-router-dom";
import agent from "../api/Agent";
import { router } from "../api/router/Routes";
import { NewUserFormValues, User, UserFormValues, UserInfo } from "../models/user";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;
    refreshTokenTimeout?: number;

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
        this.startRefreshTokenTimer(user);
        runInAction(() => this.user = user);
        store.modalStore.closeModal();
        redirect('/products');
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            if (!store.commonStore.token) return null;
            const user = await agent.Account.getCurrentUser();
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
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
        this.loadingUsers = true;
        try {
            await agent.Account.createUser(user);
            runInAction(() => {
                this.loadUsers();
                this.loadingUsers = false;
                store.modalStore.closeModal();
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingUsers = false);
        }
    }

    get getUsers() {
        return Array.from(this.userRegistry.values());
    }

    updateUser = async (user: UserFormValues) => {
        this.loadingUsers = true;
        try {
            await agent.Account.editUser(user);
            runInAction(() => {
                this.userRegistry.set(user.id!, user as UserInfo);
                this.loadingUsers = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingUsers = false;
            });
        }
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

    refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer = (user: User) => {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (30 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer = () => {
        clearTimeout(this.refreshTokenTimeout);
    }
}
