const initialState = { nombreReservations: 0 }

export function ReducerNombreReservations(state = initialState, action) {


    let nextState
    switch (action.type) {
        case "SetNombreReservations":
            nextState = { ...state, nombreReservations: action.value };
            return nextState || state;

        case "IncrementNombreReservations":
            nextState = { ...state, nombreReservations: state.nombreReservations + 1 };
            return nextState || state;

        case "DecrementNombreReservations":
            nextState = { ...state, nombreReservations: state.nombreReservations - 1 };
            return nextState || state;

        default:
            return state;
    }
}