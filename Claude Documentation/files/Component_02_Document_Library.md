# Component Build Guide: Document Library

**Component**: Document Library (Centralized Document Management)  
**Priority**: CRITICAL - Priority #1 Feature  
**Estimated Time**: 3-4 days  
**Dependencies**: File Upload UI, Search/Filter Components  
**Figma Design**: [Link to be added]

---

## 🔬 PHASE 1: RESEARCH & BEST PRACTICES

### Research Summary: Document Management Systems for SaaS

**Sources**: UX Design Patterns, Google Drive Design, Dropbox Paper, Glow UI Components

#### Key Research Findings:

**1. Document Library UX Patterns**
- **View Modes**: List view (default for power users), Grid view (visual for images/PDFs)
- **Search Prominence**: Search should be immediately visible, support real-time filtering
- **Categories/Folders**: Clear visual hierarchy, expandable/collapsible
- **Quick Actions**: Upload, Create, Sort, Filter should be one click away
- **Preview Pane**: Optional side panel for document preview without opening

**2. File Upload Best Practices**
- **Drag & Drop**: Primary upload method (70% of users prefer this)
- **Multiple File Support**: Allow batch uploads
- **Progress Indicators**: Show upload progress for each file
- **File Type Validation**: Clear error messages for unsupported types
- **Size Limits**: Display limits clearly (e.g., "Max 50MB per file")

**3. Search & Filter Design**
- **Search Bar Placement**: Top-center or top-right, minimum 300px wide
- **Live Search**: Show results as user types (debounce 300ms)
- **Filter Pills**: Visual tags that can be removed with X button
- **Advanced Filters**: Hidden by default, accessible via "Filters" button
- **Search History**: Recent searches for quick re-access

**4. Document Card Design**
- **Thumbnail**: 100-150px square for visual identification
- **Metadata Display**: Filename, type, size, upload date, uploaded by
- **Actions**: Download, Share, Delete (hidden until hover)
- **Status Indicators**: AI processing status, restricted access badge
- **Hover State**: Slight elevation, show action buttons

**5. AI Processing Indicators**
- **Processing State**: Spinner + "Processing..." text
- **Completed State**: Green checkmark + "Ready"
- **Failed State**: Red X + "Processing failed"
- **AI Metadata**: Display AI-generated summary, tags in subdued text

**6. Glow UI Design System for Document Management**
- Glow UI emphasizes variables and themes for maintaining design consistency
- Use Glow UI's card components for document cards
- Leverage Auto Layout 5.0 for responsive document grids
- Apply Glow UI's file upload patterns and progress bars
- Use Glow UI's search input with icon and clear button

---

## 🎨 DESIGN SPECIFICATIONS

### Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  HEADER BAR (64px)                                         │
│  📚 Document Library          [🔍 Search...] [+ Upload]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  TOOLBAR (48px)                                            │
│  [View: List ▾] [Sort: Recent ▾] [Filters ▾]             │
│                                                            │
│  SIDEBAR (240px)    │  MAIN CONTENT AREA                   │
│  ┌───────────────┐  │  ┌──────────────────────────────┐   │
│  │ 📁 Categories  │  │  │ [Document Card]              │   │
│  │               │  │  │ [Document Card]              │   │
│  │ ▾ All (156)   │  │  │ [Document Card]              │   │
│  │ ▸ Org Docs    │  │  │ [Document Card]              │   │
│  │   (23)        │  │  │ [Document Card]              │   │
│  │ ▸ Grants      │  │  │ [Document Card]              │   │
│  │   (15)        │  │  │ ...                          │   │
│  │ ▸ Financial   │  │  └──────────────────────────────┘   │
│  │   (8)         │  │                                      │
│  │ ▸ Programs    │  │  [Pagination: 1 2 3 ... 10 →]       │
│  │   (12)        │  │                                      │
│  │ ...           │  │                                      │
│  └───────────────┘  │                                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Document Card Specifications

```
┌─────────────────────────────────────┐
│  [Icon/Thumbnail]    [•••]          │ ← Actions menu (hover)
│                                     │
│  Strategic Plan 2025-2027.pdf      │ ← Title (truncate)
│  📊 Organizational • 2.4 MB        │ ← Category • Size
│  Uploaded 2 hours ago by Sarah     │ ← Timestamp • User
│                                     │
│  ✅ AI Summary: This strategic...  │ ← AI metadata (collapsed)
│  🏷️ Tags: planning, 2025, strategy │
│                                     │
│  [View] [Download] [Share]         │ ← Action buttons
└─────────────────────────────────────┘
```

