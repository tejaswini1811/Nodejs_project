"use client";
import React, { useEffect, useState } from "react";
import createAxiosInstance from "@/app/axiosInstance";
import { useAppselector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setDefaultBusinessId } from "@/redux/features/userSlice";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

function DefaultBuiness() {
  const [businessDetails, setBusinessDetails]: any = useState([]);

  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const dispatch = useDispatch();
  let businessId = defaultBusinessId;
  const fetchBUsinessDetails = async () => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.get(`business/all_business`);
      setBusinessDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching business listings:", error);
    }
  };

  useEffect(() => {
    fetchBUsinessDetails();
  }, []);

  // useEffect(() => {
  //   const storedBusinessId = localStorage.getItem("GlobalBusinessId");
  //   console.log("Stored Business ID:", storedBusinessId);
  //   if (storedBusinessId) {
  //     dispatch(setDefaultBusinessId(storedBusinessId));
  //   }
  // }, [dispatch]);

  const handleChange = (e: any) => {
    const newBusinessId = e.target.value;
    businessId = e.target.value;
    dispatch(setDefaultBusinessId(newBusinessId));
    localStorage.setItem("GlobalBusinessId", newBusinessId);

  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery("(max-width: 575px)");
  const isBiggerMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );

  return (
    <Box
      sx={{
        ...(isMobile && {
          width: "60%",
        }),
      }}
    >
      <FormControl size="small" sx={{ width: "100%" }}>
        <InputLabel htmlFor="business">Business</InputLabel>
        <Select
          id="business"
          name="business"
          label="Business"
          placeholder="Business"
          sx={{ minWidth: "15rem" }}
          value={businessId}
          defaultValue={businessId}
          onChange={handleChange}
          style={{
            ...(isMobile && {
              width: "100%",
              minWidth: "100%",
            }),
          }}
        >
          {businessDetails?.map((option: any) => (
            <MenuItem key={option._id} value={option._id}>
              {option.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default DefaultBuiness;
