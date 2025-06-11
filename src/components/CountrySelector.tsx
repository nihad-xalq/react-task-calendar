import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 4px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-height: 250px;
  }

  @media (max-width: 480px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 75vh;
    margin: 0;
    border-radius: 16px 16px 0 0;
    border: none;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const Option = styled.div<{ isHighlighted: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${props => props.isHighlighted ? '#f5f5f5' : 'transparent'};
  transition: background-color 0.2s;
  color: #333;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

interface Country {
  countryCode: string;
  name: string;
}

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountryName = countries.find(c => c.countryCode === selectedCountry)?.name || '';

  useEffect(() => {
    setSearchTerm(selectedCountryName);
  }, [selectedCountryName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(selectedCountryName);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCountryName]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        e.preventDefault();
        break;
      case 'Enter':
        if (filteredCountries[highlightedIndex]) {
          onSelect(filteredCountries[highlightedIndex].countryCode);
          setIsOpen(false);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm(selectedCountryName);
        e.preventDefault();
        break;
    }
  };

  const handleOptionClick = (countryCode: string) => {
    onSelect(countryCode);
    setIsOpen(false);
  };

  return (
    <Container ref={containerRef}>
      <Input
        type="text"
        id="country-search"
        name="country-search"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search country..."
      />
      <Dropdown isOpen={isOpen}>
        {filteredCountries.map((country, index) => (
          <Option
            key={country.countryCode}
            isHighlighted={index === highlightedIndex}
            onClick={() => handleOptionClick(country.countryCode)}
          >
            {country.name} ({country.countryCode})
          </Option>
        ))}
        {filteredCountries.length === 0 && (
          <Option isHighlighted={false}>
            No countries found
          </Option>
        )}
      </Dropdown>
    </Container>
  );
}; 