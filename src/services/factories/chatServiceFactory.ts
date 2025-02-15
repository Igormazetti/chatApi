import { db } from "../../config/database";
import { MessageModel } from "../../models/MessageModel";
import { RoomModel } from "../../models/RoomModel";
import { UserModel } from "../../models/UserModel";
import { ChatService } from "../ChatService";

export const chatServiceFactory = () => {
  const messageModel = new MessageModel(db);
  const userModel = new UserModel(db);
  const roomModel = new RoomModel(db);
  return new ChatService(messageModel, userModel, roomModel);
}