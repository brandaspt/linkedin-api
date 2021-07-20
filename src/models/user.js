import mongoose from "mongoose"
import isEmail from "validator/lib/isEmail.js"

const { Schema, model } = mongoose

const reqString = { type: String, required: true }

const experienceSchema = new Schema(
  {
    role: reqString,
    company: reqString,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    description: reqString,
    area: reqString,
    image: { ...reqString, default: "https://www.cornerstone-business.com/wp-content/uploads/2019/09/placeholder.png" },
  },
  { timestamps: true }
)

const UserSchema = new Schema(
  {
    name: reqString,
    surname: reqString,
    email: {
      ...reqString,
      unique: true,
      validate: {
        validator: isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
    },
    bio: reqString,
    title: reqString,
    area: reqString,
    image: {
      ...reqString,
      default: function () {
        return `https://eu.ui-avatars.com/api/?name=${this.name}+${this.surname}`
      },
    },
    username: { ...reqString, unique: true },
    experiences: [experienceSchema],
  },
  { timestamps: true }
)

UserSchema.pre("findOneAndUpdate", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery())
  if (docToUpdate.image.includes("eu.ui-avatars.com")) {
    this.set({
      image: `https://eu.ui-avatars.com/api/?name=${this._update.name || docToUpdate.name}+${this._update.surname || docToUpdate.surname}`,
    })
  }
  next()
})

export default model("User", UserSchema)
