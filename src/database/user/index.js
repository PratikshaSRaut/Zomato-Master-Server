import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const UserSchema = new mongoose.Schema(
    {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String },
      address: [{ details: { type: String }, for: { type: String } }],
      phoneNumber: [{ type: Number }],
    },
    {
      timestamps: true,
    }
  );

  UserSchema.methods.generateJwtToken = function(){
    return jwt.sign({user:this._id.toString()},"ZomatoAPP")
  }

  UserSchema.statics.findByEmailAndPhone = async({email, phoneNumber})=>{
    const checkUserByEmail= await UserModel.findOne({email})
    const checkUserByPhone = await UserModel.findOne({phoneNumber})    
    
    if(checkUserByEmail || checkUserByPhone){
    throw new Error("User already exists!")
  }
    return false; 
  }

UserSchema.statics.findByEmailAndPassword = async({email, password})=>{
  //check email exists or not
  const user = await UserModel.findOne({email});
  if(!user) throw new Error("User does not exist!!") 

  //compare password
  const doesPasswordMatch = await bcrypt.compare(password,user.password)

  if(!doesPasswordMatch) throw new Error("Invalid Password!!")
  return user;
}

UserSchema.pre("save",function(next){
const user = this;
//password is modified
if(!user.isModified("password")) return next();
//generate bcrypt salt
bcrypt.genSalt(8, (error,salt)=>{
  if(error) return next(error);

  //hash password

  bcrypt.hash(user.password, salt, (error,hash)=>{
    if(error) return next(error);

    //assign hashed password
    user.password = hash;
    return next();
  })
})
})

  export const UserModel = mongoose.model("Users", UserSchema);