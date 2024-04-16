
import React,{ useState } from 'react';
import {Link , useNavigate} from  'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

const [formData,setFormData] = useState({});
const [error,setError]=useState();
const [loading,setLoading] = useState(false);
const navigate=useNavigate();


  const handleChange=(e)=>{
    setFormData({
      ...formData,    // this helps to already entered Data i.e, username is entered now eamil is typring the this will help on keep username saved already in the freild
      [e.target.id]:e.target.value, //key : value
    })
  }
  console.log(formData);
  const handleSubmit=async (e)=>{
    e.preventDefault(); // this prevents to reload the page when submit is clicked, it simply performs the assigned opertaion without actuallyt refreshing the whole page.
    setLoading(true);
    try{ // this try is to handle the frontend error.

    
    //check vite.config.js abouth the path in fetch
    //const res= await fetch('/api/auth/signup',formData); instead of directly passing the data we send it as stringformat and some aother parameters with that

    const res = await fetch('/api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json',

      },
      body: JSON.stringify(formData),
      
    });
    const data =await res.json();
    if(data.success===false){
      setLoading(false);
      setError(data.message);
      return;
    }
    setLoading(false);
    console.log(data);
    navigate('/sign-in');
    }catch(error){
      setLoading(false);
      setError(error.message);
    }
     
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>SignUp</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        <input type="text" placeholder='User Name' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="text" placeholder='Phone Number' className='border p-3 rounded-lg' id='phonenumber' onChange={handleChange}/>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-green-900 p-3 border rounded-lg text-white font-bold uppercase hover:opacity-75 disabled:opacity-65'>
          {loading? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
    </form>
    <div className='flex gap-2 my-4'>
      already have an account?
      <Link to = {"/sign-in"}>
        <span className='text-blue-700 '>Sign In</span>
      </Link>
    </div>
      {error && <p className='text-red-500'>{error}</p>} 
    </div>
    //error && ...: This is a conditional rendering pattern in JavaScript. It's shorthand for an "if" statement. 
    //It means if error is truthy (i.e., not null, undefined, 0, false, or an empty string), then the expression after && will be evaluated and returned; 
    //otherwise, it will return false and the expression after && will not be evaluated.
  )
};
