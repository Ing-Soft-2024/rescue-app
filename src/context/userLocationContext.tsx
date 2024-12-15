// src/context/userLocationContext.tsx
import React, { createContext } from 'react';
import * as Location from 'expo-location';

type UserLocationContextType = {
    location: Location.LocationObject | null;
    setLocation: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>;
};

export const userLocationContext = createContext<UserLocationContextType>({
    location: null,
    setLocation: () => {},
});