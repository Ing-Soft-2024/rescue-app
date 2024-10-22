// screen tests

import * as React from 'react';
import renderer from 'react-test-renderer';

import { render } from '@testing-library/react-native';

import HomeScreen, { } from '@/app/screens/index';

import ProductLayout, { } from '@/app/screens/productScreen';

describe('<HomeScreen />', () => {
    it('renders correctly', () => {
        render(<HomeScreen />);
    });
});