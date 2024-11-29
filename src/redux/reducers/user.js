import { ADD_USER, REMOVE_USER } from "../actions";


const initialState = {
    utente: {}

  };

export const userReducer = (state = initialState, action) =>{
    switch(action.type){
        case ADD_USER:
            return {
                utente: action.payload
            }

        case REMOVE_USER: 
            return {
                utente: action.payload
            }

        default: {
            return state
        }
    }

}