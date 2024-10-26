// __tests__/QRScreen.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import QRScreen from '../QRScreen';
import { useOrders } from '@/src/context/ordersContext';

jest.mock('./../../../src/context/ordersContext');

describe('QRScreen', () => {
  beforeEach(() => {
    (useOrders as jest.Mock).mockReturnValue({
      orderQR: "mocked-order-qr",
      setOrderQR: jest.fn(),
      clearCart: jest.fn(),
    });
  });

  it('renders QR code when orderQR is present', () => {
    render(<QRScreen />);
    expect(screen.getByText('Muestra este QR al comercio para retirar tu pedido. Por ahora updatear estado con swagger')).toBeTruthy();
  });

});