### Upload Modal Design

```
┌─────────────────────────────────────┐
│  📤 Upload Documents           [×]  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │    📁 Drag files here         │ │
│  │    or click to browse         │ │
│  │                               │ │
│  │    Max 50MB per file          │ │
│  │    Supported: PDF, DOCX,      │ │
│  │    XLSX, TXT, MD              │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  OR                                 │
│                                     │
│  [Choose Files] [Choose Folder]    │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  📄 Strategic-Plan.pdf              │
│  ████████████░░░░░ 75% • 1.8MB     │
│                                     │
│  📊 Budget-2025.xlsx                │
│  ████████████████ 100% ✓           │
│                                     │
│  [Cancel Upload] [Upload All]      │
└─────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Step 1: Create Document Library Page

**File**: `src/app/documents/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentSidebar } from '@/components/documents/DocumentSidebar';
import { DocumentToolbar } from '@/components/documents/DocumentToolbar';
import { UploadModal } from '@/components/documents/UploadModal';
import { Search, Upload } from 'lucide-react';

// Mock data for development
const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Strategic Plan 2025-2027.pdf',
    fileType: 'pdf',
    fileSize: 2457600, // bytes
    category: 'organizational',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-11-19T10:30:00Z',
    tags: ['planning', '2025', 'strategy'],
    aiProcessed: true,
    aiSummary: 'This strategic plan outlines the organization\'s vision, mission, and goals for 2025-2027, focusing on youth education and community development.',
    thumbnail: '/api/placeholder/150/150',
  },
  {
    id: '2',
    title: 'Annual Budget FY2025.xlsx',
    fileType: 'xlsx',
    fileSize: 524288,
    category: 'financial_reports',
    uploadedBy: 'Michael Chen',
    uploadedAt: '2025-11-18T14:20:00Z',
    tags: ['budget', 'financial', '2025'],
    aiProcessed: true,
    aiSummary: 'Comprehensive budget breakdown for fiscal year 2025 including program costs, administrative expenses, and revenue projections.',
    thumbnail: '/api/placeholder/150/150',
  },
  {
    id: '3',
    title: 'Grant Proposal - Youth Program.docx',
    fileType: 'docx',
    fileSize: 1048576,
    category: 'grant_applications',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-11-17T09:15:00Z',
    tags: ['grant', 'youth', 'education'],
    aiProcessed: false, // Still processing
    aiSummary: null,
    thumbnail: '/api/placeholder/150/150',
  },
  // Add 10+ more mock documents for testing pagination
];

