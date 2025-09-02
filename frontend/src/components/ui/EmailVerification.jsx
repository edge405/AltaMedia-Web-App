import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, Mail, Loader2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import EmailVerificationService from '@/utils/emailVerificationService';
import { isValidEmail } from '@/utils/formValidation';

const EmailVerification = ({
    email,
    onEmailChange,
    onVerificationComplete,
    businessName = '',
    disabled = false,
    className = ''
}) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');

    // Check verification status when email changes
    useEffect(() => {
        if (email && isValidEmail(email)) {
            checkVerificationStatus();
        } else {
            setIsVerified(false);
            setShowVerificationInput(false);
        }
    }, [email]);

    // Countdown timer for resend
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const checkVerificationStatus = async () => {
        try {
            const response = await EmailVerificationService.checkVerificationStatus(email);
            if (response.success && response.data.isVerified) {
                setIsVerified(true);
                setShowVerificationInput(false);
                onVerificationComplete?.(email);
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
        }
    };

    const handleSendCode = async () => {
        if (!email || !isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSendingCode(true);
        setError('');

        try {
            const response = await EmailVerificationService.sendVerificationCode(email, businessName);

            if (response.success) {
                setShowVerificationInput(true);
                setCountdown(60); // 60 seconds cooldown
                toast.success('Verification code sent to your email!');
            } else {
                setError(response.message || 'Failed to send verification code');
                toast.error(response.message || 'Failed to send verification code');
            }
        } catch (error) {
            setError('Failed to send verification code. Please try again.');
            toast.error('Failed to send verification code. Please try again.');
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
        console.log('🔍 handleVerifyCode called with:', { email, verificationCode, length: verificationCode?.length });
        if (!verificationCode || verificationCode.length !== 6) {
            setError('Please enter the 6-digit verification code');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            const response = await EmailVerificationService.verifyCode(email, verificationCode);

            if (response.success) {
                setIsVerified(true);
                setShowVerificationInput(false);
                setVerificationCode('');
                onVerificationComplete?.(email);
                toast.success('Email verified successfully!');
            } else {
                setError(response.message || 'Invalid verification code');
                toast.error(response.message || 'Invalid verification code');
            }
        } catch (error) {
            setError('Failed to verify code. Please try again.');
            toast.error('Failed to verify code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;
        await handleSendCode();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Email Input */}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Email
                </Label>
                <div className="flex gap-2">
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="Enter your business email"
                        className={`flex-1 ${isVerified
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                        disabled={disabled}
                    />
                    {isVerified && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Verified</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Send Code Button */}
            {!isVerified && email && isValidEmail(email) && (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        disabled={isSendingCode || disabled || countdown > 0}
                        className="flex items-center gap-2"
                    >
                        {isSendingCode ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4" />
                                Send Verification Code
                            </>
                        )}
                    </Button>

                    {countdown > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="flex items-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Resend in {countdown}s
                        </Button>
                    )}

                    {countdown === 0 && showVerificationInput && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendCode}
                            disabled={disabled}
                            className="flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            Resend Code
                        </Button>
                    )}
                </div>
            )}

            {/* Verification Code Input */}
            {showVerificationInput && !isVerified && (
                <div className="space-y-2">
                    <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Verification Code
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="verificationCode"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setVerificationCode(value);
                            }}
                            placeholder="Enter 6-digit code"
                            className="flex-1"
                            maxLength={6}
                            disabled={disabled}
                        />
                        <Button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={isVerifying || verificationCode.length !== 6 || disabled}
                            className="flex items-center gap-2"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Verify
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enter the 6-digit code sent to your email address
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {isVerified && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                        Email verified successfully! You can now continue with the form.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EmailVerification;
