import mongoose from "mongoose"

const { Schema, model } = mongoose

const reqString = { type: String, required: true }

const PostSchema = new Schema(
  {
    text:{
      type: String,
      required: true,
    },
    username:{
      type: String,
      required:true
    },
    userId:{
      type: String,
      required: true,
    },
    image:{
      type: String
    },
    likes:[
      {
        userId:String,
        
      },
    ],  
  },
  { timestamps: true }
)

export default model("Post", PostSchema)
