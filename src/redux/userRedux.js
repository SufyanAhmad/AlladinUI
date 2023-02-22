import { createSlice } from "@reduxjs/toolkit";
import { setAppRefresher } from "../App";
var hours = 1; 
var now = new Date().getTime();
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout:(state)=>{
      state.currentUser= null
      localStorage.removeItem('token')
      if (state.currentUser == null) {
        localStorage.removeItem('token')
    } else {
        if(now-state.currentUser > hours*60*60*1000) {
            window.localStorage.clear();
            this.router.navigate('/login'); 
        }
    }
  }
  },
});

export const { loginStart, loginSuccess, loginFailure,logout } = userSlice.actions;
export default userSlice.reducer;