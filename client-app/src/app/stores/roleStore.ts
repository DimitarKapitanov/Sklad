import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/Agent";
import Role from "../models/role";

export default class RoleStore {
    roleRegistry = new Map<string, Role>();
    roleOptions: { key: string, text: string, value: string }[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    loadRoles = async () => {
        try {
            const roles = await agent.Roles.list();
            runInAction(() => {
                this.roleOptions = [];
                roles.forEach(role => {
                    this.setRole(role);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    createRole = async (role: string) => {
        try {
            await agent.Roles.create(role);
            runInAction(() => {
                this.loadRoles();
            });
        } catch (error) {
            console.log(error);
        }
    }

    private setRole = (role: Role) => {
        this.roleRegistry.set(role.id, role);
        this.roleOptions.push({ key: role.id, text: role.roleName, value: role.roleName });
    }
}