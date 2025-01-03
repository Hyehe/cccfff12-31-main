export const fetchCampgrounds = async () => {
  try {
    const response = await fetch(
      "https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&numOfRows=2000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json"
    );
    const data = await response.json();
    return data.response.body.items.item; // 데이터를 반환
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // 에러가 발생하면 빈 배열 반환
  }
};