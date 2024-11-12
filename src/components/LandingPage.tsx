// components/LandingPage.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Mail, Shield } from 'lucide-react';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Join the Waitlist
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">I am a...</label>
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={() => setUserType('cat-owner')}
                      className={`px-4 py-2 rounded-full ${
                        userType === 'cat-owner' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      Cat Owner
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('cat-lover')}
                      className={`px-4 py-2 rounded-full ${
                        userType === 'cat-lover' 
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

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Join Waitlist
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