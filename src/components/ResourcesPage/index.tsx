import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type SidebarLink = {
  id: string;
  label: string;
};

type ResourcesPageProps = {
  activeView: 'introductory' | 'technical';
  children: ReactNode;
  sidebarLinks: SidebarLink[];
};

export default function ResourcesPage({
  activeView,
  children,
  sidebarLinks,
}: ResourcesPageProps): ReactNode {
  return (
    <Layout
      title="Resources"
      description="Antitrust blogs, podcasts, journals, academic texts, and books.">
      <header className={clsx('hero hero--primary', styles.resourcesHero)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Resources
          </Heading>
        </div>
      </header>
      <div className={styles.viewSwitchBand}>
        <nav className={styles.viewSwitch} aria-label="Resource view">
          <Link
            className={clsx(
              styles.viewSwitchLink,
              activeView === 'introductory' && styles.viewSwitchLinkActive,
            )}
            to="/resources"
            aria-current={activeView === 'introductory' ? 'page' : undefined}>
            Introductory
          </Link>
          <Link
            className={clsx(
              styles.viewSwitchLink,
              activeView === 'technical' && styles.viewSwitchLinkActive,
            )}
            to="/resources/technical"
            aria-current={activeView === 'technical' ? 'page' : undefined}>
            Technical
          </Link>
        </nav>
      </div>
      <main className={styles.resourcesMain}>
        <div className={clsx('container', styles.resourcesLayout)}>
          <aside className={styles.sidebar} aria-label="Resources sections">
            <nav>
              <ul className={styles.sidebarList}>
                {sidebarLinks.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className={styles.content}>{children}</div>
        </div>
      </main>
    </Layout>
  );
}
