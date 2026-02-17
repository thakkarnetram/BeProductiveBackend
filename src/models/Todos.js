const mongoose = require('mongoose');
const shortid = require('shortid');
const {encrypt} = require("../utils/encryption-handler/crypto");
// schema
const todoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  userId:{
    type:String,
    ref:"users"
  },
  todoTitle: {
    type: String,
    required: true,
  },
  todoDescription: {
    type: String,
  },
  todoPriority: {
    type: String,
    // enum: ["LOW", "MEDIUM", "HIGH"],
    // default: "LOW",
  },
  todoStatus: {
    type: String,
    // enum: ["PENDING", "COMPLETED"],
    // default: "PENDING",
  },
  // future scope for channel based to-dos
  workSpaceId : {
    type:String,
    default:null,
  },
  channelId : {
    type:String,
    default:null,
  },
  // reminder related
  remindAt:{
    type:Date,
    default:null,
  },
  repeatFrequency:{
    type:String,
    enum: ["NONE","DAILY","WEEKLY"],
    default:"NONE",
  },
  timezone:{
    type:String,
    default:null
  },
  notificationId:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  // __v 32 is
  // Object-Document Mapper
  // to keep a track of doc when its updated and saved
},{timestamps:true});

// for encryption
todoSchema.pre("save",function (next){
  if(this.isModified("todoTitle") && this.todoTitle) {
    this.todoTitle = encrypt(this.todoTitle);
  }
  if(this.isModified("todoDescription") && this.todoDescription) {
    this.todoDescription = encrypt(this.todoDescription);
  }
})

// Creating model
const ToDo = mongoose.model('userToDos', todoSchema);

module.exports = ToDo;
