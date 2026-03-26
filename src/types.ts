/**
 * Parameter um Steuerbetrag zu berechnen
 */
export interface Parameter {
  /**
   * Jahr oder Intervall von Jahren für das die Parameter gelten
   */
  year: number | [number, number];
  /**
   * Stück der Steuerbetragsfunktion
   */
  pieces: Piece[];
}

/**
 * Stück der Steuerbetragsfunktion
 */
export interface Piece {
  /**
   * Anfang des zvE
   */
  start: number;
  /**
   * Ende des zvE
   */
  end: number;
  /**
   * Steuerbetragsfunktion
   */
  amount: (zvE: number) => number;
  /**
   * Grenzsteuersatzfunktion
   */
  rateMargin: (zvE: number) => number;
}
