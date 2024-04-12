import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import createAxiosInstance from "@/app/axiosInstance";

type InitialState = {
    value: userState;
}

type userState = {
    _id: string,
    fcmToken: string[];
    firstName: string;
    lastName: string;
    mobile: string;
    email: string,
    mobilePrefix: string;
    image: string;
    refreshToken: string;
    refreshTokenExpireTime: number;
    showReferral:boolean;
    userType: string;
    language: string;
    defaultBusinessId: string,
    address: Array<{ label: string; addressLine1: string; addressLine2: string; city: string; district: string; /*...other properties...*/ }>;
};

const initialState = {
    value: {
        _id: '',
        username: '',
        uid: '',
        isModerator: false,
        fcmToken: [],
        firstName: '',
        lastName: '',
        showReferral:true,
        email: '',
        mobile: '',
        mobilePrefix: '',
        image: '',
        refreshToken: '',
        refreshTokenExpireTime: 0,
        userType: '',
        language: '',
        // defaultBusinessId: '',
        defaultBusinessId: typeof window !== 'undefined' ? localStorage.getItem("GlobalBusinessId") || '' : '',
        address: [],
    } as userState,
} as InitialState;


export const getUserDetailsAsync: any = createAsyncThunk(
    "user/setUser",
    async () => {
        try {
            const axiosInstance = createAxiosInstance();
            const apiRes = await axiosInstance.get(`user`);
            // console.log('From slice',apiRes.data.data)
            return apiRes.data.data;
        } catch (error) {
            throw error;
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setDefaultBusinessId: (state, action: PayloadAction<string>) => {
            // debugger;
            state.value.defaultBusinessId = action.payload;
            // localStorage.setItem("GlobalBusinessId", action.payload);
            // console.log("Updated GlobalBusinessId in localStorage:", action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetailsAsync.fulfilled, (state, action) => {
                const currentDefaultBusinessId = state.value.defaultBusinessId;
                if (state.value.defaultBusinessId) {
                    state.value = {
                        ...action.payload,
                        defaultBusinessId: currentDefaultBusinessId,
                    };
                } else {
                    state.value = action.payload;
                }
            });
    },
});

export const { setDefaultBusinessId } = userSlice.actions;
export default userSlice.reducer;