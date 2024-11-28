
export const ADD_ALL_TURNI = 'ADD_ALL_TURNI'

export const ADD_TOKEN = 'ADD_TOKEN'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

export const ADD_ALL_UTENTI = 'ADD_ALL_UTENTI'

export const ADD_ALL_UTENTI_TURNI = 'ADD_ALL_UTENTI_TURNI'

export const SET_DRAGGED_EVENT = 'SET_DRAGGED_EVENT'

export const addAllTurniAction = (allTurni) => {
    return {
        type: ADD_ALL_TURNI,
        payload: allTurni
    }
}

export const setDraggedEvent = (turno) => {
    return {
        type: SET_DRAGGED_EVENT,
        payload: turno
    }
}

export const addAllUtentiAction = (allUtenti) => {
    return {
        type: ADD_ALL_UTENTI,
        payload: allUtenti
    }
}
export const addAllUtentTurniAction = (allUtenteTurni) => {
    return {
        type: ADD_ALL_UTENTI_TURNI,
        payload: allUtenteTurni
    }
}

export const addTokenAction = (token) => {
    return{
        type: ADD_TOKEN,
        payload: token
    }
}
export const removeTokenAction = () => {
    return {
        type: REMOVE_TOKEN,
        payload: null
    }
} 