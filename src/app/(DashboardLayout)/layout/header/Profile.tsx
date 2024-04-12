import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { IconListCheck, IconMail, IconUser,IconWallet, IconDiscountCheck  } from "@tabler/icons-react";
import createAxiosInstance from "@/app/axiosInstance";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ProfileName from "./ProfileName";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppselector } from "@/redux/store";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [verified,setVerified] = useState()
  const [loading, setLoading] = useState(true);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const router = useRouter();
  const { image,_id } = useAppselector((state) => state?.user.value);
  const axiosInstance = createAxiosInstance();
  const handleLogout = async () => {
    try {
      setLoader(true);
      const axiosIntance = createAxiosInstance();
      const response = await axiosIntance.post(`user/logout`);
      localStorage.clear();
      const cookies = Cookies.get();
      for (const cookie in cookies) {
        Cookies.remove(cookie);
      }
      router.push("/authentication/login");
    } catch {
      console.log("error occured");
    } finally {
      setLoader(false);
    }
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery("(max-width: 575px)");
  const isBiggerMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );

 
  
  const getVerified = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/get-verified/${_id}`
      );

      const newData = response?.data?.data?.isBusinessVerified;
      
      setVerified(newData);
      setLoading(false);
    } catch (error: any) {
      console.log(error)
      setLoading(false);
    }
  };

  useEffect(() => {
    if (_id) {
      getVerified();
    }
  }, [_id]);
  
  return (
    <Box
      sx={{
        ...(isMobile && {
          width: "20%",
        }),
      }}
    >
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={image || "/images/profile/user-1.jpg"}
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 ,display:"flex"}}>
          {/* <Typography variant="subtitle2" noWrap>
            {basicDetails?.firstName} {basicDetails?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {basicDetails?.email}
          </Typography> */}
          <ProfileName />  {verified && (
        <div className="icon-wrapper">
          <IconDiscountCheck
            style={{ fill: 'blue',color:"white",height:"40px",width:"40px"
         }}
          />
        </div>
      )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem onClick={() => router.push('/profile')}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText
          >

            My Profile

          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/wallet-info')}>
          <ListItemIcon>
            <IconWallet width={20} />
          </ListItemIcon>
          <ListItemText
          >

           Wallet

          </ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Box>
            <LoadingButton
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleLogout}
              loading={loader}
            >
              Logout
            </LoadingButton>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
