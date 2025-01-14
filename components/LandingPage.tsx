"use client";

import { useTheme } from "@/providers/theme-provider"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, MapPin, Shield, Moon, Sun } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { theme, setTheme } = useTheme();


  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');        
        // throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50"
        onClick={toggleTheme}
        type="button"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Connecting Cat Lovers with Furry Friends
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Experience the joy of cats without the full-time commitment. Meet local cats, make new friends, and create purr-fect memories.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
            <div className="mb-4 text-purple-600 dark:text-purple-400">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Find Local Cats</h2>
            <p className="text-muted-foreground">
              Discover friendly cats in your neighborhood eager for cuddles and playtime
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
            <div className="mb-4 text-purple-600 dark:text-purple-400">
              <MapPin className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nearby Matches</h2>
            <p className="text-muted-foreground">
              Connect with cat owners within a comfortable distance from your location
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
            <div className="mb-4 text-purple-600 dark:text-purple-400">
              <Shield className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Safe & Verified</h2>
            <p className="text-muted-foreground">
              Rigorous user verification and safe meeting guidelines for peace of mind
            </p>
          </div>
        </section>

        {/* Waitlist Form */}
        <section className="max-w-md mx-auto bg-card p-8 rounded-xl shadow-md border">
          <h2 className="text-2xl font-bold mb-6 text-center">Join Our Waitlist</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base">I am a...</Label>
              <RadioGroup
                value={userType}
                onValueChange={setUserType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CAT_OWNER" id="cat-owner" />
                  <Label htmlFor="cat-owner" className="cursor-pointer">
                    Cat Owner
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CAT_LOVER" id="cat-lover" />
                  <Label htmlFor="cat-lover" className="cursor-pointer">
                    Cat Lover
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <Alert>
                <AlertDescription>
                  Thanks for joining! We'll notify you when we launch.
                </AlertDescription>
              </Alert>
            ) : (
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !email || !userType}
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
              </Button>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}