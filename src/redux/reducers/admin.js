import { ADD_ALL_TURNI, ADD_ALL_UTENTI, ADD_ALL_UTENTI_TURNI } from "../actions";

const initialState = {
  allTurni: [{}],
  allDipendenti: [{}],
  allUtenteTurni: [{}],
};

export const adminReducer = (state = initialState, action) => {


  switch (action.type) {
    case ADD_ALL_TURNI:
        return{
            ...state,
            allTurni: action.payload
        }

    case ADD_ALL_UTENTI:
        return {
            ...state, 
            allDipendenti: action.payload
        }
    case ADD_ALL_UTENTI_TURNI:
        return {
            ...state,
            allUtenteTurni: action.payload
        }
    default: {
      return state;
    }
  }
}
