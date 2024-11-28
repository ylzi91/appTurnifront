import { SET_DRAGGED_EVENT } from "../actions"


const initialState = {
    dragEvent: null
}

export const draggedEventReducers = (state = initialState, action) => {
    switch(action.type){
        case SET_DRAGGED_EVENT: {
            return {
                dragEvent: action.payload
            }
        }

        default: return state
    }
    
}