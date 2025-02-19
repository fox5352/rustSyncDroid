import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";

import { HomeMaxTwoTone, SyncAltTwoTone } from "@mui/icons-material";

function Rootlayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState("home");

  const map: Record<string, string> = {
    home: "/",
    sync: "/sync",
    "/": "home",
    "/sync": "sync",
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(map[newValue] || "/");
  };

  useEffect(() => {
    setValue(map[pathname] || "home");
  }, [pathname]);

  return (
    <Container
      sx={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Box sx={{ width: "100%", height: "94vh", margin: 0 }}>
        <Outlet />
      </Box>
      <BottomNavigation
        sx={{ height: "6vh" }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeMaxTwoTone />}
        />
        <BottomNavigationAction
          label="Sync"
          value="sync"
          icon={<SyncAltTwoTone />}
        />
      </BottomNavigation>
    </Container>
  );
}

export default Rootlayout;
