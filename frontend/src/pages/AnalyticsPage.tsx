import React, { useState, useEffect } from 'react';
import HorizontalBarChart from '../components/data/HorizontalBarChart';
import type { TermData } from '../components/data/HorizontalBarChart';
import { FaCheckCircle, FaBookmark, FaComments, FaGlobe } from 'react-icons/fa';
import StatCard from '../components/data/StatCard';
import PieChart from '../components/data/PieChart';
import LeftNav from '../components/ui/LeftNav';
import Navbar from '../components/ui/Navbar.tsx';
import { API_ENDPOINTS } from '../config';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/AnalyticsPage.scss';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const mockData: TermData[] = [
  { term: 'word 1', frequency: 40 },
  { term: 'word 2', frequency: 32 },
  { term: 'word 3', frequency: 25 },
  { term: 'word 4', frequency: 18 },
  { term: 'word 5', frequency: 12 },
  { term: 'word 6', frequency: 40 },
  { term: 'word 7', frequency: 32 },
  { term: 'word 8', frequency: 25 },
  { term: 'word 9', frequency: 18 },
  { term: 'word 10', frequency: 12 },
];

const mockPieData = [
  {
    label: 'Afrikaans',
    value: 9.2,
    backgroundColor: '#26D7B9',
    borderColor: '#1BA997',
  },
  {
    label: 'isiNdebele',
    value: 9.1,
    backgroundColor: '#FAE56B',
    borderColor: '#E5CE00',
  },
  {
    label: 'isiXhosa',
    value: 8.8,
    backgroundColor: '#F87171',
    borderColor: '#E04343',
  },
  {
    label: 'isiZulu',
    value: 9.2,
    backgroundColor: '#6C63FF',
    borderColor: '#544DD4',
  },
  {
    label: 'Sepedi',
    value: 9.1,
    backgroundColor: '#FFA69E',
    borderColor: '#CC837A',
  },
  {
    label: 'Sesotho',
    value: 9.0,
    backgroundColor: '#4DD599',
    borderColor: '#3DAE7F',
  },
  {
    label: 'Setswana',
    value: 9.0,
    backgroundColor: '#3AB0FF',
    borderColor: '#2D90D0',
  },
  {
    label: 'siSwati',
    value: 8.9,
    backgroundColor: '#FFB703',
    borderColor: '#D58F00',
  },
  {
    label: 'Tshivenda',
    value: 9.0,
    backgroundColor: '#B388EB',
    borderColor: '#8B6AB3',
  },
  {
    label: 'Xitsonga',
    value: 9.1,
    backgroundColor: '#FF9F68',
    borderColor: '#D97F4A',
  },
];

const mockData2: TermData[] = [
  { term: 'Statistical Processes/Methodology/Metadata', frequency: 120 },
  { term: 'System of Business Registers', frequency: 117 },
  { term: 'National Accounts', frequency: 105 },
  { term: 'Labour', frequency: 98 },
  { term: 'Tourism and Migration', frequency: 84 },
  { term: 'National, Provincial and Local Government', frequency: 72 },
  { term: 'Geography', frequency: 64 },
  { term: 'Housing and Services', frequency: 50 },
  { term: 'Industry and Trade', frequency: 47 },
  { term: 'Education', frequency: 47 },
  { term: 'Public Finance', frequency: 43 },
  { term: 'Agriculture', frequency: 41 },
  { term: 'Population Census', frequency: 40 },
  { term: 'Health and Vital Statistics', frequency: 37 },
  { term: 'General Demography', frequency: 36 },
  { term: 'Social conditions/Personal services', frequency: 32 },
  { term: 'Prices', frequency: 21 },
  { term: 'Tourism', frequency: 16 },
  { term: 'Private Sector', frequency: 16 },
  { term: 'Poverty', frequency: 13 },
  { term: 'Construction', frequency: 10 },
  { term: 'Household Income and Expenditure', frequency: 9 },
  { term: 'Trade', frequency: 7 },
  { term: 'Business Enterprises', frequency: 7 },
  { term: 'Demography', frequency: 5 },
  { term: 'Law/Justice', frequency: 5 },
  { term: 'Environment', frequency: 5 },
  { term: 'Science and Technology', frequency: 4 },
  { term: 'Transport and Communication', frequency: 3 },
  { term: 'Income, Pensions, Spending and Wealth', frequency: 3 },
  { term: 'Energy', frequency: 2 },
  { term: 'Manufacturing', frequency: 1 },
];

interface CategoryFrequencyData {
  category_frequency: Record<string, number>;
}

const AnalyticsPage: React.FC = () => {
  const [categoryData, setCategoryData] = useState<TermData[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetch(API_ENDPOINTS.descriptiveAnalytics)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch analytics data');
        return res.json();
      })
      .then((data: CategoryFrequencyData) => {
        const transformed: TermData[] = Object.entries(
          data.category_frequency,
        ).map(([term, frequency]) => ({
          term,
          frequency: frequency,
        }));
        setCategoryData(transformed);
      })
      .catch((err: unknown) => {
        console.warn('API unavailable, using fallback mock data.', err);
        setCategoryData(mockData2); // fallback to mock data
      });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) setIsDarkMode(stored === 'false');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`dashboard-container ${isMobileMenuOpen ? 'mobile-menu-is-open' : ''} ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
    >
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={toggleMobileMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toggleMobileMenu();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {isMobile ? (
        <Navbar />
      ) : (
        <LeftNav
          activeItem={activeMenuItem}
          setActiveItem={setActiveMenuItem}
        />
      )}

      <div className="main-content">
        {!isMobile && (
          <div className="top-bar analytics-top-bar">
            <button
              className="hamburger-icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        )}

        <div className={`analytics-content ${isMobile ? 'pt-16' : ''}`}>
          {/* Stats Overview Section */}
          <div className="stats-overview-section">
            <div className="stat-cards-grid">
              <StatCard
                title="Feedback Submissions Made"
                value={12}
                icon={<FaComments className="stat-icon" />}
                isDarkMode={isDarkMode}
              />
              <StatCard
                title="Approved Submissions"
                value={12}
                icon={<FaCheckCircle className="stat-icon" />}
                isDarkMode={isDarkMode}
              />
              <StatCard
                title="Your Total Saved Terms"
                value={12}
                icon={<FaBookmark className="stat-icon" />}
                isDarkMode={isDarkMode}
              />
              <StatCard
                title="Your Top Language"
                value="English"
                icon={<FaGlobe className="stat-icon" />}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <div className="main-charts-section">
            <div className="charts-left-column">
              <div className="chart-card">
                <div className="mt-4 px-2">
                  <HorizontalBarChart
                    data={mockData}
                    title="Term Frequency"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h2
                    className="text-gray-800 text-xl font-semibold m-0 "
                    style={{ color: 'var(--text-color)' }}
                  >
                    Category Distribution
                  </h2>
                </div>
                <div className="mt-4 px-2">
                  <HorizontalBarChart
                    data={categoryData}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>

            <div className="charts-right-column">
              <div className="chart-card pie-chart-card">
                <div className="chart-header">
                  <h2
                    className="text-xl font-semibold m-0"
                    style={{ color: 'var(--text-color)' }}
                  >
                    Unique Language Terms
                  </h2>
                </div>
                <div className="pie-chart-wrapper">
                  <PieChart
                    data={mockPieData}
                    formatValue={(value) => `${String(value)}%`}
                    isDarkMode={isDarkMode}
                  />
                </div>
                {/* Testing only */}
                {/* <label>
                    Dark Mode                                 
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(prev => !prev)}
                    />
                  </label> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
