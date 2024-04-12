import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

// components
import Profile from "./Profile";
import { IconBellRinging, IconMenu } from "@tabler/icons-react";
import ProfileName from "./ProfileName";
import DefaultBuiness from "./DefaultBusiness";
import Notification from "./Notification";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: "#FFF",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: 13,
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery("(max-width: 575px)");
  const isBiggerMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled
        sx={{
          ...(isMobile && {
            flexDirection: "column",
          }),
          ...(isBiggerMobiles && {
            flexDirection: "row",
          }),
        }}
      >
        <Box sx={{ width: "25%" }}>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileSidebar}
            sx={{
              display: {
                lg: "none",
                xs: "inline",
                ...(isSmallMobiles && {
                  position: "absolute",
                  left: "6px",
                  top: "10px",
                }),
              },
            }}
          >
            <IconMenu width="20" height="20" />
          </IconButton>
        </Box>

        <Box flexGrow={1} />
        <Stack
          
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            ...(isMobile && {
              flexDirection: "row",
            }),
            ...(isSmallMobiles && {
              width: "78%",
            }),
          }}
        >
          <DefaultBuiness />
          <Notification />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
