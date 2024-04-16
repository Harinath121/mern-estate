import { createSlice, current } from "@reduxjs/toolkit";

//redux toolkit is used to build redux logic

const initialState={
    currentUser:null,
    error:null,
    loading:false
};

const userSlice=createSlice({
    name: 'user',
    initialState,
    reducers :{
        signInStart:(state)=>{
            state.loading=true;
            state.currentUser=null;
            
        },
        signInSuccess: (state,action) => {
            state.currentUser=action.payload; //in the currentUser variable whole object is stored so when we need atheuser details of particular state we need to use the currentUser variable only.
            state.error=null;
            state.loading=false;

        },
        signInFailure: (state,action) => {
            state.error=action.payload;
            state.loading=false;
        }
    },
});

 export const {signInFailure,signInStart,signInSuccess} = userSlice.actions;

 export default userSlice.reducer;