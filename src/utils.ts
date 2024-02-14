// todo: add more rows

/**
 * Row of table with row-based data
 *
 * ## Example
 *
 * ```
 * { x: 1, y1: 11, y2: 101 }
 * ```
 */
export type RRow<
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
> = K3 extends never ? {
    [P in K1 | K2]: P extends K1 ? V1
      : V2;
  }
  : K4 extends never ? {
      [P in K1 | K2 | K3]: P extends K1 ? V1
        : P extends K2 ? V2
        : V3;
    }
  : {
    [P in K1 | K2 | K3 | K4]: P extends K1 ? V1
      : P extends K2 ? V2
      : P extends K3 ? V3
      : V4;
  };

/**
 * Table with row-based data
 *
 * ## Example
 *
 * ```
 * [
 *   { x: 1, y1: 11, y2: 101 },
 *   { x: 2, y1: 12, y2: 102 },
 *   // ...
 * ]
 * ```
 */
export type RTable<
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
> = RRow<K1, V1, K2, V2, K3, V3, K4, V4>[];

/**
 * Row of table with single-column row-based data
 *
 * ## Example
 *
 * ```
 * { x: 1, y: 100, title: "y1" }
 * ```
 */
export type RSRow<
  K2new extends string,
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
> = K3 extends never ? {
    [P in K1 | K2new | "title"]: P extends K1 ? V1
      : P extends K2new ? V2
      : K2;
  }
  : K4 extends never ?
      & {
        [P in K1 | K2new | "title"]: P extends K1 ? V1
          : P extends K2new ? V2
          : K2;
      }
      & {
        [P in K1 | K2new | "title"]: P extends K1 ? V1
          : P extends K2new ? V3
          : K3;
      }
  :
    & {
      [P in K1 | K2new | "title"]: P extends K1 ? V1
        : P extends K2new ? V2
        : K2;
    }
    & {
      [P in K1 | K2new | "title"]: P extends K1 ? V1
        : P extends K2new ? V3
        : K3;
    }
    & {
      [P in K1 | K2new | "title"]: P extends K1 ? V1
        : P extends K2new ? V4
        : K4;
    };

/**
 * Table with single-column row-based data
 *
 * ## Example
 *
 * ```
 * [
 *   { x: 1, y: 100, title: "y1" },
 *   { x: 2, y: 101, title: "y1" },
 *   // ...
 *   { x: 1, y: 200, title: "y2" },
 *   { x: 2, y: 201, title: "y2" },
 *   // ...
 * ];
 * ```
 */
export type RSTable<
  K2new extends string,
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
> = RSRow<K2new, K1, V1, K2, V2, K3, V3, K4, V4>[];

/**
 * Row of table with column-based data
 *
 * ## Example
 *
 * ```
 * [1, 11, 101]
 * ```
 */
export type CRow<V1, V2, V3 = never, V4 = never> = [V1, V2] | [V1, V2, V3] | [
  V1,
  V2,
  V3,
  V4,
];

/**
 * Table with column-based data
 *
 * ## Example
 *
 * ```
 * [
 *   ["x", "y1", "y2"],
 *   [1, 11, 101],
 *   [2, 12, 102],
 *   // ...
 * ]
 * ```
 */
export type CTable<
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
> = [
  CRow<K1, K2, K3, K4>,
  ...CRow<V1, V2, V3, V4>[],
];

/**
 * Convert column-based table to row-based
 *
 * - note: assumes each row has same length
 *
 * ## Example
 *
 * - input
 *
 * ```js
 * [
 *   ["x", "y1", "y2"],
 *   [1, 100, 200],
 *   [2, 101, 201],
 *   // ...
 * ];
 * ```
 *
 * - output
 *
 * ```js
 * [
 *   { x: 1, y1: 100, y2: 200 },
 *   { x: 2, y1: 101, y2: 201 },
 *   // ...
 * ];
 * ```
 *
 * @param table array of column-based rows, first element is header row
 * @returns array of row-based rows
 */
export function table_row_based<
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
>(
  table: CTable<K1, V1, K2, V2, K3, V3, K4, V4>,
): RTable<K1, V1, K2, V2, K3, V3, K4, V4> {
  const headers = table[0];
  const rows = table.slice(1) as CRow<V1, V2, V3, V4>[];

  return rows.map((row) =>
    Object.fromEntries(
      row.map((
        cell,
        i,
      ) => ([headers[i], cell] as [K1, V1] | [K2, V2] | [K3, V3] | [K4, V4])),
    )
  );
}

/**
 * Convert table with multiple columns to longer table with single columns
 *
 * - beware: assumes each row has same columns
 * - beware: assumes key is in object
 *
 * ## Example
 *
 * - input
 *
 * ```js
 * [
 *   { x: 1, y1: 100, y2: 200 },
 *   { x: 2, y1: 101, y2: 201 },
 *   // ...
 * ];
 * ```
 *
 * - output
 *
 * ```js
 * [
 *   { x: 1, y: 100, title: "y1" },
 *   { x: 2, y: 101, title: "y1" },
 *   // ...
 *   { x: 1, y: 200, title: "y2" },
 *   { x: 2, y: 201, title: "y2" },
 *   // ...
 * ];
 * ```
 *
 * @param table row-based table with multiple columns
 * @param columnDomain name of input column, existing name in table
 * @param columnRange name of output column, new name
 * @returns row-based table with single column
 */
export function table_single_column<
  K2new extends string,
  K1 extends string,
  V1,
  K2 extends string,
  V2,
  K3 extends string = never,
  V3 = never,
  K4 extends string = never,
  V4 = never,
>(
  table: RTable<K1, V1, K2, V2, K3, V3, K4, V4>,
  columnDomain: K1,
  columnRange: K2new,
): RSTable<K2new, K1, V1, K2, V2, K3, V3, K4, V4> {
  return table.flatMap((row) => {
    const x = row[columnDomain];

    return Object
      .entries(row)
      .filter(([k, _v]) => k !== columnDomain)
      .map((
        [k, y],
      ) => ({ [columnDomain]: x, [columnRange]: y, title: k } as RSRow<
        K2new,
        K1,
        V1,
        K2,
        V2,
        K3,
        V3,
        K4,
        V4
      >));
  });
}
