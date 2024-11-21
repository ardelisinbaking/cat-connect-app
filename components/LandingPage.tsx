// components/LandingPage.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardContent } from 'components/ui/card';
import { Heart, Mail, Shield, Loader2 } from 'lucide-react';

// Add TypeScript types to match your Prisma schema
type UserType = 'CAT_OWNER' | 'CAT_LOVER';

interface SubmissionStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType | ''>('');
  const [status, setStatus] = useState<SubmissionStatus>({
    loading: false,
    error: null,
    success: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !userType) {
      setStatus({ ...status, error: 'Please fill in all fields' });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userType,
          // You might want to add a default name based on email
          name: email.split('@')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setStatus({
        loading: false,
        error: 'Failed to join waitlist. Please try again.',
        success: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Connect with Friendly Cats in Your Neighborhood
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The purr-fect way to spend time with cats when you can't have one of your own
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="font-semibold mb-2">Find Local Cats</h3>
            <p className="text-gray-600">Discover friendly cats in your area available for visits</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">Arrange convenient meeting times with cat owners</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">Safe & Verified</h3>
            <p className="text-gray-600">All users and cats are verified for everyone's safety</p>
          </Card>
        </div>

        {/* Sign Up Form */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            {!status.success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Join the Waitlist
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">I am a...</label>
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={() => setUserType('CAT_OWNER')}
                      className={`px-4 py-2 rounded-full ${
                        userType === 'CAT_OWNER' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      Cat Owner
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('CAT_LOVER')}
                      className={`px-4 py-2 rounded-full ${
                        userType === 'CAT_LOVER' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      Cat Lover
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {status.error && (
                  <div className="text-red-500 text-sm">{status.error}</div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                >
                  {status.loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                <p className="text-gray-600">
                  We'll keep you updated on our launch progress.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;