const MOCK_CATEGORIES = [
  { id: 'all', name: 'All Documents', count: 156 },
  { id: 'organizational', name: 'Organizational Documents', count: 23 },
  { id: 'grant_applications', name: 'Grant Applications', count: 15 },
  { id: 'financial_reports', name: 'Financial Reports', count: 8 },
  { id: 'program_reports', name: 'Program Reports', count: 12 },
  { id: 'policies_procedures', name: 'Policies & Procedures', count: 18 },
  { id: 'board_documents', name: 'Board Documents', count: 9 },
  { id: 'supporting_documentation', name: 'Supporting Documentation', count: 31 },
  { id: 'other', name: 'Other', count: 40 },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            📚 Document Library
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <DocumentSidebar
          categories={MOCK_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Main Area */}
        <div className="flex-1 p-6">
          {/* Toolbar */}
          <DocumentToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Document Grid/List */}
          <DocumentGrid
            documents={MOCK_DOCUMENTS}
            viewMode={viewMode}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/app/documents/page.tsx`
- [ ] Add MOCK_DOCUMENTS array (15+ documents)
- [ ] Add MOCK_CATEGORIES array
- [ ] Set up state management (search, category, view mode)
- [ ] Create page layout (header + sidebar + main content)
- [ ] Verify page renders at `/documents`

---

### Step 2: Build Document Sidebar

**File**: `src/components/documents/DocumentSidebar.tsx`

```typescript
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface DocumentSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function DocumentSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: DocumentSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['all']);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Categories
      </h3>

      <div className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div key={category.id}>
              <button
                onClick={() => {
                  onSelectCategory(category.id);
                  if (category.id !== 'all') {
                    toggleCategory(category.id);
                  }
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                  ${isSelected 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  {category.id !== 'all' && (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                  <span>{category.name}</span>
                </div>
                
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  {category.count}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Storage Usage (Optional) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">
          Storage Used
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-900 font-medium">4.2 GB</span>
          <span className="text-gray-500">of 25 GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '16.8%' }}></div>
        </div>
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/documents/DocumentSidebar.tsx`
- [ ] Implement category list with counts
- [ ] Add expand/collapse functionality (chevron icons)
- [ ] Highlight selected category
- [ ] Add storage usage indicator
- [ ] Style hover states

---

### Step 3: Build Document Toolbar

**File**: `src/components/documents/DocumentToolbar.tsx`

```typescript
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface DocumentToolbarProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export function DocumentToolbar({ viewMode, onViewModeChange }: DocumentToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        {/* View Mode Toggle */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${
              viewMode === 'grid'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        {/* Sort Dropdown */}
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Sort: Recent</option>
          <option>Sort: Name A-Z</option>
          <option>Sort: Name Z-A</option>
          <option>Sort: Largest First</option>
          <option>Sort: Smallest First</option>
        </select>

        {/* Filters Button */}
        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing 23 documents
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/documents/DocumentToolbar.tsx`
- [ ] Add view mode toggle (list/grid)
- [ ] Add sort dropdown (placeholder)
- [ ] Add filters button (placeholder)
- [ ] Display results count
- [ ] Style button states

---

### Step 4: Build Document Grid

**File**: `src/components/documents/DocumentGrid.tsx`

```typescript
import { DocumentCard } from './DocumentCard';

interface Document {
  id: string;
  title: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  aiProcessed: boolean;
  aiSummary: string | null;
  thumbnail: string;
}

interface DocumentGridProps {
  documents: Document[];
  viewMode: 'list' | 'grid';
  searchQuery: string;
  selectedCategory: string;
}

export function DocumentGrid({
  documents,
  viewMode,
  searchQuery,
  selectedCategory,
}: DocumentGridProps) {
  // Filter documents based on search and category
  let filteredDocuments = documents;

  if (searchQuery) {
    filteredDocuments = filteredDocuments.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  if (selectedCategory !== 'all') {
    filteredDocuments = filteredDocuments.filter(
      doc => doc.category === selectedCategory
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="text-lg mb-2">No documents found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        : 'space-y-3'
    }>
      {filteredDocuments.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/documents/DocumentGrid.tsx`
- [ ] Implement search filtering
- [ ] Implement category filtering
- [ ] Add empty state for no results
- [ ] Support both grid and list view modes
- [ ] Test with various filter combinations

---

### Step 5: Build Document Card

**File**: `src/components/documents/DocumentCard.tsx`

```typescript
import { Download, Share2, MoreVertical, FileText, FileSpreadsheet, File } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    fileType: string;
    fileSize: number;
    category: string;
    uploadedBy: string;
    uploadedAt: string;
    tags: string[];
    aiProcessed: boolean;
    aiSummary: string | null;
  };
  viewMode: 'list' | 'grid';
}

const FILE_TYPE_ICONS = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  default: File,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DocumentCard({ document, viewMode }: DocumentCardProps) {
  const Icon = FILE_TYPE_ICONS[document.fileType as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.default;
  
  const timeAgo = formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true });

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {document.title}
              </h3>
              
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                <span className="capitalize">{document.category.replace('_', ' ')}</span>
                <span>•</span>
                <span>{formatFileSize(document.fileSize)}</span>
                <span>•</span>
                <span>Uploaded {timeAgo} by {document.uploadedBy}</span>
              </div>

              {/* AI Summary */}
              {document.aiProcessed && document.aiSummary && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  ✅ {document.aiSummary}
                </p>
              )}

              {!document.aiProcessed && (
                <p className="text-xs text-amber-600 mt-2">
                  🔄 AI processing...
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
      {/* Icon/Thumbnail */}
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
        <Icon className="w-12 h-12 text-gray-600" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-900 truncate mb-2">
        {document.title}
      </h3>

      {/* Metadata */}
      <div className="text-xs text-gray-500 mb-2">
        <span className="capitalize">{document.category.replace('_', ' ')}</span>
        <span className="mx-1">•</span>
        <span>{formatFileSize(document.fileSize)}</span>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        {timeAgo}
      </div>

      {/* AI Summary (collapsed in grid) */}
      {document.aiProcessed && (
        <div className="text-xs text-gray-600 mb-2">
          ✅ AI processed
        </div>
      )}

      {!document.aiProcessed && (
        <div className="text-xs text-amber-600 mb-2">
          🔄 Processing...
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
        <button className="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors">
          View
        </button>
        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/documents/DocumentCard.tsx`
- [ ] Install date-fns: `npm install date-fns`
- [ ] Implement list view layout
- [ ] Implement grid view layout
- [ ] Add file type icons
- [ ] Format file sizes and timestamps
- [ ] Show AI processing status
- [ ] Add hover actions (download, share, more)
- [ ] Test both view modes

---

### Step 6: Build Upload Modal

**File**: `src/components/documents/UploadModal.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle, XCircle } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

export function UploadModal({ onClose }: UploadModalProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadingFile[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress (replace with actual upload logic)
    newFiles.forEach((uploadFile, index) => {
      simulateUpload(uploadingFiles.length + index);
    });
  };

  const simulateUpload = (fileIndex: number) => {
    const interval = setInterval(() => {
      setUploadingFiles(prev => {
        const updated = [...prev];
        if (updated[fileIndex]) {
          updated[fileIndex].progress += 10;
          
          if (updated[fileIndex].progress >= 100) {
            updated[fileIndex].progress = 100;
            updated[fileIndex].status = 'success';
            clearInterval(interval);
          }
        }
        return updated;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            📤 Upload Documents
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-blue-600' : 'text-gray-400'
            }`} />
            
            <p className="text-lg font-medium text-gray-900 mb-2">
              📁 Drag files here
            </p>
            <p className="text-sm text-gray-600 mb-4">
              or click to browse
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              accept=".pdf,.docx,.xlsx,.txt,.md"
            />

            <p className="text-xs text-gray-500 mt-4">
              Max 50MB per file • Supported: PDF, DOCX, XLSX, TXT, MD
            </p>
          </div>

          {/* Uploading Files List */}
          {uploadingFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                Uploading Files
              </h3>

              {uploadingFiles.map((uploadFile, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {uploadFile.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {uploadFile.status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadFile.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {uploadFile.status === 'success' && (
                    <p className="text-xs text-green-600">
                      ✓ Upload complete
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={uploadingFiles.length === 0}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/documents/UploadModal.tsx`
- [ ] Implement drag-and-drop functionality
- [ ] Add file input with multiple file support
- [ ] Create upload progress simulation
- [ ] Show uploading files list with progress bars
- [ ] Add file type validation
- [ ] Style modal with overlay
- [ ] Test drag-and-drop and click-to-browse

---

## 🧪 TESTING CHECKLIST

### Visual Testing
- [ ] Document library page renders at `/documents`
- [ ] Sidebar shows all categories with counts
- [ ] Document cards display correctly in both views
- [ ] Upload modal opens and closes properly
- [ ] Search bar is functional
- [ ] Toolbar controls work

### Functionality Testing
- [ ] Search filters documents correctly
- [ ] Category selection filters documents
- [ ] View mode toggle switches between list/grid
- [ ] File upload modal accepts files
- [ ] Progress bars animate during upload
- [ ] Document actions (download, share) are clickable

### Responsive Testing
- [ ] Mobile (375px): Sidebar collapses, single column
- [ ] Tablet (768px): 2-column grid view
- [ ] Desktop (1024px): 3-column grid view

### Edge Cases
- [ ] Empty state shows when no documents match filters
- [ ] Long file names truncate properly
- [ ] Large file sizes display correctly
- [ ] AI processing status shows accurately

---

## 📸 FIGMA DESIGN INTEGRATION

**PLACEHOLDER**: Add link to your Glow UI Figma design for this component

**Design Link**: `[TO BE ADDED]`

### Design Extraction Checklist
- [ ] Extract document card spacing
- [ ] Extract sidebar width and padding
- [ ] Match file type icons to design
- [ ] Confirm upload modal styling
- [ ] Match progress bar colors
- [ ] Verify tag pill styling

---

## ✅ COMPLETION CRITERIA

This component is COMPLETE when:
- [ ] Document library page accessible at `/documents`
- [ ] All mock documents display correctly
- [ ] Search and category filtering work
- [ ] Both list and grid views render properly
- [ ] Upload modal functional with drag-and-drop
- [ ] AI processing status indicators show
- [ ] Fully responsive across devices
- [ ] Matches Glow UI design system
- [ ] No console errors

---

**Last Updated**: November 19, 2025  
**Status**: Ready for Development  
**Figma Design**: [Pending]
