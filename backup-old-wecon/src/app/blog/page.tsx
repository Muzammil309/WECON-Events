import { Metadata } from 'next';
import { BookOpen, Calendar, User, ArrowRight, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - WECON Masawat',
  description: 'Latest insights, tips, and updates from the WECON Masawat team',
};

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Event Management: Trends to Watch in 2024',
      excerpt: 'Discover the latest trends shaping the event management industry and how technology is revolutionizing attendee experiences.',
      author: 'Sarah Ahmed',
      date: '2024-03-15',
      category: 'Industry Insights',
      readTime: '5 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'How to Create Engaging Virtual and Hybrid Events',
      excerpt: 'Learn best practices for designing virtual and hybrid events that keep attendees engaged and connected.',
      author: 'Muhammad Ali',
      date: '2024-03-10',
      category: 'Best Practices',
      readTime: '7 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Maximizing ROI: Analytics That Matter for Event Organizers',
      excerpt: 'Understand which metrics to track and how to use data analytics to improve your event outcomes and ROI.',
      author: 'Fatima Khan',
      date: '2024-03-05',
      category: 'Analytics',
      readTime: '6 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Building Strong Networking Opportunities at Events',
      excerpt: 'Strategies for facilitating meaningful connections and networking experiences at your events.',
      author: 'Ahmed Hassan',
      date: '2024-02-28',
      category: 'Networking',
      readTime: '4 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Sustainable Event Management: Going Green in 2024',
      excerpt: 'How to organize environmentally friendly events without compromising on quality or attendee experience.',
      author: 'Zara Malik',
      date: '2024-02-20',
      category: 'Sustainability',
      readTime: '8 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'The Power of Mobile Apps in Modern Event Management',
      excerpt: 'Explore how mobile applications are transforming event experiences and improving attendee engagement.',
      author: 'Omar Sheikh',
      date: '2024-02-15',
      category: 'Technology',
      readTime: '5 min read',
      image: '/api/placeholder/400/250'
    }
  ];

  const categories = ['All', 'Industry Insights', 'Best Practices', 'Analytics', 'Networking', 'Sustainability', 'Technology'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">WECON Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Insights, tips, and updates from the world of event management
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-blue-600 hover:text-white border border-gray-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Featured Image</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">{blogPosts[0].category}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h2>
                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString()}
                    </div>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Blog Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}
