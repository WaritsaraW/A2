'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type SuggestionType = 'brand' | 'model' | 'carType';

interface SuggestionItem {
  type: SuggestionType;
  text: string;
  icon?: string;
}

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Fetch suggestions based on the query
    const fetchSuggestions = async () => {
      try {
        // We'll use a simple fetch to get suggestions from our API
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const data = await response.json();
        
        // Transform the data into the format we need
        const transformedSuggestions: SuggestionItem[] = [];
        
        // Add brand suggestions first
        if (data.brands && data.brands.length > 0) {
          data.brands.forEach((brand: string) => {
            transformedSuggestions.push({
              type: 'brand' as SuggestionType,
              text: brand,
            });
          });
        }
        
        // Add model suggestions
        if (data.models && data.models.length > 0) {
          data.models.forEach((model: string) => {
            transformedSuggestions.push({
              type: 'model' as SuggestionType,
              text: model,
            });
          });
        }
        
        // Add car type suggestions
        if (data.carTypes && data.carTypes.length > 0) {
          data.carTypes.forEach((type: string) => {
            transformedSuggestions.push({
              type: 'carType' as SuggestionType,
              text: type,
            });
          });
        }
        
        setSuggestions(transformedSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        
        // Fallback to simple filtering just so we have something
        // This will be replaced by actual API data in production
        const fallbackSuggestions: SuggestionItem[] = [
          { type: 'brand' as SuggestionType, text: 'Toyota' },
          { type: 'brand' as SuggestionType, text: 'Honda' },
          { type: 'brand' as SuggestionType, text: 'Ford' },
          { type: 'model' as SuggestionType, text: 'Corolla' },
          { type: 'model' as SuggestionType, text: 'Civic' },
          { type: 'model' as SuggestionType, text: 'Mustang' },
          { type: 'carType' as SuggestionType, text: 'Sedan' },
          { type: 'carType' as SuggestionType, text: 'SUV' },
          { type: 'carType' as SuggestionType, text: 'Coupe' }
        ].filter(item => 
          item.text.toLowerCase().includes(query.toLowerCase())
        );
        
        setSuggestions(fallbackSuggestions);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchTerm: string = query) => {
    if (searchTerm.trim() === '') return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  // Highlight matching text in suggestion
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="font-bold text-primary">{part}</span> : part
    );
  };

  // Icon for the suggestion type
  const getSuggestionIcon = (type: SuggestionType) => {
    switch (type) {
      case 'brand':
        return (
          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'model':
        return (
          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case 'carType':
        return (
          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for cars, brands, or models..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors"
        />
        {query && (
          <button
            className="absolute right-12 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <button
          className="absolute right-3 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          onClick={() => handleSearch()}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
      
      {showSuggestions && query.trim() !== '' && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md mt-2 shadow-lg z-10 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-600">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading suggestions...
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {getSuggestionIcon(suggestion.type)}
                  {highlightMatch(suggestion.text, query)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-600 flex items-center">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox; 