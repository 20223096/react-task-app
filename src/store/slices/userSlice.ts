import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    email : '',
    id : ''
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : { //user데이터를 넣어주기 위해
        setUser : (state, action) => {
            state.email = action.payload.email;
            state.id = action.payload.id;
        },
        removeUser : (state) => {
            state.email = '';
            state.id = '';
        }
    }
})
export const {setUser, removeUser} = userSlice.actions;
export const userReducer = userSlice.reducer;