import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { OrdersProvider, useOrders } from '@/src/context/ordersContext';
import ShoppingCartScreen from '../shoppingCartScreen';

jest.mock('@/src/context/ordersContext', () => ({
  ...jest.requireActual('@/src/context/ordersContext'),
  useOrders: jest.fn(),
}));

describe('shopping cart test', () => {
  beforeEach(() => {
    useOrders.mockReturnValue({
      cart: [
        {
          product: {
            productId: 1,
            name: 'Product 1',
            price: 10,
            description: 'Description 1',
            category: 'Category 1',
            image: 'image1.jpg',
          },
          quantity: 2,
        },
        {
          product: {
            productId: 2,
            name: 'Product 2',
            price: 20,
            description: 'Description 2',
            category: 'Category 2',
            image: 'image2.jpg',
          },
          quantity: 1,
        },
      ],
      total: 40,
      setOrderQR: jest.fn(),
    });
  });

  it('renders the shopping cart screen', () => {
    render(
      <OrdersProvider>
        <ShoppingCartScreen />
      </OrdersProvider>
    );
    
    expect(screen.getByText('Product 1')).toBeTruthy();


    //este va a fallar
    expect(screen.getByText('Product 2')).toBeFalsy();
  });
});