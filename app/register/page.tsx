"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import  '@/app/login/login.css'
import Link from "next/link";
import { register } from "../config/request";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await register(fullname, email, password);
      if (data?.error) {
        setErrorMessage(data.error);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setFullname("");
        setEmail("");
        setPassword("");
        toast.success(` مرحباً بك${data.user.fullname}`);
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في طرف خادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-image-box">
          <Image
            src="/logo.jpg"
            alt="وزارة الدفاع"
            width={600}
            height={600}
            className="login-image"
          />

          <div className="overlay-text">
            <h2>وزارة الدفاع السورية</h2>
            <p>منصة التسجيل الرسمية للخدمات الإلكترونية</p>
          </div>
        </div>

        {/* Right (Form Section) */}
        <div className="login-form-box">
          <h2>إنشاء حساب جديد</h2>
          <p className="subtitle">
            مرحباً بك في المنصة الإلكترونية لوزارة الدفاع
          </p>

          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-group">
              <label>الاسم الكامل</label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                placeholder="أدخل اسمك الكامل"
                required
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="example@mail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>كلمة المرور</label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="********"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>



            <button
              type="submit"
              className={`login-btn ${loading ? "no-active" : ""}`}
            >
              {loading ? "جاري انشاء حساب" : " إنشاء الحساب"}
            </button>

            <p className="no-account">
              لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
