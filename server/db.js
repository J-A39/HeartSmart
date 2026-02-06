const mongoose=require("mongoose");

async function connectMongo(){
  const uri=process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in server/.env");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}

module.exports = { connectMongo };