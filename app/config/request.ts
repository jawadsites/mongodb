export const register = async (
  fullname: string,
  email: string,
  password: string
) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullname, email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Reigster Request: ", error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Login Request: ", error);
  }
};

export const me = async (token: string) => {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Me Request: ", error);
  }
};

export const profile = async (token: string, avatar?: File, cover?: File) => {
  try {
    const formData = new FormData();

    if (avatar) formData.append("avatar", avatar);

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("Profile update error:", error);
    return { error: "حدث خطأ أثناء تحديث الملف الشخصي" };
  }
};

export const bioUpdate = async (token: string, bio: string) => {
  try {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Bio update Error : ", error);
    return { error: "حدث خطأ اثناء تعديل نبذة" };
  }
};

export const getAllUsers = async (token: string) => {
  try {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("GetAllUsers Error", error);
    return { error: "حدث خطأ اثناء جلب مستخدمين" };
  }
};

export const getUserById = async (token: string, id: string) => {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("GetUserById Error", error);
    return { error: "حدث خطأ اثناء جلب مستخدم" };
  }
};

export const deleteUser = async (token: string, id: string) => {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("DeleteUser Error:", error);
    return { error: "حدث خطأ أثناء حذف المستخدم" };
  }
};
export const createRegion = async (
  token: string,
  regionName: string,
  governorateName: string,
  supervisor: string
) => {
  const res = await fetch("/api/region", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ regionName, governorateName, supervisor }),
  });

  const data = await res.json();
  return data;
};
export const getAllRegions = async (token: string) => {
  try {
    const res = await fetch("/api/region", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("GetAllRegions ", error);
    return { error: "حدث خطأ اثناء عرض مناطق" };
  }
};

export const getRegionBydId = async (token: string, id: string) => {
  try {
    const res = await fetch(`/api/region/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("GetRegionById ", error);
    return { error: "حدث خطأ اثناء جلب منطقة" };
  }
};

export const updateRegion = async (
  token: string,
  id: string,
  regionName: string,
  governorateName: string,
  supervisor: string
) => {
  try {
    const res = await fetch(`/api/region/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ regionName, governorateName, supervisor }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("UpdateRegion ", error);
    return { error: "حدث خطأ اثناء تعديل منطقة" };
  }
};

export const deleteRegion = async (token: string, id: string) => {
  try {
    const res = await fetch(`/api/region/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("DeleteRegion ", error);
    return { error: "حدث خطأ اثناء حذف منطقة" };
  }
};

export const createRegionInfo = async (
  token: string,
  regionId: string,
  data: any
) => {
  try {
    const res = await fetch(`/api/regionInfo/${regionId}`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.log("CreateRegionInfo Error:", error);
    return { error: "حدث خطأ أثناء إنشاء السجل" };
  }
};


export const updateRegionInfo = async (token: string, id: string, data: any) => {
  try {
    const res = await fetch(`/api/regionInfo/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.log("UpdateRegionInfo Error:", error);
    return { error: "حدث خطأ أثناء تعديل السجل" };
  }
};

export const getRegionRecords = async (token: string, regionId: string) => {
  try {
    const res = await fetch(`/api/regionInfo/${regionId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    console.log("GetRegionRecords Error:", error);
    return { error: "حدث خطأ أثناء جلب السجلات" };
  }
};



export const deleteRegionInfo = async (token: string, id: string) => {
  try {
    const res = await fetch(`/api/regionInfo/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    console.log("DeleteRegionInfo Error:", error);
    return { error: "حدث خطأ أثناء حذف السجل" };
  }
};




export const editPassword = async (
  token: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(" EditPassword", error);
    return { error: "حدث خطأ في الخادم" };
  }
};
