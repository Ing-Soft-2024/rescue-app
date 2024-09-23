import React, { createContext } from 'react';
import * as Location from 'expo-location';

// Definimos el tipo del valor que aceptará el contexto
type UserLocationContextType = {
  location: Location.LocationObject | null;
  setLocation: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>;
};

// Creo el contexto y le paso el tipo que definimos
export const userLocationContext = createContext<UserLocationContextType | null>(null);


// import { createContext } from 'react';

// export const userLocationContext = createContext(null);




