import React, { useState , useEffect } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutUserFailure,signoutUserStart,signoutUserSuccess} from '../redux/user/userSlice';
import {Link} from 'react-router-dom';


export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser,loading,error}= useSelector((state)=>state.user);
  const [file,setFile]  = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData,setFormData]=useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [showListingsError,setshowListingError]=useState(false);
  const [userListings,setUserListings]=useState([]);


  const dispatch=useDispatch();
  console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);

  
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }

  },[file]);

  const handleFileUpload=(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred/
        snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
      },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>
        setFormData({...formData,avatar:downloadURL})
      );
    }
    );
  };

  const handleSubmit=async (e)=>{
    console.log("handlesubmit");
    
    e.preventDefault();
    console.log(formData)
    try{
      dispatch(updateUserStart());
      console.log("update fetch");

      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        

        method:'POST',
        headers:{
          'Content-Type' : 'application/json',
        },
        body:JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      

    }catch(error){
      dispatch(updateUserFailure(error.message));

    }
  };

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };

  const handleDeleteUser = async ()=>{


    try{
      dispatch(deleteUserStart());

      const res= await fetch(`/api/user/delete/${currentUser._id}`,{
        'method':'DELETE',
      });

      const data = await res.json();

      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return ;
      }

      dispatch(deleteUserSuccess(data));

    }catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut=async ()=>{

    try{

      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');

      const data = res.json();

      if(data.success===false){
        dispatch(signoutUserFailure(data.message));
        return;
      }

      dispatch(signoutUserSuccess(data));

    }catch(error){
      dispatch(signoutUserFailure(error.message));
      
    }

    
    
  };

  const handleShowListings=async()=>{
    try{
      setshowListingError(false);
      const res= await fetch(`/api/user/listings/${currentUser._id}`);

      const data = await res.json();

      console.log(data);

      if(data.success === false){
        console.log(data.message);
        setshowListingError(true);
        return ;
      }
      setUserListings(data);
      console.log('asda',userListings);
    }catch(err){
      console.log(err);
      setshowListingError(true);
    }
  }
  
  const handleListingDelete = async(lisitingId)=>{

    try{
      const res = await fetch(`/api/listing/delete/${lisitingId}`,{
        method:'DELETE',
      });

      const data = res.json();

      if(data.success===false){
        console.log(data.message);
        return ;
      }

      setUserListings((prev)=>prev.filter((listing)=> listing._id!=lisitingId)) //here we are removing it from userListing usestate such that it display directly 
    }catch(err){
      console.log(err);
    }

  }

 

  return (
      <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">


        <img src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        onClick={()=>{fileRef.current.click()}} accept='image/*' />

        {/* accept='image/* onbs this  */}

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden  />  

        {/* First we create a file input then we connect this to a image by a clicking functionality using useRef */}

        <p>
          {fileUploadError ? 

            <span className='text-red-700'>Error Image Uploading</span>
            :
            filePerc>0 && filePerc<100 
            ? 
            (<span className='text-slate-700'>{`Uploading..${filePerc}`}</span>)
            :
            filePerc===100 
            ?
            (<span className='text-green-700'>Image Successfully uploaded!</span>)
            :
            ('')

          }
        </p>


        <input type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" placeholder='email' defaultValue={currentUser.email}  id='email' className='border p-3 rounded-lg' onChange={handleChange}/>

        <input type="password" placeholder='password' defaultValue={currentUser.password} id='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="text" placeholder='phonenumber' defaultValue={currentUser.phonenumber} id='phonenumber' className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading?"Loading...":"update"}
        </button>
        <Link className='bg-slate-700 text-white p-3 text-center rounded-lg hover:opacity-90 disabled:opacity-80 uppercase' to={"/create-listing"}>Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Signout</span>
      </div>
        <p className='text-red-700 mt-5'>{error?error:""}</p>
        <p className='text-green-700 mt-5'>{updateSuccess?"Updated Successfully":""}</p>

        <button type='button' onClick={handleShowListings} className='text-green-700 uppercase w-full'>Show listings</button>
        <p className='text-red-700 sm p-3'>{showListingsError?'Error showing listings':''}</p>

        {userListings && userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain'/>
          </Link>
          <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
            <p >{listing.name}</p> 
            {/* truncate means when tittle is too long it shows as .... nameofki...*/}
          </Link>
          <div className="flex flex-col">
            <button onClick={()=>{
              handleListingDelete(listing._id)
            }} className='text-red-700'>Delete</button>

            <Link to={`/update-listing/${listing._id}`}>
            <button className='text-green-700'>Edit</button>
            </Link>
          </div>
          </div>
        ))}
        </div>
        }
        

      </div>

      
    
  )
}




//Within the map function, you're missing the return statement to return the JSX elements.
// Without the return statement or using curly braces {} after the arrow function =>, the JSX won't be returned implicitly. 
//You need to explicitly return the JSX or use curly braces.


//By enclosing the JSX elements within parentheses (), you can implicitly return them without using the return statement. 
//This ensures that the JSX will be rendered properly for each item in the userListings array.
