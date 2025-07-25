import React, { useState, useCallback, useEffect, useMemo } from 'react';
import HelpSearch from '../../components/ui/HelpSearch.tsx';
import '../../styles/HelpPage.scss';
import { Link } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar.tsx';
import LeftNav from '../../components/ui/LeftNav.tsx';

interface Article {
  title: string;
  desc: string;
  link: string;
  keywords: string[];
}

const HelpPage: React.FC = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('help');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const articles: Article[] = useMemo(
    () => [
      {
        title: 'Getting Started',
        desc: 'Learn how to quickly get the most out of the platform.',
        link: '/help/getting-started',
        keywords: [
          'introduction',
          'first steps',
          'account',
          'navigation',
          'login',
          'register',
        ],
      },
      {
        title: 'Community Feature',
        desc: 'Get to know the basics of using the community feature.',
        link: '/help/community-feature',
        keywords: ['comment', 'upvote', 'downvote', 'community'],
      },
      {
        title: 'Terms',
        desc: 'Languages, AI, and your term settings.',
        link: '/help/terms',
        keywords: [
          'ai',
          'fuzzy',
          'dictionary',
          'language',
          'search',
          'offline',
          'dictionary',
          'term',
          'language',
        ],
      },
      {
        title: 'FAQs',
        desc: 'Answers to common questions about the platform.',
        link: '/help/faqs',
        keywords: [
          'faq',
          'downloads',
          'contribute',
          'search',
          'dictionary',
          'offline',
        ],
      },
    ],
    [],
  );

  // Determines if the side nav or top av should be used.
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Changes the theme
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) setIsDarkMode(stored === 'false');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const handleSearch = useCallback(
    async (t: string): Promise<void> => {
      await Promise.resolve();
      setTerm(t);
      setCurrentPage(1);
      const query = t.toLowerCase().trim();

      if (!query) {
        setResults([]);
        setTerm('');
        return;
      }

      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.keywords.some((k) => k.includes(query)),
      );
      setResults(filtered);
    },
    [articles],
  );

  const fetchSuggestions = async (term: string): Promise<string[]> => {
    await Promise.resolve();
    const query = term.toLowerCase().trim();

    const keywordSet = new Set<string>();

    articles.forEach((article) => {
      article.keywords.forEach((keyword) => {
        if (keyword.includes(query) || query.includes(keyword)) {
          keywordSet.add(keyword);
        }
      });
    });

    // Return top 5 suggestions max
    return Array.from(keywordSet).slice(0, 5);
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));

  return (
    <div
      className={`help-page-fixed-background  ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
    >
      <div className={`help-page-container`}>
        {/* Top bar for mobile only */}
        {isMobile ? (
          <Navbar />
        ) : (
          <LeftNav
            activeItem={activeMenuItem}
            setActiveItem={setActiveMenuItem}
          />
        )}

        <div className="help-page-main-content">
          <div className="help-page-search-background">
            <div className="help-page-search-inner">
              <section>
                <h1>How Can We Help?</h1>
                <HelpSearch
                  onSearch={handleSearch}
                  fetchSuggestions={fetchSuggestions}
                />
              </section>
            </div>
          </div>

          <div className="min-h-screen help-page pt-16">
            {!term && (
              <section className="help-page-topics-section w-full px-4">
                <h2 className="help-page-topics-heading">Common Topics</h2>
                <div className="help-page-topics-grid">
                  {articles.map((topic, index) => (
                    // eslint-disable-next-line react-x/no-array-index-key
                    <div key={index} className="help-page-topic-card">
                      <h3>{topic.title}</h3>
                      <p>{topic.desc}</p>
                      <Link to={topic.link} className="help-page-article-link">
                        Article →
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {term && (
              <div className="p-6 w-full">
                {paginatedResults.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
                    {paginatedResults.map((res, index) => (
                      // eslint-disable-next-line react-x/no-array-index-key
                      <div key={index} className="help-page-topic-card">
                        <h3>{res.title}</h3>
                        <p>{res.desc}</p>
                        <Link to={res.link} className="help-page-article-link">
                          Article →
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-theme opacity-60 text-center">
                    No results found for "{term}".
                  </p>
                )}
              </div>
            )}
            {term && totalPages > 1 && (
              <div className="pagination-controls flex justify-center space-x-4 p-4">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                  className="px-4 py-2 bg-theme rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                  className="px-4 py-2 bg-theme rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            <section className="help-page-support-cta">
              <h3>Can’t find what you’re looking for?</h3>
              <a href="mailto:veloxcapstone@gmail.com" className="support-link">
                Submit a request →
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
