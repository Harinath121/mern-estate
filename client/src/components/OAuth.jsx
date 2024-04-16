import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';


import {  useDispatch } from 'react-redux';
import { signInStart,signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const handleGoogleClick=async()=>{
    dispatch(signInStart());
    try{
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result=await signInWithPopup(auth,provider);
      //  console.log(result.user.displayName);
      // const {displayName,email,photoURL,phoneNumber} = result.user;

      const res = await fetch('api/auth/google',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:result.user.displayName,
          email:result.user.email,
          photo:result.user.photoURL,
          phonenumber:result.user.phoneNumber
        })
      })
      const data=await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate('/');





    }catch(error){
      console.log('could not sign in with google',error);
    }

  }
  return (
    <button type='button' className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-90" onClick={handleGoogleClick}>continue with google</button>
  )
}
