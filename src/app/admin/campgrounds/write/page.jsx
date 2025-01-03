"use client";
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Divider,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import Postcode from "react-daum-postcode";
import "./styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CampgroundsWrite = () => {
  const indutyOptions = ["일반야영장", "카라반", "글램핑", "자동차야영장"];
  const lctClOptions = ["자연", "호수", "산", "바다", "숲"];
  const animalCmgClOptions = ["가능", "불가능", "가능(소형견)"];
  const sbrsClOptions = [
    "운동시설",
    "전기",
    "무선인터넷",
    "장작판매",
    "온수",
    "트렘폴린",
    "물놀이장",
    "놀이터",
    "산책로",
    "운동장",
    "마트",
    "편의점",
  ];
  const posblFcltyClOptions = [
    "수영장",
    "산책로",
    "계곡 물놀이",
    "수상레저",
    "낚시",
    "해수욕",
    "어린이놀이시설",
    "청소년체험시설",
    "농어촌체험시설",
    "운동장",
    "강/물놀이",
  ];

  const [tel, setTel] = useState({ first: "", middle: "", last: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 선택된 파일 가져오기
    if (file) {
      const fileUrl = URL.createObjectURL(file); // 파일 URL 생성
      setFormData((prev) => ({
        ...prev,
        firstImageUrl: fileUrl, // URL을 상태에 저장
      }));
      setSelectedFile(file); // 파일 객체도 따로 저장 (API 호출 시 필요)
    }
  };

  const [formData, setFormData] = useState({
    facltNm: "",
    lineIntro: "",
    intro: "",
    allar: "",
    bizrno: "",
    featureNm: "",
    lctCl: [],
    induty: [],
    doNm: "",
    sigunguNm: "",
    zipcode: "",
    addr1: "",
    direction: "",
    tel: "",
    homepage: "",
    sitedStnc: "",
    siteMg1Width: "",
    siteMg1Virticl: "",
    siteMg2Width: "",
    siteMg2Virticl: "",
    siteMg3Width: "",
    siteMg3Virticl: "",
    sbrsCl: [],
    animalCmgCl: "",
    posblFcltyCl: [],
    siteBottomCl1: "",
    siteBottomCl2: "",
    siteBottomCl3: "",
    siteBottomCl4: "",
    siteBottomCl5: "",
    firstImageUrl: null,
    brazierCl: "",
    price: "",
    gnrlSiteCo: "",
    caravSiteCo: "",
    autoSiteCo: "",
    glampSiteCo: "",
    sbrsEtc: "",
    glampInnerFclty: "",
    caravInnerFclty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 배열 데이터를 처리할 경우
    if (name === "lctCl" || name === "sbrsCl" || name === "posblFcltyCl") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.isArray(prevData[name])
          ? value.split(",") // 쉼표로 구분된 문자열을 배열로 변환
          : value,
      }));
    } else if (["first", "middle", "last"].includes(name)) {
      // 전화번호 처리
      setTel((prevTel) => ({ ...prevTel, [name]: value }));
    } else {
      // 기본 값 처리
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...prevData[name], value]
        : prevData[name].filter((item) => item !== value),
    }));
  };

  // 우편번호 검색 후 데이터 처리
  const handlePostcodeComplete = (data) => {
    setFormData((prev) => ({
      ...prev,
      doNm: data.sido, // 도
      sigunguNm: data.sigungu, // 시군구
      zipcode: data.zonecode, // 우편번호
      addr1: data.roadAddress || data.jibunAddress, // 도로명 주소 또는 지번 주소
    }));
    setPostcodeVisible(false); // 검색창 닫기
  };
  const [isPostcodeVisible, setPostcodeVisible] = useState(false);
  // 우편번호 API 팝업 토글
  const togglePostcode = () => {
    setPostcodeVisible(!isPostcodeVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullPhoneNumber = `${tel.first}-${tel.middle}-${tel.last}`;
    const data = new FormData();

    data.append("facltNm", formData.facltNm);
    data.append("lineIntro", formData.lineIntro);
    data.append("intro", formData.intro);
    data.append("allar", formData.allar);
    data.append("bizrno", formData.bizrno);
    data.append("featureNm", formData.featureNm);

    // 배열 데이터를 쉼표로 연결된 문자열로 변환
    data.append(
      "lctCl",
      Array.isArray(formData.lctCl) ? formData.lctCl.join(",") : ""
    );
    data.append(
      "induty",
      Array.isArray(formData.induty) ? formData.induty.join(",") : ""
    );
    data.append(
      "sbrsCl",
      Array.isArray(formData.sbrsCl) ? formData.sbrsCl.join(",") : ""
    );
    data.append(
      "posblFcltyCl",
      Array.isArray(formData.posblFcltyCl)
        ? formData.posblFcltyCl.join(",")
        : ""
    );

    data.append("doNm", formData.doNm);
    data.append("sigunguNm", formData.sigunguNm);
    data.append("zipcode", formData.zipcode);
    data.append("addr1", formData.addr1);
    data.append("direction", formData.direction);
    data.append("tel", fullPhoneNumber);
    data.append("homepage", formData.homepage);
    data.append("sitedStnc", formData.sitedStnc);
    data.append("siteMg1Width", formData.siteMg1Width);
    data.append("siteMg1Virticl", formData.siteMg1Virticl);
    data.append("siteMg2Width", formData.siteMg2Width);
    data.append("siteMg2Virticl", formData.siteMg2Virticl);
    data.append("siteMg3Width", formData.siteMg3Width);
    data.append("siteMg3Virticl", formData.siteMg3Virticl);
    data.append("animalCmgCl", formData.animalCmgCl);
    data.append("siteBottomCl1", formData.siteBottomCl1);
    data.append("siteBottomCl2", formData.siteBottomCl2);
    data.append("siteBottomCl3", formData.siteBottomCl3);
    data.append("siteBottomCl4", formData.siteBottomCl4);
    data.append("siteBottomCl5", formData.siteBottomCl5);
    data.append("price", formData.price);
    data.append("gnrlSiteCo", formData.gnrlSiteCo);
    data.append("autoSiteCo", formData.autoSiteCo);
    data.append("glampSiteCo", formData.glampSiteCo);
    data.append("caravSiteCo", formData.caravSiteCo);
    data.append("brazierCl", formData.brazierCl);
    data.append("sbrsEtc", formData.sbrsEtc);
    data.append("glampInnerFclty", formData.glampInnerFclty);
    data.append("caravInnerFclty", formData.caravInnerFclty);

    if (selectedFile) {
      data.append("file", selectedFile);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/camping/sites/insert/data",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("캠핑장 등록 성공!");
        router.push("/admin/campgrounds/view");
      } else {
        alert("캠핑장 등록 실패");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("등록 중 문제가 발생했습니다.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey",
        minHeight: "100vh",
        padding: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "80%",
          maxWidth: "1200px",
          display: "flex", // Flexbox 사용
          alignItems: "center", // 세로 방향 가운데 정렬
          flexDirection: "column", // 세로 방향 정렬
        }}
      >
        <h2>캠핑장 등록하기</h2>
        <hr></hr>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // 좌우로 정렬
            gap: "16px", // 두 테이블 간 간격
            flexWrap: "wrap", // 화면이 좁아질 경우 테이블이 아래로 내려감
          }}
        >
          {/* 좌측 테이블 */}
          <TableContainer component={Paper} sx={{ flex: 1, minWidth: "400px" }}>
            <Table>
              <TableBody>
                {/* 캠핑장 이름 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    캠핑장 이름 *
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="facltNm"
                      value={formData.facltNm}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      required
                    />
                  </TableCell>
                </TableRow>

                {/* 사업자 번호 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    사업자 번호 *
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      className="input-field"
                      name="bizrno"
                      value={formData.bizrno}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">가격 *</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      type="number"
                      required
                    />
                  </TableCell>
                </TableRow>

                {/* 업종 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">업종</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <FormControl fullWidth className="input-field">
                      <InputLabel>업종</InputLabel>
                      <Select
                        name="induty"
                        multiple
                        value={formData.induty}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            induty: e.target.value,
                          }))
                        }
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {indutyOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>

                {/* 전화번호 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">전화번호</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <Box display="flex">
                      <TextField
                        name="first"
                        value={tel.first}
                        onChange={handleChange}
                        sx={{ width: "30%" }}
                        type="number"
                      />
                      <Typography sx={{ mx: 1 }}>-</Typography>
                      <TextField
                        name="middle"
                        value={tel.middle}
                        onChange={handleChange}
                        sx={{ width: "30%" }}
                        type="number"
                      />
                      <Typography sx={{ mx: 1 }}>-</Typography>
                      <TextField
                        name="last"
                        value={tel.last}
                        onChange={handleChange}
                        sx={{ width: "30%" }}
                        type="number"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                {/* 우편번호 + 검색 버튼 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">우편번호</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <Box display="flex" gap={2}>
                      <TextField
                        label="우편번호"
                        fullWidth
                        value={formData.zipcode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipcode: e.target.value })
                        }
                        readOnly
                        className="input-field"
                      />
                      <Button
                        variant="contained"
                        onClick={togglePostcode}
                        className="search-button"
                      >
                        검색
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
                {/* 우편번호 API 검색 팝업 */}
                {isPostcodeVisible && (
                  <TableRow className="custom-table-row">
                    <TableCell colSpan={2}>
                      <Postcode
                        onComplete={handlePostcodeComplete}
                        autoClose={false}
                      />
                    </TableCell>
                  </TableRow>
                )}
                {/* 도와 시군구 같은 줄에 배치 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    도 / 시군구
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <Box display="flex" gap={2}>
                      <TextField
                        className="input-field"
                        label="도"
                        fullWidth
                        value={formData.doNm}
                        onChange={(e) =>
                          setFormData({ ...formData, doNm: e.target.value })
                        }
                        readOnly
                      />
                      <TextField
                        className="input-field"
                        label="시군구"
                        fullWidth
                        value={formData.sigunguNm}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sigunguNm: e.target.value,
                          })
                        }
                        readOnly
                      />
                    </Box>
                  </TableCell>
                </TableRow>

                {/* 주소 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">주소</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      label="주소"
                      fullWidth
                      value={formData.addr1}
                      onChange={(e) =>
                        setFormData({ ...formData, addr1: e.target.value })
                      }
                      readOnly
                      className="input-field"
                    />
                  </TableCell>
                </TableRow>

                {/* 오시는 길 상세 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    오시는 길 상세
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      label="오시는 길 상세"
                      name="direction"
                      value={formData.direction}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">입지구분</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      select
                      name="lctCl"
                      value={formData.lctCl}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                    >
                      {lctClOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* 우측 테이블 */}
          <TableContainer component={Paper} sx={{ flex: 1, minWidth: "400px" }}>
            <Table>
              <TableBody>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">홈페이지</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="homepage"
                      value={formData.homepage}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">부대시설</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <FormGroup row>
                      {sbrsClOptions.map((option) => (
                        <FormControlLabel
                          key={option}
                          control={
                            <Checkbox
                              name="sbrsCl"
                              value={option}
                              checked={formData.sbrsCl.includes(option)}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </FormGroup>
                  </TableCell>
                </TableRow>

                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    반려동물 출입
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      select
                      name="animalCmgCl"
                      value={formData.animalCmgCl}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                    >
                      {animalCmgClOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">특징</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="featureNm"
                      value={formData.featureNm}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      placeholder="특징"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">한줄 소개</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="lineIntro"
                      value={formData.lineIntro}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      placeholder="한줄 소개(1000자 내)"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">소개</TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="intro"
                      value={formData.intro}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      multiline
                      rows={6} // 원하는 행 수로 조정 가능
                      placeholder="캠핑장 소개를 입력해 주세요(5000자 내)"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    화로대 개수
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="brazierCl"
                      value={formData.brazierCl}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      placeholder="한줄 소개(1000자 내)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* 밑에 테이블 */}
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    주변 이용가능 시설
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <FormGroup row>
                      {posblFcltyClOptions.map((option) => (
                        <FormControlLabel
                          key={option}
                          control={
                            <Checkbox
                              name="posblFcltyCl"
                              value={option}
                              checked={formData.posblFcltyCl.includes(option)}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </FormGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                    >
                      {/* Right Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>캠핑장 전체 면적(㎡)</Typography>
                        <TextField
                          name="allar"
                          value={formData.allar}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                          type="number"
                        />
                      </Box>
                      {/* Left Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>사이트 간 거리</Typography>
                        <TextField
                          name="sitedStnc"
                          value={formData.sitedStnc}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                          type="number"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>

                {/* 사이트 크기 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    사이트 크기
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      {/* 크기 1 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">크기 1</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            justifyContent: "center",
                            mt: 1,
                          }}
                        >
                          <TextField
                            name="siteMg1Width"
                            value={formData.siteMg1Width}
                            onChange={handleChange}
                            placeholder="가로"
                            sx={{ width: "40%" }}
                            type="number"
                          />
                          <Typography variant="body1">x</Typography>
                          <TextField
                            name="siteMg1Virticl"
                            value={formData.siteMg1Virticl}
                            onChange={handleChange}
                            placeholder="세로"
                            sx={{ width: "40%" }}
                            type="number"
                          />
                        </Box>
                      </Box>
                      {/* 크기 2 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">크기 2</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            justifyContent: "center",
                            mt: 1,
                          }}
                        >
                          <TextField
                            name="siteMg2Width"
                            value={formData.siteMg2Width}
                            onChange={handleChange}
                            placeholder="가로"
                            sx={{ width: "40%" }}
                            type="number"
                          />
                          <Typography variant="body1">x</Typography>
                          <TextField
                            name="siteMg2Virticl"
                            value={formData.siteMg2Virticl}
                            onChange={handleChange}
                            placeholder="세로"
                            sx={{ width: "40%" }}
                            type="number"
                          />
                        </Box>
                      </Box>
                      {/* 크기 3 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">크기 3</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            justifyContent: "center",
                            mt: 1,
                          }}
                        >
                          <TextField
                            name="siteMg3Width"
                            value={formData.siteMg3Width}
                            onChange={handleChange}
                            placeholder="가로"
                            sx={{ width: "40%" }}
                            type="number"
                          />
                          <Typography variant="body1">x</Typography>
                          <TextField
                            name="siteMg3Virticl"
                            value={formData.siteMg3Virticl}
                            onChange={handleChange}
                            placeholder="세로"
                            sx={{ width: "40%" }}
                            type="number"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                {/* 사이트 개수 */}
                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    사이트 개수
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      {/* 잔디 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">잔디</Typography>
                        <TextField
                          name="siteBottomCl1"
                          value={formData.siteBottomCl1}
                          type="number"
                          onChange={handleChange}
                          placeholder="개수"
                          fullWidth
                        />
                      </Box>
                      {/* 파쇄석 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">파쇄석</Typography>
                        <TextField
                          name="siteBottomCl2"
                          value={formData.siteBottomCl2}
                          type="number"
                          onChange={handleChange}
                          placeholder="개수"
                          fullWidth
                        />
                      </Box>
                      {/* 테크 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">테크</Typography>
                        <TextField
                          name="siteBottomCl3"
                          value={formData.siteBottomCl3}
                          type="number"
                          onChange={handleChange}
                          placeholder="개수"
                          fullWidth
                        />
                      </Box>
                      {/* 자갈 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">자갈</Typography>
                        <TextField
                          name="siteBottomCl4"
                          value={formData.siteBottomCl4}
                          type="number"
                          onChange={handleChange}
                          placeholder="개수"
                          fullWidth
                        />
                      </Box>
                      {/* 맨흙 */}
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="subtitle1">맨흙</Typography>
                        <TextField
                          name="siteBottomCl5"
                          value={formData.siteBottomCl5}
                          type="number"
                          onChange={handleChange}
                          placeholder="개수"
                          fullWidth
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                {/* 파일 업로드 */}
                <TableRow>
                  <TableCell>썸네일 이미지</TableCell>
                  <TableCell>
                    <input
                      type="file"
                      onChange={handleFileChange} // 파일 선택 핸들러 연결
                    />
                    {formData.firstImageUrl && (
                      <img
                        src={formData.firstImageUrl}
                        alt="Thumbnail Preview"
                        style={{
                          width: "100px",
                          height: "auto",
                          marginTop: "10px",
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                    >
                      {/* Right Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>일반야영장 주요시설</Typography>
                        <TextField
                          name="gnrlSiteCo"
                          value={formData.gnrlSiteCo}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                          type="number"
                          placeholder="개수"
                        />
                      </Box>
                      {/* Left Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>카라반 주요시설</Typography>
                        <TextField
                          name="caravSiteCo"
                          value={formData.caravSiteCo}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                          type="number"
                          placeholder="개수"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                    >
                      {/* Right Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>자동차야영장 주요시설</Typography>
                        <TextField
                          name="autoSiteCo"
                          value={formData.autoSiteCo}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                          type="number"
                          placeholder="개수"
                        />
                      </Box>
                      {/* Left Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>글램핑 주요시설</Typography>
                        <TextField
                          name="glampSiteCo"
                          value={formData.glampSiteCo}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                          type="number"
                          placeholder="개수"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                    >
                      {/* Right Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>글램핑 내부시설</Typography>
                        <TextField
                          name="glampInnerFclty"
                          value={formData.glampInnerFclty}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                        />
                      </Box>
                      {/* Left Column */}
                      <Box sx={{ flex: 1 }}>
                        <Typography>카라반 내부시설</Typography>
                        <TextField
                          name="caravInnerFclty"
                          value={formData.caravInnerFclty}
                          onChange={handleChange}
                          fullWidth
                          className="input-field"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow className="custom-table-row">
                  <TableCell className="custom-table-cell">
                    부대시설 기타
                  </TableCell>
                  <TableCell className="custom-table-cell-content">
                    <TextField
                      name="sbrsEtc"
                      value={formData.sbrsEtc}
                      onChange={handleChange}
                      fullWidth
                      className="input-field"
                      multiline
                      rows={3} // 원하는 행 수로 조정 가능
                      placeholder="기타 부대시설을 입력해주세요(200자 내)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Link href="/admin/campgrounds/view" passHref>
            <Button variant="outlined" sx={{ mr: 2 }}>
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CampgroundsWrite;
