import React from 'react';
import { Card } from '../../components/Card';
import { List, ListItem } from '../../components/List';
import { Icon } from '../../icons/Icon';
import { Button } from '../../components/Button';
import { spacing } from '../../theme';
import { semanticColors } from '../../theme';

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: Date;
  size: number;
  status: 'uploaded' | 'verified' | 'pending';
}

export interface DocumentVaultListProps {
  documents?: Document[];
  onDocumentClick?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const DocumentVaultList: React.FC<DocumentVaultListProps> = ({
  documents = [],
  onDocumentClick,
  onDownload,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Document Vault
      </div>
      <List>
        {documents.map((document) => (
          <ListItem
            key={document.id}
            onClick={() => onDocumentClick?.(document.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flex: 1 }}>
                <Icon name="download" size={20} color={semanticColors.textSecondary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: spacing.xs }}>
                    {document.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {document.type} • {formatFileSize(document.size)} • {document.uploadedDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
              {onDownload && (
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(document.id);
                  }}
                >
                  Download
                </Button>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

