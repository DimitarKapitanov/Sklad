import { observable } from 'mobx';
import { Product } from '../models/product';
// exampleReducer.ts
import _ from 'lodash';

interface State {
    column: string | null;
    data: Product[]; // Adjust the type according to your actual data structure
    direction: 'ascending' | 'descending' | null;
}

interface Action {
    type: string;
    column: string;
}

const exampleReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'CHANGE_SORT':
            if (state.column === action.column) {
                return {
                    ...state,
                    data: [...state.data].reverse(),
                    direction: state.direction === 'ascending' ? 'descending' : 'ascending',
                };
            }

            return {
                column: action.column,
                data: _.sortBy(state.data, [action.column]),
                direction: 'ascending',
            };
        default:
            throw new Error();
    }
};

export default observable(exampleReducer);
