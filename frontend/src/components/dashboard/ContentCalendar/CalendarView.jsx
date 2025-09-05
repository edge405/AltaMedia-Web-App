import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from './PostCard';

export default function CalendarView({
    posts,
    currentDate,
    setCurrentDate,
    viewMode,
    onEditPost,
    onDeletePost,
    onDragDrop
}) {
    const [draggedPost, setDraggedPost] = useState(null);

    // Generate calendar data
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (viewMode === 'month') {
            return generateMonthView(year, month);
        } else {
            return generateWeekView(currentDate);
        }
    }, [currentDate, viewMode]);

    // Get posts for a specific date
    const getPostsForDate = (date) => {
        return posts.filter(post => {
            const postDate = new Date(post.date);
            return postDate.toDateString() === date.toDateString();
        });
    };

    // Navigation handlers
    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setDate(newDate.getDate() - 7);
        }
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setDate(newDate.getDate() + 7);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Drag and drop handlers
    const handleDragStart = (e, post) => {
        setDraggedPost(post);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetDate) => {
        e.preventDefault();
        if (draggedPost) {
            onDragDrop(draggedPost.id, targetDate);
            setDraggedPost(null);
        }
    };

    const formatDateHeader = () => {
        if (viewMode === 'month') {
            return currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        } else {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
    };

    return (
        <div className="p-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        className="flex items-center gap-1 sm:gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
                        {formatDateHeader()}
                    </h2>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        className="flex items-center gap-1 sm:gap-2"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                    className="w-full sm:w-auto"
                >
                    Today
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden min-h-[600px]">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div
                        key={day}
                        className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700"
                    >
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {calendarData.map((day, index) => {
                    const isCurrentMonth = day.isCurrentMonth;
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    const dayPosts = getPostsForDate(day.date);

                    return (
                        <div
                            key={index}
                            className={`min-h-[120px] bg-white p-2 hover:bg-gray-50 transition-colors ${!isCurrentMonth ? 'bg-gray-50' : ''
                                } ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                                }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day.date)}
                        >
                            {/* Date Number */}
                            <div className={`text-sm font-medium mb-2 ${!isCurrentMonth ? 'text-gray-400' :
                                    isToday ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                {day.date.getDate()}
                            </div>

                            {/* Posts */}
                            <div className="space-y-1">
                                {dayPosts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onEdit={() => onEditPost(post)}
                                        onDelete={() => onDeletePost(post.id)}
                                        onDragStart={(e) => handleDragStart(e, post)}
                                        isDragging={draggedPost?.id === post.id}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Helper functions
function generateMonthView(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    // Generate 6 weeks (42 days) to ensure we have enough cells
    for (let i = 0; i < 42; i++) {
        days.push({
            date: new Date(currentDate),
            isCurrentMonth: currentDate.getMonth() === month
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
}

function generateWeekView(currentDate) {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    const currentDateCopy = new Date(startOfWeek);

    for (let i = 0; i < 7; i++) {
        days.push({
            date: new Date(currentDateCopy),
            isCurrentMonth: true
        });
        currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    return days;
}
