import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL of your backend server
const BASE_URL = "https://personal-finance-visualizer-dv9t.onrender.com/";

export const api = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // if cookies/session are used
  }),
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
  ],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => ({
        url: `general/user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getProducts: builder.query({
      query: () => ({
        url: "client/products",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getCustomers: builder.query({
      query: () => ({
        url: "client/customers",
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),

    getTransactions: builder.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),

    getGeography: builder.query({
      query: () => ({
        url: "client/geography",
        method: "GET",
      }),
      providesTags: ["Geography"],
    }),

    getSales: builder.query({
      query: () => ({
        url: "sales/sales",
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    getAdmins: builder.query({
      query: () => ({
        url: "management/admins",
        method: "GET",
      }),
      providesTags: ["Admins"],
    }),

    getUserPerformance: builder.query({
      query: (userId) => ({
        url: `management/performance/${userId}`,
        method: "GET",
      }),
      providesTags: ["Performance"],
    }),

    getDashboard: builder.query({
      query: () => ({
        url: "general/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;
