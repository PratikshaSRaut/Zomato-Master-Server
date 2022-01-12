//Libraries
import express from "express";
import passport from "passport";

//Database Model
import { ReviewModel } from "../../database/allModels";

const Router = express.Router();

/*
 *Router     /:resid
 *Des       Get all reviews for particular restaurant
 *Params     none
 *Access     Public
 *Method     Get
 */
Router.get("/:resid", async (req, res) => {
  try {
    const { resid } = req.params;
    const reviews = await ReviewModel.find({ restaurants: resid });

    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /new
 *Des        Post: Adding new food/restaurant review and rating
 *Params     none
 *Access     Private
 *Method     Post
 */
Router.post("/new", passport.authenticate("jwt"), async (req, res) => {
  try {
    const { _id } = req.session.passport.user._doc;
    const { reviewData } = req.body;

    await ReviewModel.create({ ...reviewData, user: _id });
    return res.json({ reviews: "Successfully created Review" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Route      /delete/:_id
 *Des        Delete specific review
 *Params     _id
 *Access     Public
 *Method     Delete
 */
Router.delete("/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await ReviewModel.findByIdAndDelete(_id);
    return res.json({ review: "Successfully deleted the Review." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
