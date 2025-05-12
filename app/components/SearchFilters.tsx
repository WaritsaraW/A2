'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters as SearchFiltersType } from '@/lib/models';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface SearchFiltersProps {
  carTypes: string[];
  brands: string[];
  initialFilters?: SearchFiltersType;
  onFilterChange?: (filters: SearchFiltersType) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  carTypes,
  brands,
  initialFilters,
  onFilterChange
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<SearchFiltersType>({
    carType: initialFilters?.carType || searchParams.get('carType') || '',
    brand: initialFilters?.brand || searchParams.get('brand') || '',
    query: initialFilters?.query || searchParams.get('query') || '',
  });

  // For real-time suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Update filters when URL params or initialFilters change
  useEffect(() => {
    setFilters({
      carType: initialFilters?.carType || searchParams.get('carType') || '',
      brand: initialFilters?.brand || searchParams.get('brand') || '',
      query: initialFilters?.query || searchParams.get('query') || '',
    });
  }, [searchParams, initialFilters]);

  // Handle clicks outside of the search component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!filters.query || filters.query.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    // Fallback to simple filtering
    const fallbackSuggestions: string[] = [];
    
    // Use carTypes and brands as fallback
    carTypes.forEach(type => {
      if (type.toLowerCase().includes((filters.query || '').toLowerCase())) {
        fallbackSuggestions.push(type);
      }
    });
    
    brands.forEach(brand => {
      if (brand.toLowerCase().includes((filters.query || '').toLowerCase())) {
        fallbackSuggestions.push(brand);
      }
    });
    
    setSuggestions(fallbackSuggestions);
  }, [filters.query, carTypes, brands]);

  const updateSearchParams = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    return params.toString();
  }, [searchParams]);

  const handleFilterChange = (name: keyof SearchFiltersType, value: string) => {
    // Update local state
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // If changing query, show suggestions
    if (name === 'query') {
      setShowSuggestions(true);
    }
    
    // Call the callback if provided
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearch = () => {
    // Update URL params and navigate
    let params = new URLSearchParams();
    
    if (filters.query) params.set('query', filters.query);
    if (filters.carType) params.set('carType', filters.carType);
    if (filters.brand) params.set('brand', filters.brand);
    
    const queryString = params.toString();
    
    // Determine which page we're on and act accordingly
    if (pathname === '/search') {
      router.push(`/search?${queryString}`);
    } else {
      // On home page (or other pages), apply filters directly
      router.push(`${pathname}?${queryString}`);
    }
    
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters({ ...filters, query: suggestion });
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    
    // Arrow up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
    
    // Enter to select
    if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIndex]);
    }
    
    // Escape to close suggestions
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleReset = () => {
    const newFilters = { carType: '', brand: '', query: '' };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    
    // Navigate to current page without params
    router.push(pathname);
  };

  // Handle form submission for search
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="filter-container">
        <div className="filter-group" ref={searchRef}>
          <label htmlFor="query" className="filter-label">
            Search
          </label>
          <div className="search-container">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              id="query"
              value={filters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="filter-input"
            />
            {showSuggestions && filters.query && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${index === selectedSuggestionIndex ? 'active' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Car Type Filter */}
        <div className="filter-group">
          <label htmlFor="carType" className="filter-label">
            Car Type
          </label>
          <Select
            value={filters.carType || "all"}
            onValueChange={(value) => handleFilterChange('carType', value === "all" ? "" : value)}
          >
            <SelectTrigger className="filter-select w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {carTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="filter-group">
          <label htmlFor="brand" className="filter-label">
            Brand
          </label>
          <Select
            value={filters.brand || "all"}
            onValueChange={(value) => handleFilterChange('brand', value === "all" ? "" : value)}
          >
            <SelectTrigger className="filter-select w-full">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="filter-actions">
          <Button 
            type="submit" 
            onClick={(e) => { e.preventDefault(); handleSearch(); }}
            className="btn-primary filter-search-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Button>
          
          <Button 
            type="button" 
            onClick={handleReset} 
            variant="outline"
            className="filter-reset-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters; 