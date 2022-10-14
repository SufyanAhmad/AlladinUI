const initialValue = true;
const cartQuantityReducer = (state = initialValue,action) =>
{
    switch(action.type)
    {
        case "CARTQUANTITYREFRESH":
            return  action.payload
        default:
            return state
    }
}
export default cartQuantityReducer