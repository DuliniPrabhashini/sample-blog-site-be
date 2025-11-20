import { Request, Response } from "express";
import { AUthRequest } from "../middleware/auth";
import { v2 as cloudinary } from 'cloudinary';
import { IPost, Post } from "../models/post.model";
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  
});

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);


export const createPost = async (req: AUthRequest, res: Response) => {
    const { title, content, tags } = req.body;
    const author = req.user.sub;
    const image = req.file?.buffer;
    console.log(image);
    await cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }
        console.log('Cloudinary upload result:', result);
        const post = await Post.create({
          title,
          content,
          tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
          author,
          imageURL: result?.secure_url,
        } as IPost);
        return res.status(201).json({ message: 'Post created', data: post });
      }
    ).end(image);

};

export const getAllPost = async (req: Request, res: Response) => {
  try {
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
   
    const posts = await Post.find()
      .populate("author", "firstname email") 
      .sort({ createdAt: -1 })               
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};
export const getMyPost = (req:Request, res:Response) => {}