import { PlayRecordType } from "@/types/musicInfo";
import { AxiosResponse } from "axios";
import { getErrorMessage } from "./error";
import request from "./request";

export const addPlayRecord = async (
  type: PlayRecordType,
  target_id: string
) => {
  try {
    const res: AxiosResponse<string> = await request.post("/play-record/add/", {
      type,
      target_id,
    });
    if (res && res.data === "success") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    getErrorMessage(err);
  }
};

export const loveOrNotASong = async (
  playlistId: string,
  id: string,
  love = true
) => {
  try {
    const res: AxiosResponse<string> = await request.post(
      `/playlists/${playlistId}/${love ? "add_song" : "remove_song"}/`,
      {
        song: id,
      }
    );
    if (res && res.data === "success") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    getErrorMessage(err);
  }
};
