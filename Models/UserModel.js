import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },
    userCart: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
