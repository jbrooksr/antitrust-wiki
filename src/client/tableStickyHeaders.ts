function updateTableHeaderOffsets() {
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
}

function scheduleTableHeaderOffsetUpdate() {
  requestAnimationFrame(updateTableHeaderOffsets);
}

function observeTableHeaders() {
  if (typeof ResizeObserver === 'undefined') {
    return undefined;
  }

  const observer = new ResizeObserver(scheduleTableHeaderOffsetUpdate);

  document
    .querySelectorAll<HTMLElement>('.markdown table thead, .markdown table tbody tr > td[colspan]')
    .forEach((stickyTableCell) => observer.observe(stickyTableCell));

  return observer;
}

function setupTableStickyHeaders() {
  const observer = observeTableHeaders();

  scheduleTableHeaderOffsetUpdate();
  window.addEventListener('resize', scheduleTableHeaderOffsetUpdate);
  document.fonts?.ready.then(scheduleTableHeaderOffsetUpdate).catch(() => {});

  return () => {
    observer?.disconnect();
    window.removeEventListener('resize', scheduleTableHeaderOffsetUpdate);
  };
}

export function onRouteDidUpdate() {
  return setupTableStickyHeaders();
}
