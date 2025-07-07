'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, Star, ArrowRight, CheckCircle, Play, Award, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to show the landing page briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-500 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Mind SIA</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#courses" className="text-gray-600 hover:text-gray-900 transition-colors">Courses</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About us</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact us</a>
              <Link href="/login">
                <Button variant="outline" className="mr-2">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Belajar Sistem
                  <span className="text-green-500"> Informasi</span>
                  <br />
                  Akademik
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Master sistem dan manajemen pembelajaran dengan Mind SIA - platform terdepan untuk pendidikan modern.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 py-3">
                  <Play className="mr-2 h-5 w-5" />
                  Get free trial
                </Button>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">Public Speaking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">Career-Oriented</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">Creative Thinking</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-green-100 p-3 rounded-full">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                    <Badge className="bg-green-500 text-white">2K+</Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Active Students</h3>
                  <p className="text-gray-600">Join thousands of students learning with us</p>
                </div>
              </div>
              
              <div className="absolute top-8 right-8 bg-white rounded-xl shadow-lg p-4 transform -rotate-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">5K+</p>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-white rounded-xl shadow-lg p-4 transform rotate-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">250+</p>
                    <p className="text-sm text-gray-600">Courses</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-linear-to-r from-green-400 to-blue-500 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-gray-500 font-medium">250+ Collaboration</p>
            </div>
            <div className="flex justify-center items-center space-x-12">
              <div className="text-2xl font-bold text-gray-400/60">duolingo</div>
              <div className="text-2xl font-bold text-gray-400/60">Codecov</div>
              <div className="text-2xl font-bold text-gray-400/60">UX Reading</div>
              <div className="text-2xl font-bold text-gray-400/60">magic leap</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-500 font-semibold mb-2">Our Services</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fostering a playful & engaging learning environment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-green-500 text-white">
              <CardHeader className="pb-4">
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Interactive Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 mb-4">
                  Engage with interactive learning modules designed for maximum retention and understanding.
                </p>
                <Button variant="secondary" size="sm" className="bg-white text-green-500 hover:bg-gray-100">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">UX Design Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive UX design curriculum covering the latest industry standards and best practices.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">User Interface Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Master the art of creating beautiful and functional user interfaces that users love.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Most Popular Class
            </h2>
            <p className="text-xl text-gray-600">
              Let's join our famous class, the knowledge provided will definitely be useful for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-linear-to-br from-purple-500 to-pink-500 rounded-t-lg flex items-center justify-center">
                  <div className="text-white text-6xl font-bold">UI</div>
                </div>
                <Badge className="absolute top-4 right-4 bg-white text-gray-900">Best Seller</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Figma UI UX Design</h3>
                <p className="text-gray-600 mb-4">
                  Learn Figma to get a job in UI Design. User Interface, User Experience design.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">$17.84</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Jane Cooper</span>
                  <span>Design</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-linear-to-br from-blue-500 to-cyan-500 rounded-t-lg flex items-center justify-center">
                  <div className="text-white text-4xl font-bold">WEB</div>
                </div>
                <Badge className="absolute top-4 right-4 bg-white text-gray-900">Popular</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Learn With Shoaib</h3>
                <p className="text-gray-600 mb-4">
                  Design Web Sites and Mobile Apps that Your Users Love and Return to Again.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">$8.99</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Jenny Wilson</span>
                  <span>Development</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-linear-to-br from-green-500 to-teal-500 rounded-t-lg flex items-center justify-center">
                  <div className="text-white text-4xl font-bold">API</div>
                </div>
                <Badge className="absolute top-4 right-4 bg-white text-gray-900">New</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Building User Interface</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to apply User Experience (UX) principles to your website designs.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.7)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">$11.70</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Esther Howard</span>
                  <span>Design</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Explore All Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Meet the Heroes */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet the Heroes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our MINDSIA instructors from all over the world instruct millions of students. We provide the knowledge and abilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Theresa Webb', role: 'Application Support Analyst Lead', image: '👩‍💼' },
              { name: 'Courtney Henry', role: 'Senior Undergraduate Lecturer and Researcher', image: '👨‍🏫' },
              { name: 'Albert Flores', role: 'Former co-founder of Opendoor. Early staff at Spotify and Clearbit.', image: '👨‍💻' },
              { name: 'Marvin McKinney', role: 'Co-op & Internships Program Coordinator', image: '👨‍🎓' }
            ].map((instructor, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{instructor.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{instructor.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{instructor.role}</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Courses was fantastic! It is Master platform for those looking to start a new career, or need a refresher.
          </h2>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
              👩
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Mia Rachel</p>
              <p className="text-gray-600">Student, University of Pennsylvania</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">Mind SIA</span>
              </div>
              <p className="text-gray-400 mb-4">
                The learning experience that makes more sense for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ed Cirkle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}