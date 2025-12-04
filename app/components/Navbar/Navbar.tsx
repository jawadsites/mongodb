"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { FaBars, FaPlus, FaTimes } from "react-icons/fa";
import "./navbar.css";
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="navbar">

      {/* اللوجو يبقى دائماً ظاهر */}
      <div className="logo">
        <Link href="/"><Image src="/logo.png" alt="logo" width={70} height={70} /></Link>
      </div>

      {/* زر المينيو للشاشات الصغيرة فقط */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes color="white" size={25} /> : <FaBars color="white" size={25} />}
      </div>

      {/* القائمة في الشاشات الكبيرة */}
      {!loading && user && (
        <div className="user-box desktop-menu">
          {user.role === "مسؤول" && (
            <Link className="plus-icon" href="/regions">
              <FaPlus />
            </Link>
          )}

          <CldImage
            src={user.avatar}
            alt="avatar"
            width={45}
            height={45}
            className="nav-avatar"
            onClick={() => router.push("/profile")}
          />

          <button className="logout-btn" onClick={handleLogout}>
            تسجيل خروج
          </button>
        </div>
      )}

      {/* القائمة المنسدلة للشاشات الصغيرة */}
      {menuOpen && !loading && user && (
        <div className="mobile-menu">
          {user.role === "مسؤول" && (
            <Link className="menu-item" href="/regions" onClick={() => setMenuOpen(false)}>
              <FaPlus /> إضافة
            </Link>
          )}

          <div className="menu-item" onClick={() => { setMenuOpen(false); router.push("/profile"); }}>
            <CldImage src={user.avatar} width={45} height={45} alt="avatar" className="nav-avatar" />
            الملف الشخصي
          </div>

          <button className="menu-item logout" onClick={handleLogout}>
            تسجيل خروج
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
