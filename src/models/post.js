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
        type: Schema.Types.ObjectId, ref: "User",
        
      },
    ],  
  },
  { timestamps: true }
)

export default model("Post", PostSchema)
