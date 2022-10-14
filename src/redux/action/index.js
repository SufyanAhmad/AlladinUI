//For add item to cart
export const addCart = (product) => {
    return{
        type : "ADDITEM",
        payload : product
    }
}

//For delete item from cart
export const delCart = (product) => {
    return{
        type : "DELITEM",
        payload : product
    }
}

export const cartQuantityRefresh = (value) => {
    return{
        type : "CARTQUANTITYREFRESH",
        payload: value
    }
}