import mongoose from "mongoose";

interface IRegionInfo {
  patientInfo: string; // معلومات المريض
  idNumber: number; // رقم ذاتي
  age: number; // العمر
  unit: string; // الفرقة
  brigade: string; // اللواء
  commander: string; // القائد
  mission: string; // الغزوة
  injuries: string; // الإصابة
  injuryDate: Date; // تاريخ الإصابة
  dischargeDate?: Date; // تاريخ التخريج
  doctorName: string; // اسم طبيب
  surgicalOperation?: string; // العمل الجراحي
  residence: string; // السكن
  InitialDiagnosis: string; // التشخيص الأولي للمريض
  DoctorRecommendations: string; // توصيات الطبيب
  notes: string; // الملاحظات
  Invoices: string; // الفواتير
  MedicalReports: string; // التقارير الطبية
  Drivers: string; // السائقين
  Nurses: string; // الممرضين
  MedicalSupervisor: string; // المشرف الطبي

  phone?: number; // رقم هاتف
  supervisor: string; // المتابع
  hospital: string; // مشفى
  region: mongoose.Schema.Types.ObjectId; // السجلات التي تابعة للمنطقة
  userId: mongoose.Schema.Types.ObjectId; // المستخدم الحالي
}

const regionInfoSchema = new mongoose.Schema<IRegionInfo>(
  {
    patientInfo: { type: String, required: true },
    idNumber: { type: Number, required: true },
    age: { type: Number, required: true },
    unit: { type: String, required: true },
    brigade: { type: String, required: true },
    commander: { type: String, required: true },
    mission: { type: String, required: true },
    injuries: { type: String, required: true },
    injuryDate: { type: Date, required: true },
    dischargeDate: { type: Date },
    doctorName: { type: String, required: true },
    surgicalOperation: { type: String },
    residence: { type: String, required: true },
    InitialDiagnosis: { type: String, required: true },
    DoctorRecommendations: { type: String, required: true },
    notes: { type: String },
    Invoices: { type: String },
    MedicalReports: { type: String },
    Drivers: { type: String },
    Nurses: { type: String },
    MedicalSupervisor: { type: String },

    phone: { type: Number },
    supervisor: { type: String, required: true },
    hospital: { type: String, required: true },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const RegionInfo =
  mongoose.models.RegionInfo || mongoose.model("RegionInfo", regionInfoSchema);
export default RegionInfo;
