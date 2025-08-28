import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConsoleTest = () => {
    useEffect(() => {
        console.log('ConsoleTest mounted - check console for logs');
    }, []);

    const handleTestClick = () => {
        console.log('Console test button clicked - check console');
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Console Test Component</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>This component tests if console logging works.</p>
                    <Button onClick={handleTestClick} className="w-full">
                        Test Console Logging
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConsoleTest; 