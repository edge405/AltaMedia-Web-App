import React, { useState, useMemo } from 'react';
import CalendarView from './ContentCalendar/CalendarView';
import PostModal from './ContentCalendar/PostModal';
import FilterBar from './ContentCalendar/FilterBar';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Grid3X3 } from 'lucide-react';

export default function ContentCalendarSection() {
    const [posts, setPosts] = useState([
        {
            id: '1',
            title: 'Product Launch Announcement',
            description: 'Exciting news about our new product line launching next month!',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            status: 'scheduled',
            media: [
                {
                    id: '1',
                    name: 'product-image.jpg',
                    type: 'image',
                    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+PC9zdmc+',
                    size: 1024000,
                    uploadedAt: new Date().toISOString()
                }
            ],
            platforms: {
                facebook: true,
                instagram: true,
                twitter: false,
                linkedin: true,
                tiktok: false,
                youtube: false
            },
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Weekly Newsletter',
            description: 'This week\'s updates and industry insights',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
            status: 'draft',
            media: [],
            platforms: {
                facebook: false,
                instagram: false,
                twitter: true,
                linkedin: true,
                tiktok: false,
                youtube: false
            },
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Customer Success Story',
            description: 'How our client achieved amazing results',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            status: 'posted',
            media: [
                {
                    id: '2',
                    name: 'success-video.mp4',
                    type: 'video',
                    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvPC90ZXh0Pjwvc3ZnPg==',
                    size: 2048000,
                    uploadedAt: new Date().toISOString()
                }
            ],
            platforms: {
                facebook: true,
                instagram: true,
                twitter: true,
                linkedin: false,
                tiktok: true,
                youtube: false
            },
            createdAt: new Date().toISOString()
        }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filters, setFilters] = useState({
        status: 'all',
        searchTerm: '',
        platform: 'all'
    });

    // Filter posts based on search term, status, and platform
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesStatus = filters.status === 'all' || post.status === filters.status;
            const matchesPlatform = filters.platform === 'all' ||
                (post.platforms && post.platforms[filters.platform]);
            return matchesSearch && matchesStatus && matchesPlatform;
        });
    }, [posts, filters]);

    const handleCreatePost = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
    };

    const handleSavePost = (postData) => {
        if (editingPost) {
            // Update existing post
            setPosts(prev => prev.map(post =>
                post.id === editingPost.id ? { ...postData, id: post.id } : post
            ));
        } else {
            // Create new post
            const newPost = {
                ...postData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            setPosts(prev => [...prev, newPost]);
        }
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handleDragDrop = (postId, newDate) => {
        setPosts(prev => prev.map(post =>
            post.id === postId ? { ...post, date: newDate } : post
        ));
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
                    <p className="text-gray-600 mt-1">Plan and manage your content schedule</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button
                            variant={viewMode === 'month' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('month')}
                            className="flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Month
                        </Button>
                        <Button
                            variant={viewMode === 'week' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('week')}
                            className="flex items-center gap-2"
                        >
                            <Grid3X3 className="w-4 h-4" />
                            Week
                        </Button>
                    </div>

                    <Button onClick={handleCreatePost} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Post
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                postCount={filteredPosts.length}
            />

            {/* Calendar View */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <CalendarView
                    posts={filteredPosts}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    viewMode={viewMode}
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
                    onDragDrop={handleDragDrop}
                />
            </div>

            {/* Post Modal */}
            <PostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPost(null);
                }}
                post={editingPost}
                onSave={handleSavePost}
            />
        </div>
    );
}
