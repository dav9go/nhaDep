import express from "express";
import * as dotenv from "dotenv";

import User from "../mongoDB/models/user.js";

dotenv.config();

const router = express.Router({ mergeParams: true });

// CHECK IF USER EXIST AND CREATE IT IF NOT

router.route("/").post(async (req, res) => {
  try {
    console.log("req. body:", req.body);
    const { name, email, picture } = req.body;

    const userExist = await User.find({ email: email });

    if (userExist.length > 0) {
      return res.status(201).json({ success: true, data: userExist });
    }
    const newUser = await User.create({
      name,
      email,
      picture,
    });
    console.log("newUser:", newUser);

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(501).json({ success: false, message: "Create user", error });
  }
});

//USER PROFILE INFORMATION, FILLED IN postRoutes
export default router;
