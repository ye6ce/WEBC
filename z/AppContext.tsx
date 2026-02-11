import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Action } from './types';

// Initial state now includes auth credentials
const initialState: AppState = {
products: [],
theme: { primaryColor: '#000000', fontFamily: 'Inter', logo: '', bannerText: 'Welcome' },
orders: [],
isAdmin: false,
auth: { email: '', password: '' }
};

const AppContext = createContext<any>(undefined);

function appReducer(state: AppState, action: any): AppState {
switch (action.type) {
case 'SET_STORE_DATA':
return { ...state, ...action.payload };
case 'LOGIN_ADMIN':
return { ...state, isAdmin: true, auth: action.payload };
case 'LOGOUT':
return { ...state, isAdmin: false, auth: { email: '', password: '' } };
default:
return state;
}
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [state, dispatch] = useReducer(appReducer, initialState);

// Load data from Neon when any user (admin or customer) opens the site
useEffect(() => {
fetch('/.netlify/functions/manage-store')
.then(res => res.json())
.then(data => {
if (data) dispatch({ type: 'SET_STORE_DATA', payload: data });
});
}, []);

// Secure Save Function
const saveGlobalData = async (updatedData: any) => {
const response = await fetch('/.netlify/functions/manage-store', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
data: updatedData,
email: state.auth.email,
password: state.auth.password
}),
});

if (response.ok) {
alert("Saved successfully! Visible on all devices.");
} else {
alert("Failed to save. Check your password.");
}
};

return (
<AppContext.Provider value={{ state, dispatch, saveGlobalData }}>
{children}
</AppContext.Provider>
);
};

export const useApp = () => useContext(AppContext);