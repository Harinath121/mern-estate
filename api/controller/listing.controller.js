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
