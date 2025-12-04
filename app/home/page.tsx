"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./home.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAllUsers, deleteUser, me } from "@/app/config/request";
import { FaTrashAlt } from "react-icons/fa";

const HomePage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  const fetchCurrentUser = async (token: string) => {
    const data = await me(token);
    if (data.user) {
      setCurrentUser(data.user);
    }
  };

  const fetchUsers = async (token: string) => {
    const data = await getAllUsers(token);
    if (data.error) {
      toast.error(data.error);
      return;
    }

    const filteredUsers = data.filter((u: any) => u._id !== currentUser?._id);
    setUsers(filteredUsers);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

 
  const handleDeleteUser = (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    toast(
      (t) => (
        <div style={{ direction: "rtl", textAlign: "right" }}>
          <p>هل أنت متأكد من حذف هذا المستخدم؟</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                const data = await deleteUser(token, id);

                if (data.error) {
                  toast.error(data.error);
                  return;
                }

                toast.success("تم حذف المستخدم بنجاح");
                fetchUsers(token);

                if (selectedUser?._id === id) setSelectedUser(null);
              }}
              style={{
                background: "#e63946",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              تأكيد
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: "#ccc",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
        },
      }
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      router.push("/login");
      return;
    }

    fetchCurrentUser(token).then(() => fetchUsers(token));
  }, [router, currentUser?._id]);

  return (
    <div className="home-wrapper">
      <Navbar />

      <div className="layout">
        <aside className="sidebar">
          <h3 className="sidebar-title">المستخدمون</h3>

          <div className="users-list">
            {users.map((u) => (
              <div
                key={u._id}
                className={`user-item ${selectedUser?._id === u._id ? "active" : ""}`}
                onClick={() => handleSelectUser(u)}
              >
                <div className="avatar-box">
                  <img src={u.avatar} className="avatar" />
                </div>

                <div className="user-info">
                  <p className="user-name">{u.fullname}</p>
                  <p className="user-email">{u.email}</p>
                </div>

                {currentUser?.role === "مسؤول" && (
                  <div className="user-actions">
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(u._id);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="main-view">
  {selectedUser ? (
    <div className="user-details-wrapper">
      <div className="user-card basic-info">
        <img src={selectedUser.avatar} className="big-avatar" />
        <h2>{selectedUser.fullname}</h2>
        <p className="email">{selectedUser.email}</p>
        <p className="role">{selectedUser.role}</p>
      </div>

      <div className="user-card bio-info">
        <h3>النبذة الشخصية:</h3>
        <p>{selectedUser.bio || "لا توجد نبذة متوفرة"}</p>
      </div>
    </div>
  ) : (
    <p className="placeholder">اختر مستخدماً من اليسار لعرض التفاصيل</p>
  )}
</main>
      </div>
    </div>
  );
};

export default HomePage;
