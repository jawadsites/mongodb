"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import toast from "react-hot-toast";
import {
  createRegion,
  getAllRegions,
  updateRegion,
  deleteRegion,
  getAllUsers,
  me,
} from "@/app/config/request";
import "./region.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';

const RegionPage = () => {
  const [regions, setRegions] = useState<any[]>([]);
  const [regionName, setRegionName] = useState("");
  const [governorateName, setGovernorateName] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null); 

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true
    })
  },[])

  const router = useRouter();
  const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token") || ""
    : "";


  useEffect(() => {
    const init = async () => {
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        router.replace("/login");
        return;
      }

      try {
        const response = await me(token);
        const userData = response.user;
        if (!userData || userData.role !== "مسؤول") {
          toast.error("ليس لديك صلاحية الدخول لهذه الصفحة");
          router.replace("/");
          return;
        }

        setAuthorized(true);

        const regionsData = await getAllRegions(token);
        if (!regionsData?.error) setRegions(regionsData);

        const supervisorsData = await getAllUsers(token);
        if (!supervisorsData?.error) setSupervisors(supervisorsData);
      } catch (err) {
        toast.error("حدث خطأ أثناء التحقق من الصلاحيات");
        router.replace("/");
      }
    };

    init();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("يجب تسجيل الدخول أولاً");
    if (!regionName || !governorateName || !supervisorId)
      return toast.error("جميع الحقول مطلوبة");

    if (editingId) {
      const data = await updateRegion(
        token,
        editingId,
        regionName,
        governorateName,
        supervisorId
      );
      if (data?.error) return toast.error(data.error);
      toast.success("تم تحديث المنطقة بنجاح");
      setEditingId(null);
    } else {
      const data = await createRegion(
        token,
        regionName,
        governorateName,
        supervisorId
      );
      if (data?.error) return toast.error(data.error);
      toast.success("تم إنشاء المنطقة بنجاح");
    }

    setRegionName("");
    setGovernorateName("");
    setSupervisorId("");

    const updatedRegions = await getAllRegions(token);
    if (!updatedRegions?.error) setRegions(updatedRegions);
  };

  const handleEdit = (region: any) => {
    setEditingId(region._id);
    setRegionName(region.regionName);
    setGovernorateName(region.governorateName);
    setSupervisorId(region.supervisor?._id || "");
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    if (!token) return toast.error("يجب تسجيل الدخول أولاً");

    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذه المنطقة؟");
    if (!confirmDelete) {
      setLoading(false);
      return;
    }

    const data = await deleteRegion(token, id);
    if (data?.error) {
      setLoading(false);
      return toast.error(data?.error);
    }

    toast.success("تم حذف المنطقة بنجاح");
    setRegions((prev) => prev.filter((r) => r._id !== id));
    setLoading(false);
  };

  if (authorized === null) {
    return <p className="auth">جارٍ التحقق من صلاحياتك...</p>;
  }

  return (
    <div className="region-page">
      <Navbar />
      <div className="region-container" data-aos="fade-up">
        <h1 className="region-title">إدارة المناطق</h1>

        <form onSubmit={handleSubmit} className="region-form">
          <input
            type="text"
            placeholder="اسم المنطقة"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
          />
          <input
            type="text"
            placeholder="اسم المحافظة"
            value={governorateName}
            onChange={(e) => setGovernorateName(e.target.value)}
          />
          <select
            value={supervisorId}
            onChange={(e) => setSupervisorId(e.target.value)}
          >
            <option value="">اختر المشرف</option>
            {supervisors.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullname}
              </option>
            ))}
          </select>
          <button type="submit">
            {editingId ? "تحديث المنطقة" : "إنشاء المنطقة"}
          </button>
        </form>

        <div className="region-list">
          {regions.map((region) => (
            <div key={region._id} className="region-item">
              <div>
                <h2>{region.regionName}</h2>
                <p>{region.governorateName}</p>
                <p className="supervisor-name">
                  المشرف: {region.supervisor?.fullname || "—"}
                </p>
              </div>
              <div className="region-actions">
                <button onClick={() => handleEdit(region)} className="edit-btn">
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(region._id)}
                  className="delete-btn"
                >
                  {loading ? "..." : "حذف"}
                </button>
                <Link
                  href={`/regions/${region._id}`}
                  className="link-btn"
                >
                  رابط المنطقة
                </Link>
              </div>
            </div>
          ))}
          {regions.length === 0 && (
            <p className="no-regions">لا توجد مناطق حتى الآن</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionPage;
