import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const Api = createApi({
    reducerPath: "Api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4001"
    }),

    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            })
        }),

        loginUser: builder.mutation({
            query: (user) => ({
                url: "/users/login",
                method: "POST",
                body: user,
            })
        }),

     

        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload,
            })
        })
    })
});

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation } = Api;

export default Api;