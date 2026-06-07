function getTableScrollWidth() {
  const tables = document.querySelectorAll<HTMLTableElement>('.markdown table');
  const tableWidths = Array.from(tables, (table) => {
    const tableLeft = table.getBoundingClientRect().left + window.scrollX;

    return Math.ceil(tableLeft + table.scrollWidth);
  });

  return Math.max(window.innerWidth, ...tableWidths);
}

function updateStickyTableLayout() {
  document.querySelectorAll<HTMLTableElement>('.markdown table').forEach((table) => {
    const header = table.querySelector<HTMLTableSectionElement>('thead');
    const subheaders = table.querySelectorAll<HTMLTableCellElement>(
      'tbody tr > td[colspan]',
    );

    if (!header) {
      return;
    }

    table.style.setProperty(
      '--antitrust-table-sticky-header-height',
      `${Math.ceil(header.getBoundingClientRect().height)}px`,
    );

    const subheaderHeight = Math.max(
      0,
      ...Array.from(subheaders, (subheader) =>
        Math.ceil(subheader.getBoundingClientRect().height),
      ),
    );

    table.style.setProperty(
      '--antitrust-table-sticky-subheader-height',
      `${subheaderHeight}px`,
    );
  });

  document.documentElement.style.setProperty(
    '--antitrust-page-scroll-width',
    `${getTableScrollWidth()}px`,
  );
}

function scheduleStickyTableLayoutUpdate() {
  requestAnimationFrame(updateStickyTableLayout);
}

function observeTableHeaders() {
  if (typeof ResizeObserver === 'undefined') {
    return undefined;
  }

  const observer = new ResizeObserver(scheduleStickyTableLayoutUpdate);

  document
    .querySelectorAll<HTMLElement>('.markdown table thead, .markdown table tbody tr > td[colspan]')
    .forEach((stickyTableCell) => observer.observe(stickyTableCell));

  return observer;
}

function setupTableStickyHeaders() {
  const observer = observeTableHeaders();

  scheduleStickyTableLayoutUpdate();
  window.addEventListener('resize', scheduleStickyTableLayoutUpdate);
  document.fonts?.ready.then(scheduleStickyTableLayoutUpdate).catch(() => {});

  return () => {
    observer?.disconnect();
    window.removeEventListener('resize', scheduleStickyTableLayoutUpdate);
  };
}

export function onRouteDidUpdate() {
  return setupTableStickyHeaders();
}
