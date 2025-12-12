import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8000/api";

// Define a service using a base URL and expected endpoints

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl  , prepareHeaders: async (headers) => {
    //window.clerk means accessing the Clerk instance from the global window object
    console.log("Preparing headers for API request...");
    const clerk = window.Clerk;
    if (clerk) {
      console.log("Clerk instance found.");
       const token = await clerk.session.getToken();

       console.log("Clerk Token:", token); // Log the token for debugging
       if(token) {
        // Set the Authorization header with the Clerk token
         headers.set("Authorization", `Bearer ${token}`);
       }
    }

    return headers;
}}),


  endpoints: (build) => ({
    getEnergyGenerationRecordsBySolarUnit: build.query({
      query: ({id, groupBy , limit}) => `/energy-generation-records/solar-unit/${id}?groupBy=${groupBy}&limit=${limit}`,
    }),
    
    // New endpoint to get solar unit by Clerk user ID
   getSolarUnitForUser : build.query ({
      query : () => `/solar-units/me`,
   }),
 
   // New endpoint to get all solar units
   getSolarUnits : build.query ({
    query : () => `/solar-units`,
  }),

  //endpoint to get solar unit by ID
  getSolarUnitById : build.query ({
    query : (id) => `/solar-units/${id}`,
  })
  }),

});


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetEnergyGenerationRecordsBySolarUnitQuery , 
  useGetSolarUnitForUserQuery ,
   useGetSolarUnitsQuery,
   useGetSolarUnitByIdQuery,
   } = api;