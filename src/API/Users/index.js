//Libraries
import express from "express";
import passport from "passport";

//Database Model
import { UserModel } from "../../database/allModels";

const Router = express.Router();
/**
 * Route        /
 * Des          GET authorized user data
 * Params       none
 * Access       Public
 * Method       GET
 */
Router.get("/", passport.authenticate("jwt"), async (req, res) => {
  try {
    const { email, fullName, phoneNumber, address } = req.session.passport.user._doc;

    return res.json({ user: { email, fullName, phoneNumber, address } });
  } catch {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /:_id
 *Des       Get user data
 *Params     _id
 *Access     Public
 *Method     Get
 */
Router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const getUser = await UserModel.findById(_id);
    const { fullName } = getUser;

    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: { fullName } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /update
 *Des       Update user data
 *Params     _id
 *Access     Public
 *Method     Put
 */

Router.put("/update/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { userData } = req.body;
    const updateUserData = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: userData,
      },
      {
        new: true,
      }
    );

    return res.json({ user: updateUserData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
