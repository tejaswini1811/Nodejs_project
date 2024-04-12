import React from "react";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import { categories } from "../lists/carousel";
import { styled } from "@mui/material";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";

const ImageStyled = styled(Image)(() => ({
  height: "300px",
  width: "400px",
}));

function Corsousell() {
  return (
    <div className="longer">
      <Carousel sx={{ minWidth: "78vh" }}>
        {categories.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              color="#2B305C"
              fontWeight={700}
              sx={{
                whiteSpace: "break-spaces",
                mt: "10px",
                fontSize: "30px",
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              // fontFamily="Poppins"
              sx={{
                whiteSpace: "break-spaces",
                marginBottom: "50px",
                marginTop: "25px",
                width: "350px",
                fontSize: "1rem",
              }}
            >
              {item.description}
            </Typography>
            <ImageStyled
              src={item.image}
              alt={item.title}
              width={400}
              height={300}
              sx={{ objectFit: "contain" }}
            />
          </Box>
        ))}
      </Carousel>
    </div>
  );
}

export default Corsousell;
