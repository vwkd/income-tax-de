import type { Currency, Parameter, Year, Years } from "./types.ts";
import { currencies, parameters, years } from "./data.ts";

/**
 * Einkommensteuerrechner für Deutschland
 *
 * - bis 2001 in Deutsche Mark (DM)
 * - ab 2002 in Euro (€)
 */
export class IncomeTax<Y extends Year> {
  #year: Y;
  #parameter: Parameter;

  /**
   * Erstelle Einkommensteuerrechner für Jahr
   *
   * @param year Jahr
   */
  constructor(year: Y) {
    const parameter = parameters.find(({ fromYear, toYear }) =>
      fromYear <= year && year <= toYear
    );

    if (parameter === undefined) {
      throw new Error(`Parameter for year '${year}' not found`);
    }

    this.#year = year;
    this.#parameter = parameter;
  }

  /**
   * Liste die Jahre
   *
   * @returns Liste der Jahre
   */
  static get years(): Years {
    return years;
  }

  /**
   * Liste verwendete Währungen
   *
   * @returns verwendete Währungen
   */
  static get currencies(): Currency[] {
    return currencies;
  }

  /**
   * Liste Jahr
   *
   * @returns Jahr
   */
  get year(): Y {
    return this.#year;
  }

  /**
   * Liste Währung
   *
   * @returns Währung
   */
  get currency(): Currency {
    return this.#parameter.currency;
  }

  /**
   * Liste Eckwerte des zvE
   *
   * - Merke: Eckwerte sind "bis", nicht "ab"
   * @returns Liste der Eckwerte des zvE
   */
  get breakpoints(): number[] {
    return this.#parameter.pieces
      .map(({ end }) => end)
      .filter((end) => end !== Infinity);
  }

  /**
   * Berechne Steuerbetrag
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Steuerbetrag
   */
  amount(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    // note: pieces are sorted by start
    const piece = this.#parameter.pieces
      .find(({ end }) => end === Infinity || zvE <= end);

    if (piece === undefined) {
      throw new Error("unreachable");
    }

    return piece.amount(zvE);
  }

  /**
   * Berechne Durchschnittssteuersatz
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Steuersatz
   */
  rateAverage(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    if (zvE == 0) {
      return 0;
    }

    return this.amount(zvE) / zvE;
  }

  /**
   * Berechne Grenzsteuersatz
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Grenzsteuersatz
   */
  rateMargin(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    // note: pieces are sorted by start
    const piece = this.#parameter.pieces
      .find(({ end }) => end === Infinity || zvE <= end);

    if (piece === undefined) {
      throw new Error("unreachable");
    }

    return piece.rateMargin(zvE);
  }

  /**
   * Berechne Rabatt auf Kosten durch Absetzung
   *
   * @param K Kosten
   * @param B Bemessungsgrundlage vor Absetzung
   * @returns Rabatt auf Kosten durch Absetzung
   */
  discount(K: number, B: number): number {
    if (K < 0) {
      throw new Error("Kosten können nicht negativ sein");
    }

    if (B < 0) {
      throw new Error("Bemessungsgrundlage kann nicht negativ sein");
    }

    return this.amount(B) - this.amount(B - K);
  }
}
