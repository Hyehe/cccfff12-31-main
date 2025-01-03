export const fetchAdminDetail = async (admin_idx) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/admins/${admin_idx}`
    ); // Spring API 호출
    if (!response.ok) {
      throw new Error("Failed to fetch admin");
    }
    const data = await response.json();
    return data; // 특정 캠핑장 데이터를 반환
  } catch (error) {
    console.error("Error fetching admin:", error);
    return null; // 에러 발생 시 null 반환
  }
};
