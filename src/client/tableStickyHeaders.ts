function getTableScrollWidth() {
  const tables = document.querySelectorAll<HTMLTableElement>('.markdown table');
  const tableWidths = Array.from(tables, (table) => {
    const tableLeft = table.getBoundingClientRect().left + window.scrollX;

    return Math.ceil(tableLeft + table.scrollWidth);
  });

  return Math.max(window.innerWidth, ...tableWidths);
}

function getStickyTop() {
  const navbar = document.querySelector<HTMLElement>('.navbar');

  return navbar?.getBoundingClientRect().height ?? 0;
}

function getActiveSubheader(subheaders: HTMLTableCellElement[], subheaderTop: number) {
  for (let index = subheaders.length - 1; index >= 0; index -= 1) {
    const subheader = subheaders[index];

    if (subheader.getBoundingClientRect().top <= subheaderTop) {
      return subheader;
    }
  }

  return undefined;
}

function updateStickySubheaders() {
  const stickyTop = getStickyTop();

  document.querySelectorAll<HTMLTableElement>('.markdown table').forEach((table) => {
    const header = table.querySelector<HTMLTableSectionElement>('thead');
    const subheaders = Array.from(
      table.querySelectorAll<HTMLTableCellElement>('tbody tr > td[colspan]'),
    );
    const clearSubheaderState = () => {
      subheaders.forEach((subheader) => {
        subheader.classList.remove(
          'antitrust-table-subheader-active',
          'antitrust-table-subheader-past',
        );
        subheader.style.removeProperty('--antitrust-table-subheader-offset');
      });
    };

    if (!header || subheaders.length === 0) {
      clearSubheaderState();
      return;
    }

    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    const subheaderTop = stickyTop + headerHeight - 1;
    const tableRect = table.getBoundingClientRect();

    if (tableRect.top > subheaderTop || tableRect.bottom <= subheaderTop) {
      clearSubheaderState();
      return;
    }

    const activeSubheader = getActiveSubheader(subheaders, subheaderTop);

    if (!activeSubheader) {
      clearSubheaderState();
      return;
    }

    const activeIndex = subheaders.indexOf(activeSubheader);
    const nextSubheader = subheaders[activeIndex + 1];
    const activeHeight = activeSubheader.getBoundingClientRect().height;
    const nextTop = nextSubheader?.getBoundingClientRect().top;
    const overlap = nextTop !== undefined
      ? Math.max(0, Math.min(activeHeight, subheaderTop + activeHeight - nextTop))
      : 0;

    subheaders.forEach((subheader, index) => {
      const isActive = subheader === activeSubheader;
      const isPast = index < activeIndex;

      subheader.classList.toggle('antitrust-table-subheader-active', isActive);
      subheader.classList.toggle('antitrust-table-subheader-past', isPast);

      if (isActive) {
        subheader.style.setProperty(
          '--antitrust-table-subheader-offset',
          `${overlap * -1}px`,
        );
      } else {
        subheader.style.removeProperty('--antitrust-table-subheader-offset');
      }
    });
  });
}

function updateStickyTableLayout() {
  document.querySelectorAll<HTMLTableElement>('.markdown table').forEach((table) => {
    const header = table.querySelector<HTMLTableSectionElement>('thead');

    if (!header) {
      return;
    }

    table.style.setProperty(
      '--antitrust-table-sticky-header-height',
      `${Math.ceil(header.getBoundingClientRect().height)}px`,
    );
  });

  document.documentElement.style.setProperty(
    '--antitrust-page-scroll-width',
    `${getTableScrollWidth()}px`,
  );

  updateStickySubheaders();
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
  window.addEventListener('scroll', scheduleStickyTableLayoutUpdate, {passive: true});
  window.addEventListener('resize', scheduleStickyTableLayoutUpdate);
  document.fonts?.ready.then(scheduleStickyTableLayoutUpdate).catch(() => {});

  return () => {
    observer?.disconnect();
    window.removeEventListener('scroll', scheduleStickyTableLayoutUpdate);
    window.removeEventListener('resize', scheduleStickyTableLayoutUpdate);
    document
      .querySelectorAll('.antitrust-table-subheader-active, .antitrust-table-subheader-past')
      .forEach((subheader) => {
        subheader.classList.remove(
          'antitrust-table-subheader-active',
          'antitrust-table-subheader-past',
        );
        (subheader as HTMLElement).style.removeProperty(
          '--antitrust-table-subheader-offset',
        );
      });
  };
}

export function onRouteDidUpdate() {
  return setupTableStickyHeaders();
}
