"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import "./login.css";
import Link from "next/link";
import { login } from "@/app/config/request";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import './login.css'
export default function LoginPage() {
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
      const data = await login(email, password);
      if (data?.error) {
        setErrorMessage(data.error);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail("");
        setPassword("");
        toast.success(` مرحباً بك${data.user.fullname}`);
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في طرف خادم");
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left (Image Section) */}
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
            <p>منصة الدخول الرسمية للخدمات الإلكترونية</p>
          </div>
        </div>

        {/* Right (Form Section) */}
        <div className="login-form-box">
          <h2>تسجيل الدخول</h2>

          <form onSubmit={handleSubmit}>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>كلمة المرور</label>
              <input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>


            <button
              type="submit"
              className={`login-btn ${loading ? "no-active" : ""}`}
            >
              {loading ? "جاري تسجيل دخول" : " تسجيل الدخول"}
            </button>

            <p className="no-account">
              ليس لديك حساب؟ <Link href="/register">انشاء حساب</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
