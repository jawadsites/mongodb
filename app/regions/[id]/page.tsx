"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  createRegionInfo,
  updateRegionInfo,
  deleteRegionInfo,
  me,
  getRegionBydId,
  getRegionRecords,
} from "@/app/config/request";
import "./region-single.css";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar/Navbar";

interface RegionInfoType {
  _id: string;
  patientInfo: string;
  idNumber: number;
  age: number;
  unit: string;
  brigade: string;
  commander: string;
  mission: string;
  injuries: string;
  injuryDate: string;
  dischargeDate?: string;
  doctorName: string;
  surgicalOperation?: string;
  residence: string;
  phone?: number;
  supervisor: string;
  hospital: string;
  region: string;
  InitialDiagnosis: string;
  DoctorRecommendations: string;
  notes?: string;
  Invoices?: string;
  MedicalReports?: string;
  Drivers?: string;
  Nurses?: string;
  MedicalSupervisor?: string;
}

const RegionSinglePage = () => {
  const params = useParams();
  const regionId = params?.id as string;

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [regionData, setRegionData] = useState<any>(null);
  const [records, setRecords] = useState<RegionInfoType[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get token and role on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchRole(storedToken);
    }
  }, []);

  // Fetch region data and records when token and regionId are available
  useEffect(() => {
    if (token && regionId) {
      fetchRegionData();
      fetchRecords();
    }
  }, [token, regionId]);

  const fetchRole = async (authToken: string) => {
    try {
      const data = await me(authToken);
      if (data?.user?.role) setRole(data.user.role);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRegionData = async () => {
    try {
      const data = await getRegionBydId(token!, regionId);
      if (!data.error) {
        setRegionData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getRegionRecords(token!, regionId);
      if (!data.error && data.records) {
        setRecords(data.records);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("الرجاء تسجيل الدخول");

    try {
      if (editingId) {
        // Update existing record
        const response = await updateRegionInfo(token, editingId, formData);

        if (!response.error) {
          setRecords((prev) =>
            prev.map((r) => (r._id === editingId ? response : r))
          );
          toast.success("تم تحديث السجل");
          setEditingId(null);
        } else {
          toast.error(response.error);
        }
      } else {
        // Create new record
        const response = await createRegionInfo(token, regionId, formData);

        if (!response.error) {
          setRecords((prev) => [response, ...prev]);
          toast.success("تم إضافة السجل");
        } else {
          toast.error(response.error);
        }
      }

      setFormData({});
    } catch (err) {
      console.error(err);
      toast.error("خطأ أثناء العملية");
    }
  };

  const handleEdit = (record: RegionInfoType) => {
    setEditingId(record._id);
    setFormData(record);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = async (recordId: string) => {
    if (!token) return toast.error("Token not found");
    if (!window.confirm("هل أنت متأكد من حذف هذا السجل؟")) return;

    try {
      const response = await deleteRegionInfo(token, recordId);
      if (!response.error) {
        setRecords((prev) => prev.filter((item) => item._id !== recordId));
        toast.success("تم حذف السجل بنجاح");
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const isAdmin = role === "مسؤول";

  return (
    <div>
      <Navbar />
      <div className="region-page">
        <h1>سجلات المنطقة: {regionData?.regionName || ""}</h1>

        {/* Form - Only show for admin */}
        {isAdmin && (
          <form className="region-form" onSubmit={handleSubmit}>
            <input name="patientInfo" placeholder="معلومات المريض" value={formData.patientInfo || ""} onChange={handleChange} />
            <input name="idNumber" placeholder="الرقم الذاتي" type="number" value={formData.idNumber || ""} onChange={handleChange} />
            <input name="age" placeholder="العمر" type="number" value={formData.age || ""} onChange={handleChange} />
            <input name="unit" placeholder="الفرقة" value={formData.unit || ""} onChange={handleChange} />
            <input name="brigade" placeholder="اللواء" value={formData.brigade || ""} onChange={handleChange} />
            <input name="commander" placeholder="القائد" value={formData.commander || ""} onChange={handleChange} />
            <input name="mission" placeholder="المهمة" value={formData.mission || ""} onChange={handleChange} />
            <input name="injuries" placeholder="الإصابات" value={formData.injuries || ""} onChange={handleChange} />
            <input name="injuryDate" type="date" placeholder="تاريخ الإصابة" title="تاريخ الإصابة" value={formData.injuryDate?.slice(0, 10) || ""} onChange={handleChange} />

            <input name="doctorName" placeholder="اسم الطبيب" value={formData.doctorName || ""} onChange={handleChange} />
            <input name="residence" placeholder="السكن" value={formData.residence || ""} onChange={handleChange} />
            <input name="supervisor" placeholder="المتابع" value={formData.supervisor || ""} onChange={handleChange} />
            <input name="hospital" placeholder="المشفى" value={formData.hospital || ""} onChange={handleChange} />

            <input name="InitialDiagnosis" placeholder="التشخيص الأولي" value={formData.InitialDiagnosis || ""} onChange={handleChange} />
            <input name="DoctorRecommendations" placeholder="توصيات الطبيب" value={formData.DoctorRecommendations || ""} onChange={handleChange} />
            <input name="notes" placeholder="الملاحظات" value={formData.notes || ""} onChange={handleChange} />
            <input name="Invoices" placeholder="الفواتير" value={formData.Invoices || ""} onChange={handleChange} />
            <input name="MedicalReports" placeholder="التقارير الطبية" value={formData.MedicalReports || ""} onChange={handleChange} />
            <input name="Drivers" placeholder="السائقين" value={formData.Drivers || ""} onChange={handleChange} />
            <input name="Nurses" placeholder="الممرضين" value={formData.Nurses || ""} onChange={handleChange} />
            <input name="MedicalSupervisor" placeholder="المشرف الطبي" value={formData.MedicalSupervisor || ""} onChange={handleChange} />

            <div className="form-buttons">
              <button type="submit">
                {editingId ? "تحديث السجل" : "إضافة سجل"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                  إلغاء
                </button>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <p className="loading-text">جاري التحميل...</p>
        ) : records.length === 0 ? (
          <p className="no-records">لا توجد سجلات في هذه المنطقة</p>
        ) : (
          <table className="region-table">
            <thead>
              <tr>
                <th>معلومات المريض</th>
                <th>الرقم الذاتي</th>
                <th>العمر</th>
                <th>الفرقة</th>
                <th>اللواء</th>
                <th>القائد</th>
                <th>المهمة</th>
                <th>الإصابات</th>
                <th>تاريخ الإصابة</th>
                <th>اسم الطبيب</th>
                <th>السكن</th>
                <th>المشفى</th>
                <th>التشخيص الأولي</th>
                <th>توصيات الطبيب</th>
                <th>الملاحظات</th>
                {isAdmin && <th>الإجراءات</th>}
              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.patientInfo}</td>
                  <td>{record.idNumber}</td>
                  <td>{record.age}</td>
                  <td>{record.unit}</td>
                  <td>{record.brigade}</td>
                  <td>{record.commander}</td>
                  <td>{record.mission}</td>
                  <td>{record.injuries}</td>
                  <td>{record.injuryDate?.slice(0, 10)}</td>
                  <td>{record.doctorName}</td>
                  <td>{record.residence}</td>
                  <td>{record.hospital}</td>
                  <td>{record.InitialDiagnosis}</td>
                  <td>{record.DoctorRecommendations}</td>
                  <td>{record.notes}</td>

                  {isAdmin && (
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(record)} className="edit-btn">
                        تعديل
                      </button>
                      <button onClick={() => handleDelete(record._id)} className="delete-btn">
                        حذف
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegionSinglePage;
