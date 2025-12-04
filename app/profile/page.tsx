"use client";

import React, { useEffect, useState } from "react";
import "./profile.css";
import { profile, me, bioUpdate } from "@/app/config/request";
import { editPassword } from "@/app/config/request"; // دالة PUT لتغيير كلمة المرور
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");

  // ===== إضافة كلمة المرور =====
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setReady(true);

    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setBioText(parsed.bio); // تعبئة bio داخل input
      } catch {
        setUser(null);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await me(token);
        if (data.user) {
          setUser(data.user);
          setBioText(data.user.bio);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [router]);

  if (!ready) return null;

  // ============= رفع الصورة الشخصية =============
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setLoadingAvatar(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const data = await profile(token, file);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setAvatarPreview(null);
        toast.success("تم تعديل الصورة الشخصية بنجاح");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء رفع الصورة");
    }

    setLoadingAvatar(false);
  };

  // ============= تعديل BIO =============
  const handleUpdateBio = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token مفقود");

    const data = await bioUpdate(token, bioText);

    if (data.error) return toast.error(data.error);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("تم تحديث النبذة بنجاح");
    setEditingBio(false);
  };

  // ============= تغيير كلمة المرور للمسؤول فقط =============
  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token مفقود");
    if (!oldPassword || !newPassword) return toast.error("جميع الحقول مطلوبة");

    setChangingPassword(true);
    const data = await editPassword(token, oldPassword, newPassword);
    setChangingPassword(false);

    if (data.error) return toast.error(data.error);

    toast.success("تم تغيير كلمة المرور بنجاح");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div>
      <Navbar />
      <div className="profile-wrapper">
        <div className="container">
          {/* 🎯 كارد النبذة */}
          <div className="bio-card">
            <h3>نبذة شخصية :</h3>
            {!editingBio ? (
              <>
                <p>{user?.bio || "لا توجد نبذة بعد"}</p>
                <button className="edit-btn" onClick={() => setEditingBio(true)}>تعديل</button>
              </>
            ) : (
              <>
                <textarea
                  className="bio-input"
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  rows={7}
                />
                <div className="bio-actions">
                  <button className="save-btn" onClick={handleUpdateBio}>حفظ</button>
                  <button className="cancel-btn" onClick={() => setEditingBio(false)}>إلغاء</button>
                </div>
              </>
            )}
          </div>

          {/* 🎯 كارد الصورة + الاسم + الإيميل */}
          <div className="avatar-card">
            <div className="avatar-box">
              {avatarPreview ? (
                <img src={avatarPreview} className="avatar" alt="avatar" />
              ) : user?.avatar ? (
                <CldImage src={user.avatar} alt="avatar" width={130} height={130} className="avatar" crop="fill" />
              ) : (
                <img src="/default-avatar.jpg" className="avatar" alt="avatar" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              {loadingAvatar && <p className="uploading">...جاري رفع الصورة</p>}
            </div>

            <div className="info-box">
              <h2>{user?.fullname}</h2>
              <p>{user?.email}</p>
              <p>{user?.role}</p>
            </div>
          </div>

          {/* 🎯 تغيير كلمة المرور للمسؤول فقط */}
          {user?.role === "مسؤول" && (
            <div className="password-card">
              <h3>تغيير كلمة المرور</h3>
              <input
                type="password"
                placeholder="كلمة المرور القديمة"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
