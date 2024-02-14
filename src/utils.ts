/**
 * Convert table notation to object notation
 *
 * - assumes each row has same length
 * @param table array of arrays, first element is header
 */
export function table_to_object<T extends number | string | boolean>(
  table: [string[], ...T[][]],
) {
  const headers = table[0];
  const rows = table.slice(1) as T[][];

  return rows.map((row) =>
    Object.fromEntries(row.map((cell, i) => [headers[i], cell]))
  );
}
