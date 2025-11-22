'use client';

import { useMemo, useState } from 'react';
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
  GlowButton,
  GlowInput,
  GlowBadge,
} from '@/components/glow-ui';
import { mockFiles, fileCategories, formatFileSize } from '@/lib/mock-data';
import {
  Upload,
  Download,
  Trash,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Search,
  HardDrive,
  Filter,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';

export default function FilesPage() {
  const [files, setFiles] = useState(mockFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | (typeof fileCategories)[number]['value']>('all');

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [files, searchQuery, categoryFilter]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes('document')) return <FileText className="w-8 h-8 text-blue-600" />;
    if (type.includes('spreadsheet')) return <FileText className="w-8 h-8 text-green-600" />;
    if (type.includes('presentation')) return <FileText className="w-8 h-8 text-orange-600" />;
    return <FileIcon className="w-8 h-8 text-gray-500" />;
  };

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);
  const storageLimit = 10 * 1024 * 1024 * 1024; // 10 GB
  const storagePercentage = (totalStorage / storageLimit) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Files</h1>
          <p className="text-gray-600">Manage and organize your documents</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlowButton variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Bulk actions
          </GlowButton>
          <GlowButton variant="default" glow="subtle" leftIcon={<Upload className="w-4 h-4" />}>
            Upload files
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard>
          <GlowCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <FileIcon className="w-10 h-10 text-blue-500" />
            </div>
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage used</p>
                <p className="text-2xl font-bold">{formatFileSize(totalStorage)}</p>
              </div>
              <HardDrive className="w-10 h-10 text-green-500" />
            </div>
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardContent className="p-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Storage limit</p>
                <p className="text-sm font-medium">{formatFileSize(storageLimit)}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{storagePercentage.toFixed(1)}% used</p>
            </div>
          </GlowCardContent>
        </GlowCard>
      </div>

      <GlowCard>
        <GlowCardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <GlowInput
              placeholder="Search files..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)}
              className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All categories</option>
              {fileCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Your files ({filteredFiles.length})</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          {filteredFiles.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="p-3 font-medium">File</th>
                    <th className="p-3 font-medium">Category</th>
                    <th className="p-3 font-medium">Size</th>
                    <th className="p-3 font-medium">Uploaded by</th>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b last:border-b-0">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <GlowBadge variant="secondary" size="sm">
                          {fileCategories.find((c) => c.value === file.category)?.label || file.category}
                        </GlowBadge>
                      </td>
                      <td className="p-3">{formatFileSize(file.size)}</td>
                      <td className="p-3">{file.uploaded_by}</td>
                      <td className="p-3">{new Date(file.uploaded_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <GlowButton
                            variant="ghost"
                            size="sm"
                            leftIcon={<Download className="w-4 h-4" />}
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            Download
                          </GlowButton>
                          <ConfirmDialog
                            title="Delete file"
                            description={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
                            triggerLabel="Delete"
                            triggerVariant="ghost"
                            triggerSize="sm"
                            triggerLeftIcon={<Trash className="w-4 h-4" />}
                            onConfirm={() => handleDelete(file.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No files found for the selected filters.</p>
              <GlowButton
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </GlowButton>
            </div>
          )}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}

