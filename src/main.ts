// @deno-types="npm:@types/d3@7"
import { range } from "d3";
import { Inflation } from "@vwkd/inflation";
import type { Parameter, Point, Value } from "./types.ts";
import { parameters } from "./data.ts";

export type { Point, Value } from "./types.ts";

/**
 * Einkommensteuerrechner für Deutschland
 */
export class Steuer {
  #year: number;
  #parameter: Parameter;
  #inflation: Inflation;

  /**
   * Erstelle Einkommensteuerrechner für Jahr
   *
   * @param year Jahr
   */
  constructor(year: number, inflation: Inflation) {
    const parameter = parameters.find(({ year: y }) =>
      Array.isArray(y) ? y[0] <= year && year <= y[1] : y === year
    );

    if (parameter === undefined) {
      throw new Error(`Parameter for year '${year}' not found`);
    }

    this.#year = year;
    this.#parameter = parameter;
    this.#inflation = inflation;
  }

  /**
   * Liste die Jahre
   *
   * @returns Liste der Jahre
   */
  static get jahre(): number[] {
    return parameters.flatMap(({ year }) =>
      Array.isArray(year) ? range(year[0], year[1] + 1) : year
    );
  }

  /**
   * Punkte für Grundfreibeträge
   *
   * - bis 2001 in Deutsche Mark (DM)
   * - ab 2002 in Euro (€)
   * @returns Punkte für Grundfreibeträge
   */
  static get grundfreibetrag_data(): Value[] {
    return parameters.flatMap(({ year, pieces }) => {
      const basicAllowance = pieces.at(0)!.end;

      if (Array.isArray(year)) {
        return Array.from(
          { length: year[1] - year[0] + 1 },
          (_, i) => ({
            Jahr: year[0] + i,
            Wert: basicAllowance,
          }),
        );
      } else {
        return {
          Jahr: year,
          Wert: basicAllowance,
        };
      }
    });
  }

  /**
   * Liste Jahr
   *
   * @returns Jahr
   */
  jahr(): number {
    return this.#year;
  }

  /**
   * Liste Eckwerte des zvE
   *
   * - Merke: Eckwerte sind "bis", nicht "ab"
   * @returns Liste der Eckwerte des zvE
   */
  eckwerte(): number[] {
    return this.#parameter.pieces
      .map(({ end }) => end)
      .filter((end) => end !== Infinity);
  }

  /**
   * Berechne Steuerbetrag
   *
   * @param {number} zvE zu versteuerndes Einkommen
   * @returns {number} Steuerbetrag
   */
  steuerbetrag(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    // note: assumes pieces are sorted by start
    const piece = this.#parameter.pieces
      .find((p) => p.end === undefined || zvE <= p.end);

    if (piece === undefined) {
      throw new Error("unreachable");
    }

    return piece.amount(zvE);
  }

  /**
   * Berechne Durchschnittssteuersatz
   *
   * @param {number} zvE zu versteuerndes Einkommen
   * @returns {number} Steuersatz
   */
  steuersatz(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    if (zvE == 0) {
      return 0;
    }

    return this.steuerbetrag(zvE) / zvE;
  }

  /**
   * Berechne Grenzsteuersatz
   *
   * @param {number} zvE zu versteuerndes Einkommen
   * @returns {number} Grenzsteuersatz
   */
  grenzsteuersatz(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    // note: assumes pieces are sorted by start
    const piece = this.#parameter.pieces
      .find((p) => p.end === undefined || zvE <= p.end);

    if (piece === undefined) {
      throw new Error("unreachable");
    }

    return piece.rateMargin(zvE);
  }

  /**
   * Berechne Rabatt auf Kosten durch Absetzung
   *
   * @param {number} K Kosten
   * @param {number} B Bemessungsgrundlage
   * @returns {number} Rabatt auf Kosten durch Absetzung
   */
  rabatt(K: number, B: number): number {
    if (K < 0) {
      throw new Error("Kosten können nicht negativ sein");
    }

    if (B < 0) {
      throw new Error("Bemessungsgrundlage kann nicht negativ sein");
    }

    return this.steuerbetrag(B) - this.steuerbetrag(B - K);
  }

  /**
   * Sample nominalen Steuerbetrag
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Steuerbeträge
   */
  steuerbetrag_data(start = 0, end = 350_000, steps = 1000): Point[] {
    const year = this.#year;
    const breakpointStart = this.#parameter.pieces.at(0)!.end;
    const breakpointEnd = this.#parameter.pieces.at(-2)!.end;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > breakpointStart) {
      throw new Error(
        `Start '${start}' must be less or equal to first breakpoint '${breakpointStart}'`,
      );
    }

    if (end < breakpointEnd) {
      throw new Error(
        `End '${end}' must be greater or equal to last breakpoint '${breakpointEnd}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.steuerbetrag(zvE),
        Wertart: "Nominalwert",
        Jahr: year,
      }));
  }

  /**
   * Sample realen Steuerbetrag
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Steuerbeträge
   */
  steuerbetrag_real_data(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const year = this.#year;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const sb = this.steuerbetrag_data(start, end, steps);

    return sb.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, year, baseyear),
      Wert: this.#inflation.adjust(point.Wert, year, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Durchschnittssteuersatz
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Durchschnittssteuersätze
   */
  steuersatz_data(start = 0, end = 350_000, steps = 1000): Point[] {
    const year = this.#year;
    const breakpointStart = this.#parameter.pieces.at(0)!.end;
    const breakpointEnd = this.#parameter.pieces.at(-2)!.end;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > breakpointStart) {
      throw new Error(
        `Start '${start}' must be less or equal to first breakpoint '${breakpointStart}'`,
      );
    }

    if (end < breakpointEnd) {
      throw new Error(
        `End '${end}' must be greater or equal to last breakpoint '${breakpointEnd}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.steuersatz(zvE),
        Wertart: "Nominalwert",
        Jahr: year,
      }));
  }

  /**
   * Sample realen Durchschnittssteuersatz
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Durchschnittssteuersätze
   */
  steuersatz_real_data(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const year = this.#year;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const sd = this.steuersatz_data(start, end, steps);

    return sd.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, year, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Grenzsteuersatz
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Grenzsteuersätze
   */
  grenzsteuersatz_data(start = 0, end = 350_000, steps = 1000): Point[] {
    const year = this.#year;
    const breakpointStart = this.#parameter.pieces.at(0)!.end;
    const breakpointEnd = this.#parameter.pieces.at(-2)!.end;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > breakpointStart) {
      throw new Error(
        `Start '${start}' must be less or equal to first breakpoint '${breakpointStart}'`,
      );
    }

    if (end < breakpointEnd) {
      throw new Error(
        `End '${end}' must be greater or equal to last breakpoint '${breakpointEnd}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.grenzsteuersatz(zvE),
        Wertart: "Nominalwert",
        Jahr: year,
      }));
  }

  /**
   * Sample realen Grenzsteuersatz
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Grenzsteuersätze
   */
  grenzsteuersatz_real_data(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const year = this.#year;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const sd = this.grenzsteuersatz_data(start, end, steps);

    return sd.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, year, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }
}
