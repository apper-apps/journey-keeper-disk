import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FileUpload = ({ 
  value, 
  onChange, 
  accept = "image/*", 
  className, 
  placeholder = "Upload an image...",
  ...props 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      onChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          dragOver 
            ? "border-primary-500 bg-primary-50" 
            : preview 
            ? "border-gray-300 bg-gray-50" 
            : "border-gray-300 hover:border-primary-400 hover:bg-primary-50",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          {...props}
        />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <ApperIcon name="X" size={12} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <ApperIcon name="Upload" size={24} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              {dragOver ? "Drop image here" : placeholder}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Drag & drop or click to browse
            </p>
          </div>
        )}
      </div>
      
      {value && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="File" size={16} />
          <span className="truncate">{value.name}</span>
          <span className="text-gray-400">
            ({(value.size / 1024).toFixed(1)} KB)
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;