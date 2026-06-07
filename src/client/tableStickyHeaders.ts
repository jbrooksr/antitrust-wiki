function updateTableHeaderOffsets() {
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
    .querySelectorAll<HTMLElement>('.markdown table thead')
    .forEach((header) => observer.observe(header));

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
