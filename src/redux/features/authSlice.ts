import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import createAxiosInstance from "@/app/axiosInstance";

type InitialState = {
    value: AuthState;
};

type AuthState = {
    isAuth: boolean;
    sessionId: string;
    mobile: string;
};

const initialState = {
    value: {
        isAuth: false,
        sessionId: "",
        mobile: "",
    } as AuthState,
};

type LoginPayload = {
    mobile: string;
};

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (payload: LoginPayload) => {
        try {
            const axiosInstance = createAxiosInstance();
            const apiRes = await axiosInstance.post("auth/otp_generate", {
                mobile: payload.mobile,
            });

            return apiRes.data;
        } catch (error) {
            throw error;
        }
    }
);

export const verifyOtpAsync = createAsyncThunk(
    "auth/verifyOtp",
    async (payload: { mobile: string, session_id: string, otp_input: string,language: string }) => {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.post("auth/otp_verify", {
                mobile: payload.mobile,
                session_id: payload.session_id,
                otp_input: payload.otp_input,
                fcmToken: '',
                language: payload.language,
                deviceId:  '',
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                const { status, data } = action.payload;

                if (status === "success" && data.Status === "Success") {
                    state.value = {
                        isAuth: true,
                        sessionId: data.Details,
                        mobile: action.meta.arg.mobile,
                    };
                }
            })
            .addCase(verifyOtpAsync.fulfilled, (state, action) => {
            });
    },
});

export default auth.reducer;
