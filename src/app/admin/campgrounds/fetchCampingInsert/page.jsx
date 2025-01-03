export const fetchCampingInsert = async (data) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/camping/sites/insert/data", // 하드코딩된 URL
      {
        method: "POST",
        body: data, // FormData 직접 전송
      }
    );

    // HTTP 상태 코드 확인
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to insert campground: ${response.status} - ${errorMessage}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error inserting campground:", error.message);
    return null; // 에러 발생 시 null 반환
  }
};
