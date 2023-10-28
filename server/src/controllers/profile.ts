import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/models/audio";
import Playlist from "#/models/playlist";
import User from "#/models/user";
import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  let status: "added" | "removed";

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const profile = await User.findById(profileId);

  if (!profile) return res.status(404).json({ error: "Profile not found!" });

  const alreadyAFollower = await User.findOne({
    _id: profileId,
    followers: req.user.id,
  });

  if (alreadyAFollower) {
    //Un follow
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $pull: { followers: req.user.id },
      }
    );
    status = "removed";
  } else {
    //Follow the user
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $addToSet: { followers: req.user.id },
      }
    );
    status = "added";
  }

  if (status === "added") {
    //Update the following list (add)
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { followings: profileId } }
    );
  }

  if (status === "removed") {
    //Remove the following list (remove)
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { followings: profileId } }
    );
  }

  res.json({ status });
};

export const getUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const audios = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      about: item.about,
      file: item.file,
      poster: item.poster,
      date: item.createdAt,
      owner: { id: req.user.id, name: req.user.name },
    };
  });

  res.json({ audios });
};

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate<AudioDocument<{ _id: ObjectId; name: string }>>("owner");

  const audios = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      about: item.about,
      file: item.file,
      poster: item.poster,
      date: item.createdAt,
      owner: { id: item.owner._id, name: item.owner.name },
    };
  });

  res.json({ audios });
};

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const user = await User.findById(profileId);

  if (!user) return res.status(404).json({ error: "User not found!" });

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      followers: user.followers.length,
      avatar: user.avatar?.url,
    },
  });
};

export const getPublicPlaylist: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "0" } = req.query as paginationQuery;
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id!" });

  const playlist = await Playlist.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  if (!playlist) return res.json({ playlist: [] });

  res.json({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};
