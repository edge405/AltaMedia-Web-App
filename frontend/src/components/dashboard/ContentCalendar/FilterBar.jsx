import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FilterBar({ filters, onFilterChange, postCount }) {
    const handleSearchChange = (value) => {
        onFilterChange({ searchTerm: value });
    };

    const handleStatusChange = (value) => {
        onFilterChange({ status: value });
    };

    const handlePlatformChange = (value) => {
        onFilterChange({ platform: value });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search posts..."
                            value={filters.searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400 w-4 h-4" />
                        <Select value={filters.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Posts</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="posted">Posted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Platform Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400 w-4 h-4" />
                        <Select value={filters.platform || 'all'} onValueChange={handlePlatformChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Platforms</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Post Count */}
                <div className="text-sm text-gray-600">
                    {postCount} post{postCount !== 1 ? 's' : ''} found
                </div>
            </div>

            {/* Active Filters Display */}
            {(filters.searchTerm || filters.status !== 'all' || filters.platform !== 'all') && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Active filters:</span>

                    {filters.searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                            Search: "{filters.searchTerm}"
                        </span>
                    )}

                    {filters.status !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                            Status: {filters.status}
                        </span>
                    )}

                    {filters.platform && filters.platform !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                            Platform: {filters.platform}
                        </span>
                    )}

                    <button
                        onClick={() => onFilterChange({ searchTerm: '', status: 'all', platform: 'all' })}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
