const showCart = (state = [], action)=>{
    switch(action.type){
        case 'SHOW_ITEMS':
            return[...state,action.payload]
        case 'REMOVE_ITEMS':

    }
    return state
}
export default showCart;