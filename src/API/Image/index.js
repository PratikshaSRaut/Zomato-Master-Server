import express from "express";
import multer from "multer";

//Database Model
import { ImageModel } from "../../database/allModels";

const Router = express.Router();

//multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Utility function
import { s3Upload } from "../../utils/s3";

/*
 *Router     /
 *Des        Uploads given image to AWS and save file link to mongodb
 *Params     none
 *Access     Public
 *Method     Post
 */

Router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    //s3 bucket options
    const bucketOptions = {
      Bucket: "zomato-master-p",
      Key: file.originalname,
      Body: file.buffer,
      Contenttype: file.mimetype,
      ACL: "public-read", //access control list
    };

    const uploadImage = await s3Upload(bucketOptions);

    const saveImageToDatabase = await ImageModel.create({
      images: [{ location: uploadImage.Location }],
    });

    return res.status(200).json(saveImageToDatabase);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const image = await ImageModel.findById(_id);

    return res.status(200).json(image);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
