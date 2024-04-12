"use client";
import React from 'react'
import styled from "@emotion/styled";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import Image from "next/image";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import VerticalShadesClosedOutlinedIcon from "@mui/icons-material/VerticalShadesClosedOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createAxiosInstance from "../../axiosInstance";
import {CircularProgress} from "@mui/material";
import { catalogType,marketplaceType } from '@/types/types';

export default function Catalogue() {
  const [catalogueData, setCatalogueData] = useState<catalogType[]>([]);
  const [marketPlace, setMarketPlace] = useState<marketplaceType[]>([]);
  const [loadingMarketPlace, setLoadingMarketPlace] = useState(true);
  const [loading, setLoading] = useState(true);

  const pathName = usePathname();
  const router = useRouter();

  async function fetchMarketPlace() {
    try {
      setLoadingMarketPlace(true);
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `businessListing/list?pageNumber=1&count=4&sortBy=name&sortOrder=1`
      );

      const newData = await response.data.data;

      setMarketPlace(newData);
      setLoadingMarketPlace(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
    }
  }

  const fetchCatalogue = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/productCatalog/catalogs_list?seeAll=true`
      );

      const newData = response.data.data;

      setCatalogueData(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  useEffect(() => {
    fetchMarketPlace();
  }, []);

  const handleQuery = (id: string) => {
    router.push(`/marketplace?catalogueId=${id}`);
  };

  return (
    <Grid container spacing={2} sx={{ marginX: "auto", paddingX: "30px" }}>
      <ToastContainer />
      <Box
        sx={{
          marginY: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontSize: 20,
            fontWeight: 400,

            letterSpacing: "0.25px",
            textAlign: "center",
            color: "#2B376E",
          }}
        >
          {" "}
          Home {pathName}
        </Typography>
      </Box>

      {/* CATELOGUES section STARTING */}

      <Box>
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 6, sm: 8, md: 12 }}
        >
          {catalogueData?.map((_: catalogType, index: number) => (
            <Grid
              item
              xs={10}
              sm={4}
              md={2}
              key={index}
              sx={{ cursor: "pointer" }}
            >
              {
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "20px",
                      paddingX: "5px",
                      paddingY: "10px",
                      backgroundColor: "#ffffff",

                      // width: 256.3,
                      // height: 99,

                      borderRadius: "12px",
                      color: "#FFFFFF",
                      marginY: "5px",
                    }}
                    onClick={() => handleQuery(_._id)}
                  >
                    <Image
                      alt="image"
                      src={_.icon}
                      width={62}
                      height={60}
                      style={{ paddingLeft: "10px" }}
                    />
                    <Typography
                      noWrap
                      sx={{
                        display: "inline-block",
                        width: "180px",
                        fontFamily: "Poppins",
                        fontSize: "17px",
                        fontWeight: 500,

                        letterSpacing: "0em",
                        textAlign: "left",
                        color: "#333542",
                      }}
                    >
                      {_.name}
                    </Typography>
                  </Box>
                </Paper>
              }
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "60px",
            marginBottom: "10px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: 20,
              fontWeight: 600,

              letterSpacing: "0.5px",
              textAlign: "left",
              color: "#2B305C",
            }}
          >
            Recently Listed
          </Typography>
          <Typography
            sx={{
              cursor: "pointer",
              fontFamily: "Poppins",
              fontSize: 16,
              fontWeight: 600,

              letterSpacing: "0em",
              textAlign: "center",
              color: "#2B376E",
            }}
          >
            View All
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {loadingMarketPlace && (
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // width: "100%",
                // height: "20vh",
                mx: "auto",
              }}
            >
              <CircularProgress  />
            </Box>
          )}

          {marketPlace.map((_, index: number) => (
            <Grid
              item
              xs={10}
              sm={4}
              md={3}
              key={index}
              sx={{ cursor: "pointer" }}
            >
              {
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    key={_.id}
                    sx={{
                      display: "flex",

                      gap: "2px",
                      paddingY: "10px",
                      paddingLeft: "10px",
                    }}
                  >
                    <Image
                      alt="image"
                      src={_.thumbnail}
                      height={155}
                      width={132}
                      style={{ borderRadius: "12px" }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "self-start",
                        justifyContent: "flex-start",
                        rowGap: "15px",
                        wordBreak: "unset",
                        paddingLeft: "8px",
                        paddingRight: "10px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#2B376E",
                          letterSpacing: "0em",
                          textAlign: "left",
                        }}
                      >
                        {_.name}
                      </Typography>
                      <Box
                        sx={{
                          // maxHeight: "30px",
                          // height: "30px",
                          display: "flex",
                          alignItems: "center",
                          color: "#BFC8D6",
                          gap: "5px",
                        }}
                      >
                        {" "}
                        <VerticalShadesClosedOutlinedIcon />
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#333542",
                            letterSpacing: "0em",
                          }}
                        >
                          {_.businessName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          // maxHeight: "30px",
                          // height: "30px",
                          display: "flex",
                          alignItems: "center",
                          color: "#BFC8D6",
                          gap: "5px",
                        }}
                      >
                        <LocationOnOutlinedIcon />
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#333542",

                            letterSpacing: "0em",
                            textAlign: "left",
                          }}
                        >
                          {_.address
                            .split(",")
                            .map(
                              (
                                part: string,
                                index: number,
                                parts: string[]
                              ) => {
                                const trimmedPart = part.trim();

                                if (index >= parts.length - 3) {
                                  if (index === parts.length - 3) {
                                    // Use a regex to remove "Division" from the part
                                    const withoutDivision = trimmedPart
                                      .replace(/\bDivision\b/i, "")
                                      .trim();
                                    return (
                                      <span key={index}>
                                        {withoutDivision}
                                        {index < parts.length - 1 ? ", " : ""}
                                      </span>
                                    );
                                  }
                                  return (
                                    <span key={index}>
                                      {trimmedPart}
                                      {index < parts.length - 1 ? ", " : ""}
                                    </span>
                                  );
                                }

                                return null;
                              }
                            )}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: "10px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            // width: 120,
                            // height: 26,
                            // top: 314,
                            // left: 355,
                            padding: "3.5px, 7px, 3.5px, 7px",
                            borderRadius: 25,
                            backgroundColor: "#F7F7F7",
                          }}
                        >
                          <Box
                            sx={{
                              paddingX: "6px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <StarBorderPurple500OutlinedIcon
                              sx={{
                                // width: 18,
                                // height: 18,
                                // top: 318,
                                // left: 361.59,
                                padding: "1.5px, 1.52px, 2.25px, 1.51px",
                                color: "#FFBB3F",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 12,
                                fontWeight: 500,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#333542",
                              }}
                            >
                              {_.ratings} Ratings
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            // width: 120,
                            // height: 26,
                            // top: 314,
                            // left: 479,
                            padding: "3.5px, 7px, 3.5px, 7px",
                            borderRadius: 25,
                            backgroundColor: "#F7F7F7",
                          }}
                        >
                          <Box
                            sx={{
                              paddingX: "6px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <QuestionAnswerOutlinedIcon
                              sx={{
                                // width: 15,
                                // height: 20,
                                // top: 317,
                                // left: 485.71,
                                padding: "3.33px, 1.67px, 3.33px, 1.67px",
                                Color: "#2B376E",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 12,
                                fontWeight: 500,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#333542",
                              }}
                            >
                              {_.enquiries} Enquires
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              }
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  );
}
