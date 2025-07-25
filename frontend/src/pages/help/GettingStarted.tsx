import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Article.scss';

const GettingStarted: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) setIsDarkMode(stored === 'false');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  return (
    <div>
      <div
        className={`article-fixed-background ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
      >
        <div className="article-top-bar">
          <button
            type="button"
            className="article-theme-toggle-btn"
            onClick={() => {
              void navigate('/help');
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="article-theme-toggle-btn"
            style={{ marginRight: '1rem' }}
            onClick={() => {
              setIsDarkMode((prev) => !prev);
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div
          className={`article-container ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
        >
          <section className="article-section">
            <div className="article-section-inner">
              <aside className="article-section-sidebar">
                <h2 className="article-h2">On this page</h2>
                <ul>
                  <li>
                    <a href="#intro">Getting Started</a>
                  </li>
                  <li>
                    <a href="#video">Video Walkthrough</a>
                  </li>
                  <li>
                    <a href="#workflow">Typical Workflow</a>
                  </li>
                </ul>
              </aside>

              <div className="article-content article-scrollable-content">
                <div className="p-6 max-w-4xl mx-auto space-y-12 text-base leading-relaxed text-left">
                  <section id="intro">
                    <h1 className="text-3xl font-bold text-theme mb-4">
                      Getting Started with Marito
                    </h1>
                    <div className="space-y-6 leading-relaxed text-base">
                      <p>
                        Welcome to Marito, your gateway to exploring and
                        contributing to South Africa’s multilingual digital
                        lexicon. Whether you're a linguist, contributor, or NLP
                        researcher, this guide will help you get up and running
                        with everything Marito offers.
                      </p>
                    </div>
                    <div className="video-container">
                      <video
                        controls
                        width="100%"
                        style={{
                          maxWidth: '800px',
                          marginTop: '2rem',
                          borderRadius: '0.75rem',
                        }}
                      >
                        <source
                          src="/Marito/videos/Updated-workflow-tut.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </section>
                  <section id="workflow">
                    <h2 className="text-3xl font-bold text-theme mb-4">
                      Typical Workflow
                    </h2>
                    <div className="text-left space-y-6 leading-relaxed text-base">
                      <p>
                        While each user's journey through Marito may differ, a
                        common workflow looks something like this:
                      </p>
                      <ol className="list-decimal list-inside space-y-4">
                        <li>
                          <strong>Create an Account:</strong> Register to
                          contribute terms, bookmark favourites, and access
                          Marito’s full set of features tailored to your usage.
                        </li>

                        <li>
                          <strong>Search and Explore:</strong> Use the{' '}
                          <em>search bar</em> to look up terms in any of South
                          Africa’s official languages. Refine results using
                          filters like language and domain. Enable AI Search and
                          Fuzzy Search to enhance your search accuracy.
                        </li>

                        <li>
                          <strong>Add Terms:</strong> Contribute new terms by
                          specifying the language, domain, and a definition.
                        </li>

                        <li>
                          <strong>Save and Download:</strong> Bookmark terms for
                          quick access under <em>Saved Terms</em>. Export full
                          domains for offline use in JSON or CSV formats.
                        </li>

                        <li>
                          <strong>Review Analytics:</strong> Navigate to the{' '}
                          <em>Analytics Page</em> to see search trends, term
                          popularity, and recent contributions. Use this data to
                          guide your research or content creation.
                        </li>

                        <li>
                          <strong>Offline Usage:</strong> As a PWA, Marito
                          caches your searches, saved terms, and pages for
                          seamless use without an internet connection.
                        </li>

                        <li>
                          <strong>Get Feedback & Iterate:</strong> Share terms,
                          insights, or downloads with peers. Use your findings
                          to enhance NLP tools, inform glossaries, or preserve
                          linguistic heritage.
                        </li>
                      </ol>
                      <p>
                        <em>Watch the video above</em> for a visual walkthrough.
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
