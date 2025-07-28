import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    userId,
  } = req.query;

  const query = {};

  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    query.user = userId;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
  };
  const videos = await Video.paginate(query, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }
  const video = await Video.findById(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video Fetch successfully"));
});

const createVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }
  if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }
  const videoFile = req.files.videoFile[0].path;
  const thumbnail = req.files.thumbnail[0].path;
  const duration = req.body.duration ? parseInt(req.body.duration, 10) : 0;
  const video = await Video.create({
    videoFile,
    thumbnail,
    title,
    description,
    duration,
    user: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video Created Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const videoLocalPath = req.file?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing");
  }

  const video = await uploadOnCloudinary(videoLocalPath, "video");

  if (!video.url) {
    throw new ApiError(400, "Error while uploading the video");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        videoUrl: video.url,
        videoThumbnail: video.thumbnail,
        videoTitle: req.body.title,
        videoDescription: req.body.description,
        videoDuration: req.body.duration ? parseInt(req.body.duration, 10) : 0,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Video uploaded successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }
  const video = await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Deleted Successfully"));
});

const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }
  const video = await Video.findById(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Liked Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }
  const video = await Video.findById(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video Publish Status Toggled Successfully")
    );
});
export {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  togglePublishStatus,
};
