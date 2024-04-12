import { useMediaQuery, Box, Drawer } from "@mui/material";
import Logo from "@/img/Logo.png";
import Image from "next/image";
import SidebarItems from "./SidebarItems";
import { styled } from "@mui/material";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const sidebarWidth = "176px";

  const BoxStyled = styled(Box)(() => ({
    height: "88px",
    width: "86%",
    overflow: "hidden",
    display: "block",
    padding: "17px 21px",
    textAlign: "center",
  }));

  const isMobileTabs = useMediaQuery("(max-width: 767px)");

  if (lgUp) {
    return (
      <Box
        className="nox"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRadius: "13px",
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          className="asider"
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              backgroundColor: "#2B305C",
              boxShadow: "0 9px 17.5px rgb(0,0,0,0.05)",
              width: sidebarWidth,
              boxSizing: "border-box",
              borderRight: 0,
              top: 0,
              left: 0,
              bottom: 0,
              borderRadius: "0px 50px 50px 0px",
              height: "100%",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <BoxStyled>
              <Image alt="logo" src={Logo} width={50} height={50} />
            </BoxStyled>
            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      className="mobile-sider"
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
          background: "#2b305c",
          borderRadius: "0 50px 50px 0",
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box
        px={2}
        style={{
          ...(isMobileTabs && {
            paddingTop: "20px",
            paddingBottom: "15px",
            textAlign: "center",
          }),
        }}
      >
        <Image alt="logo" src={Logo} width={50} height={50} />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
    </Drawer>
  );
};

export default Sidebar;
