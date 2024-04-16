import React, { useState , useEffect } from 'react'
import {  useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser}= useSelector((state)=>state.user);
  const [file,setFile]  = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData,setFormData]=useState({});

  console.log(formData);
  console.log(filePerc);
  console.log(fileUploadError);

  
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


  return (
      <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">


        <img src={currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        onClick={()=>{fileRef.current.click()}} accept='image/*' />

        {/* accept='image/* onbs this  */}

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden />  

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





        <input type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg'/>
        <input type="text" placeholder='email' defaultValue={currentUser.email}  id='email' className='border p-3 rounded-lg'/>

        <input type="text" placeholder='password' defaultValue={currentUser.password} id='password' className='border p-3 rounded-lg'/>
        <input type="text" placeholder='phonenumber' defaultValue={currentUser.phonenumber} id='phoneneumber' className='border p-3 rounded-lg'/>

        <button className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Signout</span>

      </div>
      </div>


    
  )
}
