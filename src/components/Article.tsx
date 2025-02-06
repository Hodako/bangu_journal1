import React, { useState, useEffect } from 'react';
import { BookOpen, ThumbsUp, MessageSquare, Share2, Bookmark, Download, Link, ArrowLeft, X, Moon, Sun } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Article {
  id: number;
  title: string;
  author: string;
  institution: string;
  publishDate: string;
  readTime: string | null;
  likes: number;
  comments: number;
  tags: string[];
  content: string;
}

const ArticlePage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setTocOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`https://backend-api-9idz.onrender.com/api/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const TableOfContents = () => (
    <div className={`${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} 
      ${isMobile && tocOpen ? 'fixed inset-0 z-50 overflow-y-auto pt-16' : 'hidden md:block md:w-64 lg:w-80'}
    `}>
      {isMobile && tocOpen && (
        <div className="absolute top-4 right-4">
          <button onClick={() => setTocOpen(false)}>
            <X className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
          </button>
        </div>
      )}
      <h3 className={`text-lg font-semibold px-4 py-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Contents
      </h3>
      <nav>
        <ul className={`${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
          {[
            'Introduction', 
            'Historical Context', 
            'Scientific Perspectives', 
            'Contemporary Implications',
            'Conclusion'
          ].map(section => (
            <li key={section}>
              <a 
                href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
                className={`block px-4 py-2 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-40 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button className={`${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
              <ArrowLeft className="h-6 w-6" />
            </button>
            <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} hidden sm:block`}>
              Rational Discourse
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button onClick={() => setTocOpen(true)}>
                <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              </button>
            )}
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-white" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:flex">
        {/* Table of Contents for Desktop */}
        {!isMobile && <TableOfContents />}

        {/* Mobile Table of Contents */}
        {isMobile && tocOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute inset-x-0 top-16 bottom-0">
              <TableOfContents />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className={`
          flex-1 
          ${!isMobile ? 'md:pl-8 lg:pl-16' : ''} 
          ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
        `}>
          {/* Article Header */}
          <header className="mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {article.author}
              </span>
              <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {article.institution}
              </span>
              <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {article.publishDate}
              </span>
              <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {article.readTime} read
              </span>
            </div>

            {/* Article Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode
                      ? 'bg-gray-700 text-blue-400'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Article Actions */}
            <div className="flex items-center space-x-4 border-y py-4 mb-6">
              <button className="flex items-center space-x-2 text-sm">
                <ThumbsUp className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span>{article.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-sm">
                <MessageSquare className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span>{article.comments}</span>
              </button>
              <button className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Share2 className="h-5 w-5" />
              </button>
              <button className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Bookmark className="h-5 w-5" />
              </button>
              <button className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Download className="h-5 w-5" />
              </button>
              <button className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Link className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose max-w-none">
            {article.content.split('\n').map((section, index) => (
              <p key={index} className="mb-4">
                {section}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticlePage;
