import mongoose from "mongoose";

interface IRegion {
  regionName: string;
  governorateName: string;
  supervisor: mongoose.Schema.Types.ObjectId; 
}

export const regionSchema = new mongoose.Schema<IRegion>(
  {
    regionName: {
      type: String,
      required: true,
    },
    governorateName: {
      type: String,
      required: true,
    },
     supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
  },
  { timestamps: true }
);


const Region = mongoose.models.Region || mongoose.model("Region", regionSchema);
export default Region;