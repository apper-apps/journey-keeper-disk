import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false,
  options = [],
  suggestions = [],
  className,
  children,
  ...props 
}) => {
const renderField = () => {
    if (type === "select") {
      return (
        <Select error={error} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    } else if (type === "textarea") {
      return <Textarea error={error} {...props} />;
    } else if (suggestions.length > 0) {
      return (
        <div className="relative">
          <Input type={type} error={error} list={`${props.name}-suggestions`} {...props} />
          <datalist id={`${props.name}-suggestions`}>
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        </div>
      );
    } else if (children) {
      return children;
    } else {
      return <Input type={type} error={error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;