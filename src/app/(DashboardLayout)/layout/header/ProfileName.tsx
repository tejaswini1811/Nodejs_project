import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useAppselector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { getUserDetailsAsync } from "@/redux/features/userSlice";
import createAxiosInstance from "@/app/axiosInstance";
import TermsAndConditionsPopup from "../../terms-condition/page";
import { useRouter } from "next/navigation";
// import AuthRegister from "@/app/authentication/auth/AuthRegister";
// import TermsAndConditionsPopup from "@/app/DashboardLayout/terms-condition/page";

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  onOtpVerified?: () => void;
}

function ProfileName() {
  const [userDetails, setUserDetails] = useState();
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [updated,setUpdated] = useState({})
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getUserDetailsAsync());
  }, [dispatch]);

  const { firstName, lastName, _id } = useAppselector(
    (state) => state.user.value
  );

  const axiosInstance = createAxiosInstance();
  const fetchAcceptStatus = async () => {
    try {
      const response = await axiosInstance.get(`/terms-and-condition/${_id}`);
      const res = response?.data?.data?.termsAndConditionAccepted;
      if (!res) {
        router.push("/terms-condition");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const updateVerified = async () => {
    try {
     const response = await axiosInstance.get(
        `/user/update-verified`
      );

      const newData = response.data.data;
      setUpdated(newData);
      setLoading(false);
    } catch (error: any) {
      console.log(error)
      setLoading(false);
    }
  };

  useEffect(() => {
      updateVerified();
  }, []);
  
  useEffect(() => {
    if (_id) {
      fetchAcceptStatus();
    }
  }, [_id]);
  
  return (
    <div>
      <Typography
        sx={{
          marginLeft: "2px",
          fontFamily: "Poppins",
          fontSize: 20,
          fontWeight: 500,

          letterSpacing: "0em",
          textAlign: "left",
          color: "#2B376E",
          marginRight: "-20px",
        }}
      >
        {firstName} {lastName}
      </Typography>
    </div>
  );
}

export default ProfileName;
