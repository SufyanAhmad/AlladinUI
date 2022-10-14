import { loginFailure, loginStart, loginSuccess } from "../redux/userRedux";
import { publicRequest } from "../requestMethod";

export const login = async (dispatch, user, setInvalidLogin) => {
  
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("Authenticate/login", user);
    dispatch(loginSuccess(res.data));
    window.location.reload();
    localStorage.setItem("token",res.data.token)
  } catch (err) {
    dispatch(loginFailure());
    setInvalidLogin(true);
  }
 
};
export function logout(){
  return dispatch =>{
    localStorage.removeItem('token');
  }
}