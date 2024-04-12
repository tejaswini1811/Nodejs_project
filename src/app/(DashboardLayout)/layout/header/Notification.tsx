import React, { useEffect, useState } from "react";
import { IconBellRinging, IconMenu } from "@tabler/icons-react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useAppselector } from "@/redux/store";
import createAxiosInstance from "@/app/axiosInstance";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useMediaQuery from "@mui/material/useMediaQuery";

function Notification() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [notification, setNotification] = useState<any>();
  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const axiosInstance = createAxiosInstance();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    markAsSeen();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const markAsSeen = async () => {
    try {
      const response = await axiosInstance.put(
        `/notification/mark_as_read_webapp/${defaultBusinessId}`
      );
      fetchAllNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllNotification = async () => {
    try {
      const response = await axiosInstance.get("notification/list", {
        params: {
          sortBy: "createdAt",
          filterByReadStatus: "unread",
          sortOrder: -1,
          filterByBusiness: defaultBusinessId,
        },
      });
      setNotification(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllNotification();
    const intervalId = setInterval(fetchAllNotification, 60000);
    if (notification?.length === 0) {
      // console.log('stopped')
      return () => clearInterval(intervalId);
    }
    //eslint-disable-next-line 
  }, []);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery("(max-width: 575px)");
  const isBiggerMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );

  return (
    <div
      style={{
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
        onClick={handleClick}
      >
        <Badge color="primary" badgeContent={notification?.length}>
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box textAlign={"center"}>
          <h3>Notifications</h3>
        </Box>
        <Divider />
        {notification?.length > 0 &&
          notification?.map((item: any) => (
            <>
              <Paper sx={{ width: 300, my: 3, mx: 1 }} key={item._id}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Grid container direction="row" alignItems="center" xs={12}>
                    <Grid item xs={2}>
                      <NotificationsIcon
                        sx={{ fontSize: 36, color: "#2B376E" }}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h6" component="div">
                        {item.notification.title}
                      </Typography>
                      <Typography
                        my={1}
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {item.notification.body}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </>
          ))}
        {notification?.length === 0 && (
          <Paper sx={{ width: 300, my: 3, mx: 1 }} color={"Text.disabled"}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              color={"text.disabled"}
            >
              <Grid container direction="row" alignItems="center" xs={12}>
                <Grid item xs={2}>
                  <NotificationsIcon sx={{ fontSize: 36, color: "#2B376E" }} />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h6" component="div">
                    No data found
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Popover>
    </div>
  );
}

export default Notification;
