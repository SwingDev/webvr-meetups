import { GRID_COLUMNS } from '../config';

export default array => (
  array.reduce((acc, item, index) => {
    const columnIndex = index % GRID_COLUMNS;

    if (!acc[columnIndex]) {
      acc[columnIndex] = [];
    }

    acc[columnIndex].push(item);

    return acc;
  }, [])
);
