//Libraries
import express from "express";

// Database Modal
import { RestaurantModel } from "../../database/allModels";

//Validation
import {
  ValidateRestaurantCity,
  ValidateRestaurantSearchString,
} from "../../validation/restaurant";
import { ValidateId } from "../../validation/common";
const Router = express.Router();

/*
 *Route      /
 *Des        Get all the restaurant details based on city
 *Params     none
 *Access     Public
 *Method     Get
 */

Router.get("/", async (req, res) => {
  try {
    //http://localhost:4000/restaurant/?city=ncr
    // await ValidateRestaurantCity(req.query);
    const { city } = req.query;
    const restaurants = await RestaurantModel.find({ city });
    if (restaurants.length === 0) {
      return res.json({ error: "No restaurants found in this city" });
    }

    return res.json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /:_id
 *Des        Get individual restaurant details based on id
 *Params     none
 *Access     Public
 *Method     Get
 */
//http://localhost:4000/restaurant/5789765465sdgfse

Router.get("/:_id", async (req, res) => {
  try {
    await ValidateId(req.params);

    const { _id } = req.params;
    const restaurant = await RestaurantModel.findById(_id);

    if (!restaurant) return res.status(400).json({ error: "Restaurant not found!" });
    return res.json({ restaurant });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /
 *Des        Get restaurant details based on search string
 *Params     none
 *Access     Public
 *Method     Get
 */
Router.get("/search/:searchString", async (req, res) => {
  try {
    await ValidateRestaurantSearchString(req.params);

    const { searchString } = req.params;
    const restaurants = await RestaurantModel.find({
      name: { $regex: searchString, $options: "i" },
    });
    if (!restaurants)
      return res
        .status(404)
        .json({ error: `No restaurant matched with ${searchString}` });
    return res.json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
