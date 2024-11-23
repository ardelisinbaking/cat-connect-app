'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Mail, // Remove this if not used, or keep for potential future use
  Shield, 
  Loader2, 
  Cat, 
  MapPin 
} from 'lucide-react';
import { motion } from 'framer-motion';

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
      setStatus({ ...status, error: 'Please select a user type and enter your email' });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userType,
          signupDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        // Explicitly type the error handling
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join waitlist');
      }

      setStatus({ loading: false, error: null, success: true });
      // Clear form
      setEmail('');
      setUserType('');
    } catch (error: unknown) {
      // Use type guard to handle unknown error type
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : 'Failed to join waitlist. Please try again.';

      setStatus({
        loading: false,
        error: errorMessage,
        success: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-gray-800 leading-tight">
            Connecting Cat Lovers with Furry Friends
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Experience the joy of cats without the full-time commitment. Meet local cats, make new friends, and create purr-fect memories.
          </p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: Heart,
              color: 'text-red-500',
              title: 'Find Local Cats',
              description: 'Discover friendly cats in your neighborhood eager for cuddles and playtime',
            },
            {
              icon: MapPin,
              color: 'text-green-500',
              title: 'Nearby Matches',
              description: 'Connect with cat owners within a comfortable distance from your location',
            },
            {
              icon: Shield,
              color: 'text-purple-500',
              title: 'Safe & Verified',
              description: 'Rigorous user verification and safe meeting guidelines for peace of mind',
            }
          ].map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 h-full">
                <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Waitlist Signup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              {!status.success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-4">
                    Join Our Waitlist
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">I am a...</label>
                    <div className="flex justify-center space-x-4">
                      {[
                        { type: 'CAT_OWNER', label: 'Cat Owner', icon: Cat },
                        { type: 'CAT_LOVER', label: 'Cat Lover', icon: Heart }
                      ].map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setUserType(type as UserType)}
                          className={`
                            flex items-center px-4 py-2 rounded-full 
                            transition-all duration-300
                            ${userType === type 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200'}
                          `}
                        >
                          <Icon className="mr-2 w-5 h-5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {status.error && (
                    <div className="text-red-500 text-sm text-center">
                      {status.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="
                      w-full bg-blue-500 text-white py-3 rounded-lg 
                      hover:bg-blue-600 transition-colors
                      disabled:opacity-50 flex items-center justify-center
                    "
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
                  <h2 className="text-3xl font-bold mb-4 text-green-600">
                    Thank You!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You're on the list! We'll notify you about our launch soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;