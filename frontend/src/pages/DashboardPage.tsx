import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LeftNav from '../components/ui/LeftNav.tsx';
import Navbar from '../components/ui/Navbar.tsx';
import '../styles/DashboardPage.scss';
import { API_ENDPOINTS } from '../config';
import { useDarkMode } from '../components/ui/DarkModeComponent.tsx';

interface Letter {
  id: number;
  char: string;
  color: string;
  left: number;
  top: number;
  speed: number;
}

interface UserProfileApiResponse {
  id: string;
  first_name: string;
  last_name: string;
}

interface UserData {
  uuid: string;
  firstName: string;
  lastName: string;
}

const DashboardPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatarInitials, setAvatarInitials] = useState<string>('U');
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [letters, setLetters] = useState<Letter[]>([]);

  const colors = useMemo(() => ['#00CEAF', '#212431', '#F7074D', '#F2D001'], []);
  const alphabet = useMemo(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      void navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData) as UserData;
          setUserData(parsedData);
          setAvatarInitials(
            `${parsedData.firstName.charAt(0)}${parsedData.lastName.charAt(0)}`.toUpperCase()
          );
          setIsLoadingUserData(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.getMe, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const apiData = await response.json() as UserProfileApiResponse;
          const newUserData: UserData = {
            uuid: apiData.id,
            firstName: apiData.first_name,
            lastName: apiData.last_name,
          };
          setUserData(newUserData);
          localStorage.setItem('userData', JSON.stringify(newUserData));
          setAvatarInitials(
            `${newUserData.firstName.charAt(0)}${newUserData.lastName.charAt(0)}`.toUpperCase()
          );
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
          void navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        void navigate('/login');
      } finally {
        setIsLoadingUserData(false);
      }
    };

    void fetchUserData();
  }, [navigate]);

  // Falling letters animation
  useEffect(() => {
    const createLetter = () => {
      return {
        id: Math.random(),
        char: alphabet[Math.floor(Math.random() * alphabet.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * (85),
        top: -100,
        speed: Math.random() * 1.5 + 0.5
      };
    };

    const initialLetters = Array.from({ length: 20 }, createLetter);
    setLetters(initialLetters);

    const animate = () => {
      setLetters(prevLetters => {
        const newLetters = prevLetters.map(letter => ({
          ...letter,
          top: letter.top + letter.speed
        })).filter(letter => letter.top < window.innerHeight + 100);

        if (Math.random() < 0.4 && newLetters.length < 25) {
          newLetters.push(createLetter());
        }

        if (newLetters.length < 20) {
          newLetters.push(...Array.from({ length: 20 - newLetters.length }, createLetter));
        }

        return newLetters;
      });
    };

    const interval = setInterval(animate, 60);
    return () => { clearInterval(interval); };
  }, [alphabet, colors]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`dashboard-container ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      {isMobile ? (
        <Navbar />
      ) : (
        <LeftNav
          activeItem={activeMenuItem}
          setActiveItem={setActiveMenuItem}
        />
      )}
      <div role="complementary" aria-label="falling-letters" className="abstract-bg">
        {letters.map(letter => (
          <div
            key={letter.id}
            className="falling-letter"
            style={{
              left: `${String(letter.left)}%`,
              top: `${String(letter.top)}px`,
              color: letter.color,
              opacity: '0.1',
              transform: `rotate(${String(letter.top)}deg)`
            }}
          >
            {letter.char}
          </div>
        ))}
      </div>

      <div className="profile-container">
        {isLoadingUserData ? (
          <div className="profile-section">Loading profile...</div>
        ) : (
          <div className="profile-section">
            <div className="profile-info">
              <div className="profile-avatar">{avatarInitials}</div>
              <div className="profile-details">
                <h3>
                  {userData
                    ? `${userData.firstName} ${userData.lastName}`
                    : t('dashboard.userName')}
                </h3>
                <p>
                  {t('dashboard.userId')}: {userData ? userData.uuid : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          <div className="content-layout">
            <div className="content-side">
              <h1 className="title">Unite Through Words</h1>
              <br />
              <div className="intro-text">
                <p>
                  The term 'Marito' originates from Xitsonga, translating to 'words' or 'names'. 
                  This is a progressive web application that bridges the gap between South Africa's rich linguistic 
                  heritage and modern digital accessibility. Language enthusiasts, NLP researchers, and linguists can 
                  use Marito as a unified platform to explore, contribute to, and preserve multilingual glossaries, 
                  dictionaries, and terminology banks across 11 of South Africa's official languages.
                </p>
                
                <p>
                  Marito works seamlessly both offline and online, empowering communities to access comprehensive 
                  language resources, submit feedback, and collaborate on robust lexicons for low-resource languages. 
                  This platform is part of an ongoing initiative by DSFSI (Data Science for Social Impact) at the 
                  University of Pretoria to democratize linguistic resources and advance natural language processing 
                  research for African languages.
                </p>
                
                <p className="team-credit">Proudly developed by Velox</p>
              </div>

              <div className="cta-section">
                <a href="https://www.dsfsi.co.za/" className="cta-button primary-cta" target="_blank" rel="noopener noreferrer">
                  Learn more about DSFSI
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
