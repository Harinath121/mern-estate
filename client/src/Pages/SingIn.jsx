
import React,{ useState } from 'react';
import {Link , useNavigate} from  'react-router-dom';
import {  useDispatch, useSelector } from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {

const [formData,setFormData] = useState({});

 //const [loading,setLoading] = useState(false);
// as we declared these varailbles as global in redux function i.e, userSlice and we created a Slice and named as user we just need to import and destructure it
const {error,loading}=useSelector((state)=>state.user);

const navigate=useNavigate();
const dispatch =useDispatch();


  const handleChange=(e)=>{
    setFormData({
      ...formData,    // this helps to already entered Data i.e, username is entered now eamil is typring the this will help on keep username saved already in the freild
      [e.target.id]:e.target.value, //key : value
    })
  }
  console.log(formData);


  const handleSubmit=async (e)=>{
    e.preventDefault(); // this prevents to reload the page when submit is clicked, it simply performs the assigned opertaion without actuallyt refreshing the whole page.
    
    
    //Instead of using set loading below line we call redux function to store the state globally using userSlice function
    
    dispatch(signInStart());





    try{ // this try is to handle the frontend error.

    //setLoading(true);
    dispatch(signInStart());
    //check vite.config.js abouth the path in fetch
    //const res= await fetch('/api/auth/signup',formData); instead of directly passing the data we send it as stringformat and some aother parameters with that

    const res = await fetch('/api/auth/signin',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json',

      },
      body: JSON.stringify(formData),
      
    });
    const data =await res.json();
    console.log(data);
    if(data.success===false){

      //Instead of writing this we use signInFailure which we defined in userSlice.js whic is reducer so that we store the state globally
      //  setLoading(false);
      //  setError(data.message);
      dispatch(signInFailure(data.message));
       return;
    }


    //If the signin is successfull the we go for signINSuccess reducer which we defined in userSlice.js 
    // setLoading(false);
    // setError(null);

    dispatch(signInSuccess(data));

    
    navigate('/');
    }catch(error){
      //  setLoading(false);
        //setError(error.message);
      // Instewad of writing error for signin we use signInFailure

      dispatch(signInFailure(error.message));


    }
     
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        
        
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-green-900 p-3 border rounded-lg text-white font-bold uppercase hover:opacity-75 disabled:opacity-65'>
          {loading? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
    </form>
    <div className='flex gap-2 my-4'>
      Don't have an account?
      <Link to = {"/sign-up"}>
        <span className='text-blue-700 '>Sign Up</span>
      </Link>
    </div>
        <p className='text-red-700 mt-5'>{error?error:""}</p>
    </div>
    //error && ...: This is a conditional rendering pattern in JavaScript. It's shorthand for an "if" statement. 
    //It means if error is truthy (i.e., not null, undefined, 0, false, or an empty string), then the expression after && will be evaluated and returned; 
    //otherwise, it will return false and the expression after && will not be evaluated.
  )
};
