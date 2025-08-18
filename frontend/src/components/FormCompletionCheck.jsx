import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formStatusApi } from '../utils/formStatusApi';
import { Loader2 } from 'lucide-react';

export default function FormCompletionCheck({ children }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [hasCompletedForm, setHasCompletedForm] = useState(false);

    useEffect(() => {
        const checkFormCompletion = async () => {
            if (!user?.id) {
                setIsChecking(false);
                return;
            }

            try {
                const hasAnyCompleted = await formStatusApi.hasAnyCompletedForm(user.id);
                setHasCompletedForm(hasAnyCompleted);

                if (!hasAnyCompleted) {
                    // Redirect to the Knowing You form if no form is completed
                    navigate('/know-your-form');
                    return;
                }
            } catch (error) {
                console.error('Error checking form completion:', error);
                // On error, redirect to Knowing You form to be safe
                navigate('/know-your-form');
                return;
            } finally {
                setIsChecking(false);
            }
        };

        checkFormCompletion();
    }, [user?.id, navigate]);

    // Show loading while checking
    if (isChecking) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-600 dark:text-gray-400">Checking form completion...</p>
                </div>
            </div>
        );
    }

    // If form is completed, render children (dashboard)
    if (hasCompletedForm) {
        return children;
    }

    // This should not be reached due to navigation, but just in case
    return null;
}
