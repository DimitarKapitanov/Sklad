import { makeAutoObservable, runInAction } from "mobx";
import { Unit } from "../models/unit";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class UnitStore {

    unitRegistry = new Map<string, Unit>();
    selectedUnit: Unit | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    sortColumn: string | string = '';
    sortDirection: 'asc' | 'desc' | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get unitSort() {
        const units = Array.from(this.unitRegistry.values()).sort((a, b) => {
            return a.id.localeCompare(b.id);
        });
        console.log(units);

        return units;
    }

    loadUnits = async () => {
        this.setLoadingInitial(true);
        try {
            const units = await agent.Units.unitList();
            runInAction(() => {
                units.forEach(unit => {
                    this.setUnit(unit)
                })
                this.loadingInitial = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }

    private getUnits = (id: string) => {
        return this.unitRegistry.get(id);
    }

    private setUnit = (unit: Unit) => {
        this.unitRegistry.set(unit.id, unit);
    }

    loadUnit = async (id: string) => {
        let unit = this.getUnits(id);
        if (unit) {
            this.selectedUnit = unit;
            return unit;
        }
        else {
            this.setLoadingInitial(true);
            try {
                unit = await agent.Units.details(id);
                this.setUnit(unit);
                runInAction(() => this.selectedUnit = unit);
                this.setLoadingInitial(false);
                return unit;
            }
            catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createUnit = async (unit: Unit) => {
        this.loading = true;
        try {
            console.log(unit);
            
            await agent.Units.create(unit);
            runInAction(() => {
                this.unitRegistry.set(unit.id, unit);
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateUnit = async (unit: Unit) => {
        this.loading = true;
        try {
            unit.id = uuid();
            await agent.Units.edit(unit);
            runInAction(() => {
                this.unitRegistry.set(unit.id, unit);
                this.selectedUnit = unit;
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteUnit = async (id: string) => {
        this.loading = true;
        try {
            await agent.Units.delete(id);
            runInAction(() => {
                this.unitRegistry.delete(id);
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}