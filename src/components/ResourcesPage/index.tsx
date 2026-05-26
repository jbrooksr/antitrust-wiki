import type {ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type SidebarLink = {
  id: string;
  label: string;
};

type ResourcesPageProps = {
  children: ReactNode;
  sidebarLinks: SidebarLink[];
};

export default function ResourcesPage({
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
          <p className={styles.subtitle}>
            A focused starting point for antitrust commentary, research, and
            longer-form references.
          </p>
        </div>
      </header>
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
