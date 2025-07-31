import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/ui/Navbar.tsx';
import LeftNav from '../components/ui/LeftNav.tsx';
import { useDarkMode } from '../components/ui/DarkModeComponent.tsx';
import { Term } from '../types/terms/types.ts';
import '../styles/TermPage.scss';
import { ArrowUp, ArrowDown, Share2, MoreVertical } from 'lucide-react';
import { Badge } from "../components/ui/badge.tsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LanguageClassMap, SearchResponseType } from '../types/search/types.ts';
import { API_ENDPOINTS } from '../config.ts';

import { getAllTerms } from '../utils/indexedDB.ts';


const TermPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('search');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedTerms, setRelatedTerms] = useState<Term[]>([])
  const { isDarkMode } = useDarkMode();
  const [term, setTerm] = useState<Term | null>(null);
  const { language, name, id } = useParams<{ language: string, name: string, id: string }>();


  useEffect(() => {
    const run = async () => {
      if (id) {
        await handleSearch();
        const related = await fetchRelatedTerms(String(term?.domain));
        setRelatedTerms(related);
      }
    };
    void run();
  }, [id]);



  useEffect(() => {
    // fetch comments here probably
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!term) return;

    const runSearch = async () => {
      setIsLoading(true);
      try {
        const res = await fetchTerm();

        setTerm(res.results[0]);

        const related = await fetchRelatedTerms(term.domain);
        setRelatedTerms(related);
      } catch (error: unknown) {
        console.error('Search fetch failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void runSearch();
  }, [term, language]);

  const handleSearch = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const res = await fetchTerm();
        setTerm(res.results[0]);
      } catch (error: unknown) {
        console.error('Falling back to cached data', error);
        const cachedTerms = await getAllTerms();
        const filtered = cachedTerms.filter((term) =>
          term.term.toLowerCase() === name?.toLowerCase(),
        );
        setTerm(filtered[0]);
      } finally {
        setIsLoading(false);
      }
    },
    [language, false],
  );

  const fetchTerm = async (): Promise<SearchResponseType> => {
    const params = new URLSearchParams({
      query: String(name),
      language: String(language),
      sort_by: 'name',
      page: "1",
      page_size: "100",
      fuzzy: "false",
    });

    const response = await fetch(
      `${API_ENDPOINTS.search}?${params.toString()}`,
    );
    if (!response.ok) throw new Error('Failed to fetch search results');
    return (await response.json()) as SearchResponseType;
  };

  const fetchRelatedTerms = async (domain: string): Promise<Term[]> => {
    try{
      const params = new URLSearchParams({
        domain: String(domain),
        sort_by: 'name',
        page: "1",
        page_size: "3",
        fuzzy: "false",
      });

      const response = await fetch(
        `${API_ENDPOINTS.search}?${params.toString()}`,
      );
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json() as SearchResponseType;
      const res = data.results;
      return res;
    } catch (ex) {
      console.error('Falling back to cached data', ex);
      const cachedTerms = await getAllTerms();
      const filtered = cachedTerms.filter((t) => {
        console.log("Looking for related domain:", term?.domain);
        return t.domain === term?.domain && t.id !== term.id;}
      );
      console.log("Cached", cachedTerms)
      console.log("Cached Related", filtered)
      setRelatedTerms(filtered);
      return filtered;
    }
  };

  const languageKey =
    term?.language
      ? term.language.charAt(0).toUpperCase() + term.language.slice(1).toLowerCase()
      : 'Default';
  const languageClass = LanguageClassMap[languageKey] ?? 'bg-rose-500';
  /*const LanguagePillClassName = `bg-accent text-sm bg-${color}-500 text-theme`;*/

  return (
    <div
      className={`term-page-fixed-background  ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
    >
      <div className={`term-page-container`}>
        {isMobile ? (
          <Navbar />
        ) : (
          <LeftNav
            activeItem={activeMenuItem}
            setActiveItem={setActiveMenuItem}
          />
        )}

       <div className="term-main-content">
         {isLoading ? (<p>Loading...</p>) : (
          <div className="min-h-screen term-page pt-16">
            <div className="flex justify-between items-center w-full mb-4">
              <button className="bg-theme rounded-md text-sm mb-4 text-theme justify-start h-10 w-20" onClick={() => {
                void navigate(`/search`);
              }}>Back</button>
              <div className="flex flex-row items-center gap-2">
                <ArrowUp className="cursor-pointer hover:text-teal-500" />
                <span className="text-xs">{term?.upvotes}</span>
                <ArrowDown className="cursor-pointer hover:text-teal-500" />
                <span className="text-xs">{term?.downvotes}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Share2 className="cursor-pointer hover:text-rose-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        void navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const subject = `Check out this term: ${term?.term ? term.term : ""}`;
                        const body = `Hi,\n\nI wanted to share this term with you:\n\n${term?.term ? term.term : ""}\n\nDefinition: ${term?.definition ? term.definition : ""}\n\nLink: ${window.location.href}`;
                        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }}
                    >
                      Share via Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <MoreVertical className="cursor-pointer hover:text-yellow-400" />
              </div>
            </div>

            <div className="term-conent">
                <Card className="w-full max-w-screen mx-auto bg-theme text-theme text-left">
                  <CardHeader className="">
                    <div className="flex flex-row items-start gap-2">
                      <Badge variant="secondary" className="bg-accent text-sm">{term?.domain}</Badge>
                      <Badge variant="destructive" className={`bg-accent text-sm ${languageClass} text-theme`}>{term?.language}</Badge>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl mt-4">{term?.term}</CardTitle>
                    <div className="h-px bg-muted my-4 w-full" />
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <section>
                      <h3 className="font-semibold text-2xl mb-2">Description</h3>
                      <p className="text-sm leading-relaxed">
                        {term?.definition}
                      </p>
                    </section>

                    <section className="text-theme">
                      { relatedTerms.length === 0 ? null : (
                        <div>
                          <h3 className="font-semibold text-2xl mb-2">Related Terms</h3>
                          <div className="flex flex-wrap gap-2 text-theme text-3xl">
                            {relatedTerms[0] ? (<Badge variant="outline" className="text-sm text-theme">{<Link to={`/term/${relatedTerms[0].language}/${relatedTerms[0].term}/${relatedTerms[0].id}`}>${relatedTerms[0].term}</Link>}</Badge>) : null}
                            {relatedTerms[1] ? (<Badge variant="outline" className="text-sm text-theme">{<Link to={`/term/${relatedTerms[1].language}/${relatedTerms[1].term}/${relatedTerms[1].id}`}>${relatedTerms[1].term}</Link>}</Badge>) : null}
                            {relatedTerms[2] ? (<Badge variant="outline" className="text-sm text-theme">{<Link to={`/term/${relatedTerms[2].language}/${relatedTerms[2].term}/${relatedTerms[2].id}`}>${relatedTerms[2].term}</Link>}</Badge>) : null}
                          </div>
                        </div>
                    )}
                    </section>

                    <section>
                      <h3 className="font-semibold mb-2 text-2xl">Comments</h3>
                      <div className="border border-muted rounded-md p-4 min-h-[100px] bg-muted/30">
                        {/* Comment content can go here later */}
                      </div>
                    </section>
                  </CardContent>
                </Card>
              </div>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TermPage;
