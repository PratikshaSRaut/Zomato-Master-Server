//Libraries
import express from "express";

// Database Modal
import { FoodModel } from "../../database/allModels";

//Validation
import { ValidateCategory, ValidateId } from "../../validation/common";

const Router = express.Router();
/**
 * Route        /:_id
 * Des          GET food based on id
 * Params       _id
 * Access       Public
 * Method       GET
 */
Router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const foods = await FoodModel.findById(_id);
    return res.json({ foods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /r/:_id
 *Des        Get all the Foods based on particular restaurant
 *Params     none
 *Access     Public
 *Method     Get
 */

Router.get("/r/:_id", async (req, res) => {
  try {
    await ValidateId(req.params);
    const { _id } = req.params;
    const foods = await FoodModel.find({ restaurant: _id });

    return res.json({ foods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
 *Router     /c/:category
 *Des        Get all the Foods based on particular category
 *Params     none
 *Access     Public
 *Method     Get
 */

Router.get("/c/:category", async (req, res) => {
  try {
    await ValidateCategory(req.params);
    const { category } = req.params;
    const foods = await FoodModel.find({
      category: { $regex: category, $options: "i" },
    });

    if (!foods)
      return res.status(404).json({ error: `No food matched with ${category}` });
    return res.json({ foods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
