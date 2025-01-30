import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler( async(req, _, next) => {

    try {
          // accessToken select karva mate cookies levi pade
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")  // req.header ae frontend side thi cookie male
        
        if(!token){
           throw new ApiError(401, "Unauthorized request")
        }
                                        //user new token    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
     
        req.user = user;  //"Take the value stored in the user variable and assign it to the user property of the req object." &&  req.user ->  property did not exist before; you are creating it.
        next()

   } catch (error) {

        throw new ApiError(401, error?.message || "Invalid Access Token")
   }
})