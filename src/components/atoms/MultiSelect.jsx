import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Brazil", "Bulgaria", "Cambodia",
  "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic", "Denmark", "Ecuador",
  "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore",
  "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
];

const MultiSelect = ({ value = [], onChange, placeholder = "Select countries...", className, required = false, error = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(country)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    onChange([...value, country]);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleRemove = (countryToRemove) => {
    onChange(value.filter(country => country !== countryToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && searchTerm === "" && value.length > 0) {
      handleRemove(value[value.length - 1]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "input-field min-h-[48px] h-auto cursor-text",
          "flex flex-wrap items-center gap-2 p-2",
          className
        )}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {value.map((country) => (
          <span
            key={country}
            className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-md"
          >
            {country}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(country);
              }}
              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
            >
              <ApperIcon name="X" size={12} />
            </button>
          </span>
        ))}
<input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className={cn("flex-1 min-w-[120px] outline-none bg-transparent", {
            "text-red-900": error
          })}
          onFocus={() => setIsOpen(true)}
          required={required}
          {...props}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                onClick={() => handleSelect(country)}
              >
                {country}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">
              {searchTerm ? "No matching countries" : "No more countries to select"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;