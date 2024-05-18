import { errorHandler } from "../../utils/error.js";
import Listing from "../models/listing.model.js";

export const createListing=async(req,res,next)=>{

    try{

        const listing = await Listing.create(req.body);

        return res.status(201).json(listing);

    }catch(error){
        next(error);
    }

};

export const deleteListing = async(req,res,next)=>{

    const listing = await Listing.findById(req.params.id);

        if(!listing){
            return next(errorHandler(404,'Listing Not Found'));
        }

        if(req.user.id!=listing.userRef){
            return next(errorHandler(401,'you can delete your own listings only'));
        }
    try{
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted');
        
    }catch(err){
        next(err);
    }
}

// export const updateListing=async(req,res,next)=>{
//     const listing = await Listing.findById(req.params.id);

//     if(!listing){
//         return next(errorHandler(404,'Listing not Found'));
//     }
//     if(req.user.id!==listing.userRef){
//         return next(errorHandler(401,'you can Update your own listings only'));
//     }

//     try{
//         const updatedLisiting = await Listing.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             {new : true}
//         );

//         res.status(200).json(updatedLisiting);

//     }catch(err){
//         next(err);
//     }

// }

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        if (req.user.id !== listing.userRef.toString()) {
            return next(errorHandler(401, 'You can update your own listings only'));
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedListing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        res.status(200).json(updatedListing);
    } catch (err) {

        // Handle specific cast error for invalid ObjectId
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return next(errorHandler(404, 'Listing not found'));
        }
        
        next(err);
    }
};

export const getListing=async(req,res,next)=>{

    try{

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        res.status(200).json(listing);

    }catch(err){
        next(err);
    }
}

export const getListings=async(req,res,next)=>{

    try{

        //query are the filters that we pass thrugh url i.e, api call

        const limit = parseInt(req.query.limit) || 9;  //no of listings to be fetched
        const startIndex = parseInt(req.query.startIndex) || 0; //fromt the list of listings from which index we need to fetch

        let offer = req.query.offer;  

        if(offer === undefined||offer ==='false'){
            offer = {$in :[false,true]};        //when we are searching then initially offer is not considereed i.e, not passed in query hence it is undefined later on while we are searching through filters we assign it as false (dedfault); so in order to that when it is undefined we have to fetch all the true and false cases.
        }                                      //we are showing all cases even it is false only


        let furnished = req.query.furnished;

        if(furnished===undefined||furnished==='false'){
            furnished = {$in :[false,true]};
        }

        let parking = req.query.parking;

        if(parking===undefined||parking==='false'){
            parking = {$in :[false,true]};
        }

        let type = req.query.type;

        if(type ===undefined||type==='all'){
            type = {$in:['sale','rent']};
        }

        const searchTerm = req.query.searchTerm || ''; 

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

         const listing = await Listing.find({
            name : {$regex : searchTerm , $options :'i'} ,   // $options :'i' this means ignore case type lower/upper.
            offer,
            furnished,
            parking,
            type,

        }).sort(
            {[sort]:order}
        ).limit(limit).skip(startIndex);
        
        return res.status(200).json(listing);


    }catch(err){
        next(err);
    }
}

