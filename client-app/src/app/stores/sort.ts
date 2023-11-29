import _ from 'lodash'

export default function exampleReducer(state, action:{type: string, column: string}) {
    switch (action.type) {
        case 'CHANGE_SORT':
            if (state.column === action.column) {
                return {
                    ...state,
                    data: state.data.slice().reverse(),
                    direction:
                        state.direction === 'ascending' ? 'descending' : 'ascending',
                }
            }

            return {
                column: action.column,
                data: _.sortBy(state.data, [action.column]),
                direction: 'ascending',
            }
        default:
            throw new Error()
    }
}