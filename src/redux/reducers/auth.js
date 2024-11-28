import { ADD_TOKEN, REMOVE_TOKEN } from "../actions"

const initialState = {
    token: ""
}

export const authReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_TOKEN:  
        return{
            token: action.payload
        }
        case REMOVE_TOKEN:
        return{
            token: action.payload
        }
        
        default:
            return state
    }
}