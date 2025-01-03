import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

const Weather = ({ region }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const getRegionCode = (region) => {
    const regionCodes = {
      서울: "11B00000",
      인천: "11B00000",
      경기도: "11B00000",
      강원도: "11D10000",
      대전: "11C20000",
      세종: "11C20000",
      충청남도: "11C20000",
      충청북도: "11C10000",
      광주: "11F20000",
      전라남도: "11F20000",
      전라북도: "11F10000",
      대구: "11H10000",
      경상북도: "11H10000",
      부산: "11H20000",
      울산: "11H20000",
      경상남도: "11H20000",
      제주도: "11G00000",
    };

    if (!region) {
      console.error("지역 값이 없습니다. 기본값 108을 사용합니다.");
      return "108";
    }

    const mainRegion = region.split(" ")[0];
    console.log("입력된 지역명 (mainRegion):", mainRegion);

    const regionCode = regionCodes[mainRegion];
    if (!regionCode) {
      console.error(
        `지역명을 찾을 수 없습니다: ${mainRegion}. 기본값 108 사용.`
      );
    }
    return regionCode || "108";
  };

  const getCurrentTmFc = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = now.getHours();

    if (hour < 6) {
      const prevDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const prevYear = prevDate.getFullYear();
      const prevMonth = String(prevDate.getMonth() + 1).padStart(2, "0");
      const prevDay = String(prevDate.getDate()).padStart(2, "0");
      return `${prevYear}${prevMonth}${prevDay}1800`;
    }
    if (hour < 18) {
      return `${year}${month}${day}0600`;
    }
    return `${year}${month}${day}1800`;
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "맑음":
        return <WbSunnyIcon sx={{ color: "orange", fontSize: 40 }} />;
      case "구름많음":
        return <CloudIcon sx={{ color: "gray", fontSize: 40 }} />;
      case "눈":
        return <AcUnitIcon sx={{ color: "blue", fontSize: 40 }} />;
      case "비":
        return <ThunderstormIcon sx={{ color: "blue", fontSize: 40 }} />;
      default:
        return <Typography>?</Typography>;
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setError(null);

      const regionCode = getRegionCode(region);
      const tmFc = getCurrentTmFc();

      console.log("지역 코드 (regId):", regionCode);
      console.log("발표 시간 (tmFc):", tmFc);

      try {
        const response = await axios.get(
          `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&regId=${regionCode}&tmFc=${tmFc}`
        );

        console.log("API 응답 데이터:", response.data);

        const items = response.data.response?.body?.items?.item;
        if (Array.isArray(items) && items.length > 0) {
          setWeatherData(items[0]);
        } else {
          setError("날씨 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError(`오류 발생: ${err.message || err.toString()}`);
      }
    };

    if (region) {
      fetchWeatherData();
    } else {
      setError("지역 정보가 필요합니다.");
    }
  }, [region]);

  if (error) {
    return (
      <div style={{ color: "red" }}>
        <strong>오류:</strong> {error}
      </div>
    );
  }

  if (!weatherData) {
    return <div>데이터 로딩 중...</div>;
  }

  const weatherKeys = [
    { time: "오늘 오전", key: "wf4Am" },
    { time: "오늘 오후", key: "wf4Pm" },
    { time: "내일 오전", key: "wf5Am" },
    { time: "내일 오후", key: "wf5Pm" },
    { time: "모레 오전", key: "wf6Am" },
    { time: "모레 오후", key: "wf6Pm" },
    { time: "글피 오전", key: "wf7Am" },
    { time: "글피 오후", key: "wf7Pm" },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
        {region} 날씨 정보
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: 2,
        }}
      >
        {weatherKeys.map(({ time, key }) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 1,
              border: "1px solid #ccc",
              borderRadius: 2,
              minWidth: "120px",
            }}
          >
            <Typography>{time}</Typography>
            {getWeatherIcon(weatherData[key])}
            <Typography>{weatherData[key] || "정보 없음"}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Weather;
