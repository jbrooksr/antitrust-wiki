import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  href: string;
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Law',
    href: '/docs/antitrust/law/test',
    Icon: ScalesIcon,
  },
  {
    title: 'Economics',
    href: '/docs/antitrust/economics/test',
    Icon: SupplyDemandIcon,
  },
  {
    title: 'Blog',
    href: '/blog',
    Icon: PaperIcon,
  },
  {
    title: 'Resources',
    href: '/resources',
    Icon: BookshelfIcon,
  },
];

function ScalesIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <path d="M75 18c0-7 5-14 5-14s5 7 5 14c0 5-2 9-4 11v8h9c2-5 6-8 11-8 12 0 24 14 37 14 6 0 10-3 12-8 2-1 4 1 3 3-2 8-8 13-16 13-14 0-26-12-36-12-6 0-9 4-10 9h-7v6h7c3 0 5 2 5 5s-2 5-5 5h-2l10 64h7c11 0 20 8 22 18h6c6 0 11 5 11 11v3H25v-3c0-6 5-11 11-11h6c2-10 11-18 22-18h7l10-64h-2c-3 0-5-2-5-5s2-5 5-5h7v-6h-7c-1-5-4-9-10-9-10 0-22 12-36 12-8 0-14-5-16-13-1-2 1-4 3-3 2 5 6 8 12 8 13 0 25-14 37-14 5 0 9 3 11 8h9v-8c-2-2-4-6-4-11Z" />
        <path d="M35 51h3l-20 59h37L35 51Z" />
        <path d="M20 111h33c-2 10-9 16-17 16s-15-6-16-16Z" />
        <path d="M125 51h-3l20 59h-37l20-59Z" />
        <path d="M140 111h-33c2 10 9 16 17 16s15-6 16-16Z" />
      </g>
    </svg>
  );
}

function SupplyDemandIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 124V30" />
        <path d="M36 124h96" />
        <path d="M46 112c22-52 44-72 78-82" />
        <path d="M46 38c24 48 48 70 78 76" />
        <path d="M44 42 46 38l5 1" />
        <path d="M119 31 124 30l2 5" />
        <path d="M120 109 124 114l-6 2" />
        <path d="M74 74h28" />
        <path d="M92 64v20" />
      </g>
    </svg>
  );
}

function PaperIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 24h43l25 25v87H50V24Z" />
        <path d="M93 24v25h25" />
        <path d="M66 72c8-8 16 8 24 0s16 8 24 0" />
        <path d="M66 92c10-7 17 7 28 0 8-5 13 1 20 2" />
        <path d="M66 112c12-6 22 6 34 0" />
      </g>
    </svg>
  );
}

function BookshelfIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 126h96" />
        <path d="M40 34h18v92H40z" />
        <path d="M58 34h18v92H58z" />
        <path d="M78 42h18v84H78z" />
        <path d="M98 38l16-4 22 86-16 4z" />
        <path d="M46 52h6" />
        <path d="M64 58h6" />
        <path d="M84 64h6" />
        <path d="M45 108h8" />
        <path d="M63 108h8" />
        <path d="M83 108h8" />
        <path d="M118 104l8-2" />
      </g>
    </svg>
  );
}

function Feature({title, href, Icon}: FeatureItem) {
  return (
    <div className={styles.featureItem}>
      <Link className={styles.featureLink} to={href} aria-label={`Go to ${title}`}>
        <span className={styles.iconFrame}>
          <Icon className={styles.featureIcon} />
        </span>
        <Heading as="h3">{title}</Heading>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
