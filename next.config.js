/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  images: {
    domains:["slcm-prod-public-s3.s3.ap-south-1.amazonaws.com","slcm-dev-public-s3.s3.ap-south-1.amazonaws.com","slcm-prod-public-s3-new.s3.ap-south-1.amazonaws.com"]
},
};

module.exports = nextConfig;
