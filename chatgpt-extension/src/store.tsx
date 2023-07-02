import { createSlice,configureStore } from "@reduxjs/toolkit";


async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab
}

const isEnabled = localStorage.getItem('isEnabled')

export const slice = createSlice({
    name: 'chatgpt',
    initialState: {
      activeTab : getCurrentTab(),
      isEnabled,
    },
    reducers: {
      
    }
  })

export const { } = slice.actions;
export default configureStore({
    reducer: slice.reducer
});