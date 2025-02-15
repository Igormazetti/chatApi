import { RoomService } from "../RoomService";
import { RoomModel } from "../../models/RoomModel";
import { db } from "../../config/database";
import { UserModel } from "../../models/UserModel";

export const roomServiceFactory = () => {
  const roomModel = new RoomModel(db);
  const userModel = new UserModel(db);
  return new RoomService(roomModel, userModel);
}