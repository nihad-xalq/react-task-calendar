import axios from 'axios';
import type { Holiday } from '../types';

const BASE_URL = 'https://date.nager.at/api/v3';

export const api = {
  async getHolidays(year: number, countryCode: string): Promise<Holiday[]> {
    const response = await axios.get(`${BASE_URL}/PublicHolidays/${year}/${countryCode}`);
    return response.data;
  },

  async getAvailableCountries() {
    const response = await axios.get(`${BASE_URL}/AvailableCountries`);
    return response.data;
  },

  async getNextPublicHolidays(countryCode: string) {
    const response = await axios.get(`${BASE_URL}/NextPublicHolidays/${countryCode}`);
    return response.data;
  }
}; 