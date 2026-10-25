document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[role="grid"]');
  const announcer = document.getElementById('sr-announcer');
  if (!grid) return;

  function announceToScreenReader(message) {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }

  grid.addEventListener('keydown', (event) => {
    const currentCell = document.activeElement;

    if (!currentCell || currentCell.getAttribute('role') !== 'gridcell') return;

    if (event.key === 'Tab') {
      return;
    }

    const currentRow = currentCell.parentElement;
    const allCellsInRow = Array.from(
      currentRow.querySelectorAll('[role="gridcell"]'),
    );
    const currentColumnIdx = allCellsInRow.indexOf(currentCell);

    const allDataRows = Array.from(
      grid.querySelectorAll('[role="row"]'),
    ).filter((row) => row.querySelector('[role="gridcell"]'));
    const currentRowIdx = allDataRows.indexOf(currentRow);

    let targetCell = null;

    switch (event.key) {
      case 'ArrowRight':
        if (currentColumnIdx < allCellsInRow.length - 1) {
          targetCell = allCellsInRow[currentColumnIdx + 1];
        }
        break;
      case 'ArrowLeft':
        if (currentColumnIdx > 0) {
          targetCell = allCellsInRow[currentColumnIdx - 1];
        }
        break;
      case 'ArrowDown':
        if (currentRowIdx < allDataRows.length - 1) {
          const nextRow = allDataRows[currentRowIdx + 1];
          const cellsInNextRow = nextRow.querySelectorAll('[role="gridcell"]');
          targetCell =
            cellsInNextRow[currentColumnIdx] ||
            cellsInNextRow[cellsInNextRow.length - 1];
        }
        break;
      case 'ArrowUp':
        if (currentRowIdx > 0) {
          const prevRow = allDataRows[currentRowIdx - 1];
          const cellsInPrevRow = prevRow.querySelectorAll('[role="gridcell"]');
          targetCell =
            cellsInPrevRow[currentColumnIdx] ||
            cellsInPrevRow[cellsInPrevRow.length - 1];
        }
        break;
      case 'Home':
        targetCell = allCellsInRow[0]; // Korrigiert auf das erste Element des Arrays
        break;
      case 'End':
        targetCell = allCellsInRow[allCellsInRow.length - 1];
        break;
      default:
        return;
    }

    if (targetCell) {
      event.preventDefault();
      currentCell.setAttribute('tabindex', '-1');
      targetCell.setAttribute('tabindex', '0');
      targetCell.focus();

      const targetRowIdx = allDataRows.indexOf(targetCell.parentElement) + 1;
      const targetColIdx =
        Array.from(
          targetCell.parentElement.querySelectorAll('[role="gridcell"]'),
        ).indexOf(targetCell) + 1;
      announceToScreenReader(
        `Zeile ${targetRowIdx}, Spalte ${targetColIdx}: ${targetCell.textContent.trim()}`,
      );
    }
  });
});
