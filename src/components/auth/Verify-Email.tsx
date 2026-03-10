'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const supabase = createClient();
  
  useEffect(() => {
    const verifyEmail = async () => {
      setVerificationStatus('loading');
      console.log("searchParams:", searchParams);
      return;
      const token_hash = searchParams.get('code');
      console.log("token:", token_hash);

      if (!token_hash) {
        setVerificationStatus('failed');
        setErrorMessage('Invalid verification link.');
        return;
      }
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token_hash!,
        type: "signup"
      });
      if (error) {
        setVerificationStatus('failed');
        setErrorMessage(error?.message || "An error occurred");
        setCanResend(true); // Allow resending if verification fails
      }
      setVerificationStatus('success');
      router.push('/dashboard');
    };
    verifyEmail();
  }, [searchParams, router, supabase]);

  const handleResendVerification = async () => {
    setVerificationStatus('loading');
    setErrorMessage(null);
    // In a real application, you'd likely need the user's email to resend.
    // For this example, we'll assume the email is stored or can be retrieved.
    // This part would typically involve an API call to your backend.
    try {
      // This is a placeholder. I would implemente API route to handle resend-verification
      setVerificationStatus('success'); // Assume success for now
      setErrorMessage('Verification email resent! Please check your inbox.');
      setCanResend(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error?.message : 'Failed to resend verification email.';
      setVerificationStatus('failed');
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === 'loading' && 'Verifying your email address...'}
            {verificationStatus === 'success' && 'Your email has been successfully verified!'}
            {verificationStatus === 'failed' && 'Email verification failed.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {verificationStatus === 'loading' && (
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          )}
          {verificationStatus === 'failed' && errorMessage && (
            <p className="text-red-500 mb-4">{errorMessage}</p>
          )}
          {verificationStatus === 'failed' && canResend && (
            <Button onClick={handleResendVerification} className="w-full">
              Resend Verification Email
            </Button>
          )}
          {/* {verificationStatus === 'success' && (
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          )} */}
        </CardContent>
      </Card>
    </div>
    );
}