import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0]||'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.j'} alt='listing cover' className='h-[320px] sm:h-[220px] w-full
         object-cover hover:scale-105
         transition-scale duration-300' />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate  text-lg font-semibold text-slate-700">{listing.name}</p>
          <div className="flex items-center gap-1">
            <MdLocationOn className='h-4 w-4 text-green-700'/>
            <p className="text-sm text-gray-600 truncate w-full">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
          <p className="text-slate-500 font-semibold ">
            {listing.offer ? listing.discountPrice : listing.regularPrice}{listing.type === 'rent' && ' /- month'}{listing.type === 'sale' && ' /- '}
          </p>
          <div className='text-gray-700 flex gap-2'>
            <div className="font-bold text-xs">
              {listing.bedrooms>1?`${listing.bedrooms} beds`:`${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms>1?`${listing.bathrooms} baths`:`${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}


//https://github.com/tailwindlabs/tailwindcss-line-clamp
//so here in line 19 we used line-clamp-2 i.e, it is helps us to show 2 lines of information in the available area this is advanced version of truncate which
//only shows single line basically line-clamp is not included in tailwind css we have to add a plug in 
//we fetch the plugin code form the above link and add it to tailwind.config.css file 