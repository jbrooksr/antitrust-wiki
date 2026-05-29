import type {ReactNode} from 'react';
import ResourcesPage from '@site/src/components/ResourcesPage';
import TechnicalResourcesContent from '@site/src/content/resources-technical.md';

const sidebarLinks = [
  {id: 'agency-guidance-and-policy', label: 'Agency Guidance'},
  {id: 'academic-texts', label: 'Academic Texts'},
  {id: 'journals', label: 'Journals'},
  {id: 'economic-methods', label: 'Economic Methods'},
  {id: 'empirical-data', label: 'Empirical Data'},
  {id: 'working-papers', label: 'Working Papers'},
  {id: 'treatises-and-advanced-texts', label: 'Advanced Texts'},
];

export default function TechnicalResources(): ReactNode {
  return (
    <ResourcesPage activeView="technical" sidebarLinks={sidebarLinks}>
      <TechnicalResourcesContent />
    </ResourcesPage>
  );
}
