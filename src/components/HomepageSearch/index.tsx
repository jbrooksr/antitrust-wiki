import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useContextualSearchFilters} from '@docusaurus/theme-common';

type SearchDocument = {
  id?: number;
  pageTitle: string;
  sectionRoute: string;
  sectionTitle: string;
  type?: string;
};

type SearchResult = SearchDocument & {
  score: number;
};

const FALLBACK_DOCUMENTS: SearchDocument[] = [
  {
    pageTitle: 'Law',
    sectionTitle: 'Law',
    sectionRoute: '/docs/antitrust/law/overview',
    type: 'docs',
  },
  {
    pageTitle: 'Economics',
    sectionTitle: 'Economics',
    sectionRoute: '/docs/antitrust/economics/test',
    type: 'docs',
  },
  {
    pageTitle: 'Blog',
    sectionTitle: 'Blog',
    sectionRoute: '/blog',
    type: 'blog',
  },
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scoreDocument(document: SearchDocument, query: string): number {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const terms = normalizedQuery.split(/\s+/);
  const sectionTitle = normalizeText(document.sectionTitle);
  const pageTitle = normalizeText(document.pageTitle);
  const route = normalizeText(document.sectionRoute);
  const haystack = `${sectionTitle} ${pageTitle} ${route}`;

  let score = 0;

  for (const term of terms) {
    if (sectionTitle === term || pageTitle === term) {
      score += 80;
    } else if (sectionTitle.startsWith(term) || pageTitle.startsWith(term)) {
      score += 50;
    } else if (sectionTitle.includes(term) || pageTitle.includes(term)) {
      score += 30;
    } else if (route.includes(term)) {
      score += 12;
    } else if (haystack.includes(term.slice(0, Math.max(2, term.length - 1)))) {
      score += 4;
    }
  }

  if (sectionTitle === pageTitle) {
    score += 4;
  }

  return score;
}

function dedupeDocuments(documents: SearchDocument[]): SearchDocument[] {
  const seen = new Set<string>();

  return documents.filter((document) => {
    const key = `${document.sectionRoute}|${document.sectionTitle}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function fetchDocuments(baseUrl: string, tags: string[]): Promise<SearchDocument[]> {
  const uniqueTags = [...new Set(tags)];
  const indexes = await Promise.all(
    uniqueTags.map(async (tag) => {
      try {
        const response = await fetch(`${baseUrl}search-index-${tag}.json`);
        if (!response.ok) {
          return [];
        }

        const json = await response.json();
        return Array.isArray(json.documents) ? json.documents : [];
      } catch {
        return [];
      }
    }),
  );

  return dedupeDocuments([...indexes.flat(), ...FALLBACK_DOCUMENTS]);
}

export default function HomepageSearch(): React.ReactElement {
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const {tags} = useContextualSearchFilters();
  const tagsKey = tags.join(',');
  const searchRef = useRef<HTMLDivElement>(null);
  const [documents, setDocuments] = useState<SearchDocument[]>(FALLBACK_DOCUMENTS);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    fetchDocuments(baseUrl, tagsKey.split(',')).then((nextDocuments) => {
      if (isCurrent) {
        setDocuments(nextDocuments.length > 0 ? nextDocuments : FALLBACK_DOCUMENTS);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [baseUrl, tagsKey]);

  const results = useMemo<SearchResult[]>(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return [];
    }

    return documents
      .map((document) => ({
        ...document,
        score: scoreDocument(document, trimmedQuery),
      }))
      .filter((document) => document.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [documents, query]);

  const showPanel = isFocused && query.trim().length > 0;

  return (
    <div
      className="dsla-search-wrapper inline-search"
      ref={searchRef}
      onBlur={(event) => {
        if (!searchRef.current?.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}>
      <form
        className="aa-Form inline-search__form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) {
            window.location.assign(results[0].sectionRoute);
          }
        }}>
        <button
          className="aa-SubmitButton inline-search__submit"
          type="submit"
          title="Search"
          aria-label="Search">
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6.5 11.5a5 5 0 1 1 3.17-8.87 5 5 0 0 1 .74 6.95l3.5 3.5-1.06 1.06-3.5-3.5A4.98 4.98 0 0 1 6.5 11.5Zm0-1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            />
          </svg>
        </button>
        <input
          className="aa-Input inline-search__input"
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button
            className="aa-ClearButton inline-search__clear"
            type="button"
            title="Clear"
            aria-label="Clear"
            onClick={() => {
              setQuery('');
            }}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="m13.41 12 4.3-4.29-1.42-1.42-4.29 4.3-4.29-4.3-1.42 1.42 4.3 4.29-4.3 4.29 1.42 1.42 4.29-4.3 4.29 4.3 1.42-1.42-4.3-4.29Z"
              />
            </svg>
          </button>
        )}
      </form>
      {showPanel && (
        <div className="aa-Panel inline-search__panel" role="listbox">
          {results.length > 0 ? (
            <ul className="aa-List inline-search__list">
              {results.map((result) => (
                <li
                  className="aa-Item"
                  key={`${result.sectionRoute}|${result.sectionTitle}`}
                  role="option">
                  <Link
                    className="aa-ItemLink inline-search__result"
                    to={result.sectionRoute}
                    onMouseDown={(event) => event.preventDefault()}>
                    <span className="aa-ItemContent">
                      <span className="aa-ItemContentBody">
                        <span className="aa-ItemContentTitle">
                          {result.sectionTitle}
                        </span>
                        {result.pageTitle !== result.sectionTitle && (
                          <span className="aa-ItemContentDescription">
                            {result.pageTitle}
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="aa-SourceNoResults inline-search__message">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
