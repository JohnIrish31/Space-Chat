import { createSlice } from "@reduxjs/toolkit";
import Api from "../service/Api";

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.newMessages[payload]) {
                state.newMessages[payload] = state.newMessages[payload] + 1
            } else {
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            delete state.newMessages[payload];
        },
    },

    extraReducers: ( builder ) => {
        // save user after register
        builder.addMatcher(Api.endpoints.registerUser.matchFulfilled, (state, { payload }) => payload);
        // save user after login
        builder.addMatcher(Api.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
        // logout user session
        builder.addMatcher(Api.endpoints.logoutUser.matchFulfilled, () => null );
    }
})

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;