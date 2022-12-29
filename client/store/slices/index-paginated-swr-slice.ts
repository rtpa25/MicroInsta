import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SWRInfiniteResponse } from 'swr/infinite';

interface IndexPaginatedSWRState {
    swr: SWRInfiniteResponse<any, any> | null;
}

// Define the initial state using that type
const initialState: IndexPaginatedSWRState = {
    swr: null,
};

export const IndexPaginatedSWRSlice = createSlice({
    name: 'index-paginated-swr',

    initialState: initialState,

    reducers: {
        setSWR: (
            state,
            action: PayloadAction<SWRInfiniteResponse<any, any> | null>
        ) => {
            state.swr = action.payload;
        },
    },
});

export const { setSWR } = IndexPaginatedSWRSlice.actions;

export default IndexPaginatedSWRSlice.reducer;
