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
            state.error=null;
            
        },
        signInSuccess: (state,action) => {
            state.currentUser=action.payload; //in the currentUser variable whole object is stored so when we need atheuser details of particular state we need to use the currentUser variable only.
            state.error=null;
            state.loading=false;

        },
        signInFailure: (state,action) => {
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart:(state)=>{
            state.loading=true;

        },
        updateUserSuccess : (state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFailure :(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
        },
        deleteUserSuccess:(state)=>{
            state.loading=false;
            state.currentUser=null;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;  
        },
        signoutUserStart:(state)=>{
            state.loading=true;
        },
        signoutUserSuccess:(state)=>{
            state.loading=false;
            state.currentUser=null;
            state.error=null;
        },
        signoutUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;  
        },
    },
});

 export const {signInFailure,signInStart,signInSuccess,updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutUserFailure,signoutUserStart,signoutUserSuccess} = userSlice.actions;

 export default userSlice.reducer;