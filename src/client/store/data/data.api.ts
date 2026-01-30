import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../config/api";

const dataApi = createApi({
  reducerPath: "dataApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPeriods: builder.query<GetPeriodsResponse, void>({
      query: () => `admin/exam/periods`,
    }),
    getBatches: builder.query<GetBatchesResponse, GetBatchesPayload>({
      query: () => `admin/exam/views/batches`,
    }),
    getSlots: builder.query<GetSlotsResponse, GetSlotsPayload>({
      query: () => `admin/exam/views/slots`,
    }),
    getAccounts: builder.query<GetAccountsResponse, GetAccountsPayload>({
      query: ({ periodId, batchId, locationId, slotId }) => ({
        url: `admin/search/accounts?periodId=${periodId}&batchId=${batchId}&locationId=${locationId}&slotId=${slotId.join("&slotId=")}&pageSize=10000&registrationStatus=PAID`,
      }),
    }),
  }),
});

export default dataApi;
