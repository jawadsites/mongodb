"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/app/login/page";
import HomePage from "@/app/home/page";

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>جارٍ التحميل...</p>;
  }

  return isLoggedIn ? <HomePage /> : <LoginPage />;
}
