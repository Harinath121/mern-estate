import React, { useEffect, useState } from 'react'
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage';
import {app} from '../firebase'
//import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useNavigate , useParams} from 'react-router-dom';


export default function UpdateTheListing() {

  const [formData,setFormData]=useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:1000,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,

  });

  const [files,setFiles] = useState(['']);

  const [imageUploadError,setImageUploadError] = useState(false);

  const [uploading,setUploading]= useState(false);

  const [error,setError] = useState('');

  const [loading,setLoading] = useState(false);

  const {currentUser}=useSelector(state=>state.user);

  const navigate=useNavigate();

  const params = useParams();

  //console.log(files);
  //console.log(formData);

  useEffect (()=>{
    const fetchListing = async ()=>{
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);

        const data =await res.json();

        if(data.success==false){
            console.log(data.message);
            return;
        }
        setFormData(data);
       // console.log(formData);
    };
    fetchListing();

  },[]);

  const handleImageSubmit = async (e)=>{
    e.preventDefault(); 

    if(files?.length>0 && files?.length + formData.imageUrls?.length<7){
      setUploading(true);
      setImageUploadError(false);
      const promises=[];

      for(let i=0;i<files.length;i++){
        promises.push(storeImage(files[i]));        //stores images into firebase
      }

      Promise.all(promises).then((urls)=>{                     //stored images are givent in the form of urls
        setFormData({
          ...formData,
          imageUrls:formData.imageUrls.concat(urls)       //.concat is to add new one to prev array
        });
        setImageUploadError(false)
        setUploading(false);
      }).catch((err)=>{
        setUploading(false);
        setImageUploadError("image upload Error image size should be less than 2 MB each");

      })
    }else{
      setUploading(false);
      setImageUploadError("you can only upload 6 images per list");
    }

  };

  const storeImage=(file)=>{
    
    return  new Promise((resolve,reject)=>{

      const storage = getStorage(app);
      const fileName = new Date().getTime()+file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);
      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progress= (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          console.log(`uplaoding is ${progress} done`);
        },
        (error)=>{
          reject(error);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downladURL)=>{
            resolve(downladURL);
          })
        }
      );

    })
  }

  const handleRemoveImage=(index)=>{

    setFormData({
      ...formData,
      imageUrls:formData.imageUrls.filter((_,i)=>i!==index),

    })

  }

  const handleChange=(e)=>{

    if(e.target.id==='sale'||e.target.id==='rent'){
      setFormData({
        ...formData,
        type:e.target.id
      })
    }
    if(e.target.id==='parking' || e.target.id==='furnished'||e.target.id==='offer'){

      setFormData({
        ...formData,
        [e.target.id]:e.target.checked,    // here '[]' represts that we are directly using variable instead of its name i.e [e.target.id] = name not [e.target.id] !='name'

      })
    }

    if(e.target.type==='number' || e.target.type==='text'||e.target.type==='textarea'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.value,
      })
    }

  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{

      if(formData.imageUrls?.length<1){
        return setError('upload Atleast one Image');
      }

      if(+formData.regularPrice < +formData.discountPrice) return setError('Discounted price must be less than regular Price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`,{
        'method':'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id,
        })
      }
      );
      const data= await res.json();

      console.log(data);
      setLoading(false);
      

      if(data.success===false){
        setError(error.message);
        return ;
      }
      navigate(`/listing/${data._id}`);
    }catch(error){
      setError(error.message);
      setLoading(false);
    }
    
  }
 

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibolad text-center my-7'>Update the Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit} >
        <div className='flex flex-col gap-4 flex-1'>
          <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' onChange={handleChange} value={formData.name} maxLength='62' minLength='10' required/>
          <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' onChange={handleChange} value={formData.description} required/> 
          <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' onChange={handleChange} value={formData.address} required/>
          <div className='flex flex-row gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" id='sale' onChange={handleChange} checked={formData.type==='sale'} className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='rent' onChange={handleChange} checked={formData.type==='rent'} className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='furnished' onChange={handleChange} checked={formData.furnished} className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='parking' onChange={handleChange} checked={formData.parking} className='w-5' />
              <span>Parking Slot</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='offer' onChange={handleChange} checked={formData.offer} className='w-5' />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex item-center gap-2 \'>
              <input type="number" className='p-3 border border-gray-300 rounded-lg' id='bedrooms' onChange={handleChange} value={formData.bedrooms} min='1' max='10' required/>
              <span>Bed Rooms</span>
            </div>
            <div className='flex item-center gap-2'>
              <input type="number" className='p-3 border border-gray-300 rounded-lg' id='bathrooms'onChange={handleChange} value={formData.bathrooms} min='1' max='10' required/>
              <span>Bath Rooms</span>
            </div>
            <div className='flex item-center gap-2 \'>
              <input type="number" className='p-3 border border-gray-300 rounded-lg' id='regularPrice' onChange={handleChange} value={formData.regularPrice} min='1000' max='10000000' required/>
              <span>Regular Price(ruppes/month)</span>
            </div>
            {
              formData.offer && (
                <div className='flex item-center gap-2 \'>
              <input type="number" className='p-3 border border-gray-300 rounded-lg' id='discountPrice'onChange={handleChange} value={formData.discountPrice}   min='0' max='100000' required/>
              <span>Discounted Price(ruppes/month)</span>
              </div>
              )
            }
          </div>
          <div className="felx flex-col felx-1">
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>First image will be cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
              <input onChange={(e)=>{setFiles(e.target.files)}} className='border border-gray-300 rounded w-full p-3' type="file" id='images' accept='image/*' multiple />
              <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80  '>
                {uploading?'uploading...':'upload'}
              </button>

            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

            {formData.imageUrls?.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={index} className='flex justify-between p-3 border items-center'>
                <img src={url} alt="listing image" className='w-20 h-20 rounded-lg object-contain' />
                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-75'>Delete</button>
              </div>
            ))}


             
          </div>
          <button disabled={loading||uploading} className='text-white bg-gray-700 rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' >
            {loading?'updating...':'Update listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
        
      </form>
    
    </main>

  )
}
