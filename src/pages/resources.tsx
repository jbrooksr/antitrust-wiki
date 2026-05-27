import type {ReactNode} from 'react';
import ResourcesPage from '@site/src/components/ResourcesPage';
import ResourcesContent from '@site/src/content/resources.md';

const sidebarLinks = [
  {id: 'blogs', label: 'Blogs'},
  {id: 'podcasts', label: 'Podcasts'},
  {id: 'journals', label: 'Journals'},
  {id: 'academic-texts', label: 'Academic Texts'},
  {id: 'books', label: 'Books'},
];

export default function Resources(): ReactNode {
  return (
    <ResourcesPage activeView="introductory" sidebarLinks={sidebarLinks}>
      <ResourcesContent />
    </ResourcesPage>
  );
}
