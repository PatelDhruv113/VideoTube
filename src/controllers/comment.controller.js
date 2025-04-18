import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { pipeline } from "stream"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {   //comment
            $lookup: {
                from: "users", //users
                localField: "owner",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                createdBy: {
                    $first: "$createdBy",
                }
            }
        },
        {
            $unwind: "$createdBy"
        },
        {
            $project: {
                content: 1,
                createdBy: 1,
            }
        },
        {
            $skip: (page-1)*limit
        },
        {
            $limit: parseInt(limit)
        }
    ])

    return res
    .status(200)
    .json(
         new ApiResponse(
            200,
            comments,
            "comment fetched Successfully"
         )
    )
})


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body

    if(!content){
        throw new ApiError(404, "Please write something in Comment")
    }

    const video = await Video.findById(req.params?.videoId)
    if(!video){
        throw new ApiError(400, "No such Video Found")
    }

    const comment = await Comment.create(
        {
            content,
            video: video._id,
            owner: req.user?._id,
        }
    )

    if(!comment){
        throw new ApiError(500, "Error while saving comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment Added"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    
    if (!content) {
        throw new ApiError(400,"Please fill the required field")
    }

    const comment = await Comment.findById(req.params?.commentId)
    if(!comment){
        throw new ApiError(400, "No comment Found")
    }

    if (!((comment.owner).equals(req.user?._id))) {
        throw new ApiError(400, "You are not allowed to change the comment")
    }

    const newComment = await Comment.findByIdAndUpdate(
        comment._id,
        {
            $set: {
                content,
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            newComment,
            "Update comment Successfully"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const comment = await Comment.findById(req.params?.commentId)

    if(!comment){
        throw new ApiError(400, "No Such Comment Found")
    }

    if(!((comment.owner).equals(req.user?._id))){
        throw new ApiError(400, "You cannot delete this comment")
    }

    const deletedComment = await Comment.findByIdAndDelete(comment._id)

    if(!deleteComment){
        throw new ApiError(400, "Not Delete Comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedComment,
            "Delete Comment Successfully"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}