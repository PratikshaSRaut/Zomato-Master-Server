//Libraries
import express from "express";
import passport from "passport";

//Models
import { UserModel } from "../../database/allModels";

//Validation
import { ValidateSignIn, ValidateSignUp } from "../../validation/auth";

//Create a router
const Router = express.Router();

/*
 *Router     /signup
 *Des        Register new user
 *Params     none
 *Access     Public
 *Method     Post
 */

Router.post("/signup", async (req, res) => {
  try {
    await ValidateSignUp(req.body.credentials);
    await UserModel.findByEmailAndPhone(req.body.credentials);
    const newUser = await UserModel.create(req.body.credentials);
    const token = newUser.generateJwtToken();
    return res.status(200).json({ token, status: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /signin
 *Des        Sign-in with email and password
 *Params     none
 *Access     Public
 *Method     Post
 */

Router.post("/signin", async (req, res) => {
  try {
    await ValidateSignIn(req.body.credentials);
    const user = await UserModel.findByEmailAndPassword(req.body.credentials);
    const token = user.generateJwtToken();
    return res.status(200).json({ token, status: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /google
 *Des        Google Sign-in
 *Params     none
 *Access     Public
 *Method     Get
 */
Router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

/*
 *Router     /google/callback
 *Des        Google Sign-up callback
 *Params     none
 *Access     Public
 *Method     Get
 */
Router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    return res.redirect(
      `https://goofy-kowalevski-9d1d3d.netlify.app/google/${req.session.passport.user.token}`
    );
  }
);

export default Router;
