const mongoose = require('mongoose');
const shortid = require('shortid');
const {encrypt, decrypt} = require("../utils/encryption-handler/crypto");
// Define the Note schema
const noteSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  userId:{
    type:String,
    ref:"users"
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
},{timestamps:true});

// for encryption
noteSchema.pre("save",function (next) {
  if(this.isModified("title") && this.title) {
    this.title = encrypt(this.title)
  }
  if(this.isModified("description") && this.description) {
    this.description = encrypt(this.description)
  }
  next()
})

// for decryption
noteSchema.methods.toJSON = function (){
  const obj = this.toObject()
  if(obj.title){
    obj.title = decrypt(obj.title)
  }
  if(obj.description){
    obj.description = decrypt(obj.description)
  }
  return obj
}

// Create the Note model
const Note = mongoose.model('userNotes', noteSchema);

module.exports = Note;
