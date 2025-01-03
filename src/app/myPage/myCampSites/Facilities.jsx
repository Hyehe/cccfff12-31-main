import { Box } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Wifi from "@mui/icons-material/Wifi";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import ChildCare from "@mui/icons-material/ChildCare";
import Pool from "@mui/icons-material/Pool";
import HikingIcon from "@mui/icons-material/Hiking";
import SportsSoccer from "@mui/icons-material/SportsSoccer";
import Store from "@mui/icons-material/Store";

const FacilityItem = ({ icon: Icon, color, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Icon style={{ fontSize: "30px", color }} />
    <p style={{ marginTop: "5px", textAlign: "center", color: "black" }}>
      {label}
    </p>
  </div>
);



function Facilities( facilities ) {
  return (
    <Box>
      {facilities.split(",").map((facility, idx) => {
        const trimmedFacility = facility.trim();
        switch (trimmedFacility) {
          case "운동시설":
            return <FacilityItem key={trimmedFacility} icon={FitnessCenterIcon} color="#3f51b5" label="운동시설" />;
          case "전기":
            return <FacilityItem key={trimmedFacility} icon={ElectricBoltIcon} color="#FADA7A" label="전기" />;
          case "무선인터넷":
            return <FacilityItem key={trimmedFacility} icon={Wifi} color="#00bcd4" label="무선인터넷" />;
          case "장작판매":
            return <FacilityItem key={trimmedFacility} icon={ShoppingCart} color="#8bc34a" label="장작판매" />;
          case "온수":
            return <FacilityItem key={trimmedFacility} icon={LocalFireDepartment} color="#ff5722" label="온수" />;
          case "트렘폴린":
            return <FacilityItem key={trimmedFacility} icon={ChildCare} color="#EE66A6" label="트렘폴린" />;
          case "물놀이장":
            return <FacilityItem key={trimmedFacility} icon={Pool} color="#009688" label="물놀이장" />;
          case "놀이터":
            return <FacilityItem key={trimmedFacility} icon={ChildCare} color="#673ab7" label="놀이터" />;
          case "산책로":
            return <FacilityItem key={trimmedFacility} icon={HikingIcon} color="#4caf50" label="산책로" />;
          case "운동장":
            return <FacilityItem key={trimmedFacility} icon={SportsSoccer} color="#ff5722" label="운동장" />;
          case "마트":
            return <FacilityItem key={trimmedFacility} icon={Store} color="#9e9e9e" label="마트" />;
          case "편의점":
            return <FacilityItem key={trimmedFacility} icon={Store} color="#607d8b" label="편의점" />;
          default:
            return null;
        }
      })}
    </Box>
  );
}

export default Facilities;