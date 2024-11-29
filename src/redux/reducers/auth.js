import { ADD_ROLE, ADD_TOKEN, REMOVE_ROLE, REMOVE_TOKEN } from "../actions"

const initialState = {
    token: "",
    role: ""
}

export const authReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_TOKEN:  
        return{
            ...state,
            token: action.payload
        }
        case REMOVE_TOKEN:
        return{
            ...state,
            token: action.payload
        }
        case ADD_ROLE: 
        return {
            ...state,
            role: action.payload
        }
        case REMOVE_ROLE:
        return {
            ...state,
            role: action.payload
        }
        
        default:
            return state
    }
}