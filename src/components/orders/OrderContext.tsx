// import React, { createContext, useContext, useState } from 'react';
// import { ProductType } from '@/src/types/product.type';

// interface OrderContextProps {
//   order: ProductType[];
//   setOrder: (value: ProductType[]) => void;
// }

// const OrderContext = createContext<OrderContextProps | undefined>(undefined);

// interface OrderProviderProps {
//   children: React.ReactNode;
// }

// export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
//   const [order, setOrder] = useState<ProductType[]>([]);

//   return (
//     <OrderContext.Provider value={{ order, setOrder }}>
//       {children}
//     </OrderContext.Provider>
//   );
// };

// export const useOrder = () => {
//   const context = useContext(OrderContext);
//   if (!context) {
//     throw new Error('useOrder must be used within an OrderProvider');
//   }
//   return context;
// };