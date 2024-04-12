import createAxiosInstance from "@/app/axiosInstance";

export const uploadFile = async (file: File) => {
    try {
        const axiosInstance = createAxiosInstance();
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post("upload/file", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const uploadedFileUrl: string = response.data.data.url;
        return uploadedFileUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
