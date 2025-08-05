import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConsoleTest = () => {
    useEffect(() => {
        console.log('ConsoleTest component mounted');
        console.error('ConsoleTest ERROR log');
        console.warn('ConsoleTest WARNING log');
        console.info('ConsoleTest INFO log');
        alert('ConsoleTest mounted - check console for logs');
    }, []);

    const testConsole = () => {
        console.log('Button clicked - console.log test');
        console.error('Button clicked - console.error test');
        console.warn('Button clicked - console.warn test');
        console.info('Button clicked - console.info test');
        alert('Console test button clicked - check console');
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Console Test Component</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>This component tests if console logging works.</p>
                    <Button onClick={testConsole} className="w-full">
                        Test Console Logging
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConsoleTest; 