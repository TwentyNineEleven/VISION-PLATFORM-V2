import React, { useState, useRef, ReactNode } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';
import { Icon } from '../icons/Icon';
import { Button } from './Button';

export interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  label,
  helperText,
  error,
  required,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  className = '',
  style,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    let validFiles = fileArray;

    if (maxSize) {
      validFiles = validFiles.filter((file) => file.size <= maxSize);
    }

    if (maxFiles && value.length + validFiles.length > maxFiles) {
      validFiles = validFiles.slice(0, maxFiles - value.length);
    }

    const newFiles = multiple ? [...value, ...validFiles] : validFiles.slice(0, 1);
    onChange?.(newFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    ...style,
  };

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${error ? semanticColors.borderError : dragActive ? semanticColors.borderBrand : semanticColors.borderPrimary}`,
    borderRadius: radius.md,
    padding: spacing['6xl'],
    textAlign: 'center',
    backgroundColor: dragActive ? semanticColors.backgroundSurfaceSecondary : semanticColors.backgroundSurface,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div className={className} style={containerStyle}>
      {label && (
        <label
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textSecondary,
            marginBottom: spacing.xs,
            display: 'block',
          }}
        >
          {label}
          {required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <div
        style={dropZoneStyle}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <Icon name="upload" size={48} color={semanticColors.textTertiary} />
        <div
          style={{
            marginTop: spacing.md,
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-md)',
            color: semanticColors.textPrimary,
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Drag and drop files here, or click to select
        </div>
        {maxSize && (
          <div
            style={{
              marginTop: spacing.xs,
              fontSize: 'var(--font-size-sm)',
              color: semanticColors.textTertiary,
            }}
          >
            Max file size: {formatFileSize(maxSize)}
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div style={{ marginTop: spacing['3xl'] }}>
          {value.map((file, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.md,
                backgroundColor: semanticColors.backgroundSurfaceSecondary,
                borderRadius: radius.sm,
                marginBottom: spacing.xs,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flex: 1 }}>
                <Icon name="download" size={20} color={semanticColors.textSecondary} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-family-body)',
                      fontSize: 'var(--font-size-sm)',
                      color: semanticColors.textPrimary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-family-body)',
                      fontSize: 'var(--font-size-xs)',
                      color: semanticColors.textTertiary,
                    }}
                  >
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: spacing.xs,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Remove file"
              >
                <Icon name="close" size={16} color={semanticColors.textError} />
              </button>
            </div>
          ))}
        </div>
      )}
      {(error || helperText) && (
        <div
          style={{
            marginTop: spacing.md,
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textTertiary,
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

