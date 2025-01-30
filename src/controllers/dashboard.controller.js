import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Get total video views and count of videos
    const videosCount = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalViews: 1,
                totalVideos: 1
            }
        }
    ]);

    // Get total subscribers count
    const totalSubs = await Subscription.aggregate([
        {
            $match: {
                channel: userId
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalSubscribers: 1
            }
        }
    ]);

    // Get total likes count
    const likedCount = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "tweet",
                foreignField: "_id",
                as: "tweetInfo"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "commentInfo"
            }
        },
        {
            $match: {
                $or: [
                    { "videoInfo.0.owner": userId },
                    { "tweetInfo.0.owner": userId },
                    { "commentInfo.0.owner": userId }
                ]
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalLikes: 1
            }
        }
    ]);

    // Check for empty results
    const videosStats = videosCount[0] || { totalViews: 0, totalVideos: 0 };
    const totalSubsStats = totalSubs[0] || { totalSubscribers: 0 };
    const likedStats = likedCount[0] || { totalLikes: 0 };

    // Send response
    res.json({
        totalViews: videosStats.totalViews,
        totalVideos: videosStats.totalVideos,
        totalSubscribers: totalSubsStats.totalSubscribers,
        totalLikes: likedStats.totalLikes
    });
});


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                duration:1,
                views:1,
                isPublished:1,
                owner:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Fetched videos"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }