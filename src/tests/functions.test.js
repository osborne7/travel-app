import { getCountryName } from '../client/js/countryCodes.js'
import { formatDate } from '../client/js/formatDate.js'
import { defineI } from '../client/js/utilityFunctions.js'

test('getCountryName exists', () => {
    expect(getCountryName).toBeDefined();
});

test('getCountryName is recognized as a function', () => {
    expect(typeof getCountryName).toBe('function');
});

test('formatDate exists', () => {
    expect(formatDate).toBeDefined();
});

test('formatDate is recognized as a function', () => {
    expect(typeof formatDate).toBe('function');
});

test('defineI exists', () => {
    expect(defineI).toBeDefined();
});

test('defineI is recognized as a function', () => {
    expect(typeof defineI).toBe('function');
});

test('test Country Code checker functionality', () => {
    expect(getCountryName('ES')).toBe('Spain');
    expect(getCountryName('ESTA')).toBe('ESTA');
});