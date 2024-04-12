"use client";
import React, { useState } from "react";
import { Typography, Button, Checkbox, Box } from "@mui/material";
import createAxiosInstance from "@/app/axiosInstance";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

function TermsAndConditionsPopup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const validationSchema = Yup.object().shape({
    acceptCheckbox: Yup.boolean()
      .oneOf([true], "Please agree to the terms and conditions.")
      .required(), // Add required validation
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAccept = async (values: any) => {
    console.log("Submitting form...");
    const axiosInstance = createAxiosInstance();
    try {
      if (values.acceptCheckbox === true) {
        const response = await axiosInstance.post(
          `/terms-and-condition/capture-user-version`,

          {
            latitude: "123456",
            longitude: "123456",
          }
        );
        if (response.status === 200) {
          handleClose();
          router.push("/");
        } else {
          console.error("Unexpected response status:", response.status);
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      acceptCheckbox: false,
    },
    validationSchema: validationSchema,
    onSubmit: handleAccept,
  });

  return (
    <>
      {isOpen && (
        <PageContainer>
          <DashboardCard>
            <>
              <form onSubmit={formik.handleSubmit}>
                <iframe
                  title="Terms and Conditions"
                  src="https://agriai.app/termsandconditions/"
                  width="100%"
                  height="500px"
                  style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                />

                <Box
                  sx={{
                    padding: "10px 0px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ padding: "0px" }}
                      id="acceptCheckbox"
                      name="acceptCheckbox"
                      checked={formik.values.acceptCheckbox}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Typography variant="body2">
                      I agree to the terms and conditions
                    </Typography>
                  </Box>
                  {formik.touched.acceptCheckbox &&
                  formik.errors.acceptCheckbox ? (
                    <Typography color="error" sx={{ fontSize: "14px" }}>
                      {formik.errors.acceptCheckbox}
                    </Typography>
                  ) : null}
                </Box>
                <Box>
                  <Button type="submit" variant="contained" color="primary">
                    Accept
                  </Button>
                </Box>
              </form>
            </>
          </DashboardCard>
        </PageContainer>
      )}
    </>
  );
}

export default TermsAndConditionsPopup;
