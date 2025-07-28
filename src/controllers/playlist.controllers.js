import { PlayList } from "../models/playlist.models";
import { asyncHandler } from "../utils/asyncHandler";

const getAllPlaylists = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    userId,
  } = req.query;
  const query = {};
});

export { getAllPlaylists };
