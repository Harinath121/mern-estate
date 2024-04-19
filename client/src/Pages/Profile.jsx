import React, { useState , useEffect } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess } from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser,loading,error}= useSelector((state)=>state.user);
  const [file,setFile]  = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData,setFormData]=useState({});
  const[updateSuccess,setUpdateSuccess] = useState(false);
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
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Signout</span>
      </div>
        <p className='text-red-700 mt-5'>{error?error:""}</p>
        <p className='text-green-700 mt-5'>{updateSuccess?"Updated Successfully":""}</p>
      </div>


    
  )
}
