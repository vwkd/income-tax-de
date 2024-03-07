// @deno-types="npm:@types/d3@7"
import { range } from "d3";
import { Inflation } from "@vwkd/inflation";
import type { Parameter, Point } from "./types.ts";

export { values } from "./data/grundfreibetrag.ts";
export { parameters } from "./data/steuerbetrag.ts";

/**
 * Einkommensteuerrechner für Deutschland
 */
export class Steuer {
  #parameter: Parameter;
  #inflation: Inflation;

  /**
   * Erstelle Einkommensteuerrechner für Jahr
   *
   * @param parameter Parameter für Jahr
   */
  constructor(parameter: Parameter, inflation: Inflation) {
    this.#parameter = parameter;
    this.#inflation = inflation;
  }

  /**
   * Liste Jahr
   *
   * @returns Jahr
   */
  jahr(): number {
    return this.#parameter.Jahr;
  }

  /**
   * Liste Eckwerte des zvE
   *
   * - Merke: Eckwerte sind "bis", nicht "ab"
   * @returns Liste der Eckwerte des zvE
   */
  eckwerte(): number[] {
    const { E0, E1, E2, E3 } = this.#parameter;
    return [E0, E1, E2, E3];
  }

  /**
   * Liste anfängliche Grenzsteuersätze
   *
   * @returns Liste der anfänglichen Grenzsteuersätze
   */
  grenzsteuersätze(): number[] {
    const { sg1, sg2, sg3, sg4 } = this.#parameter;
    return [sg1, sg2, sg3, sg4];
  }

  /**
   * Berechne Steuerbetrag
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Steuerbetrag
   */
  // Quelle: https://de.wikipedia.org/wiki/Einkommensteuer_(Deutschland)#Mathematische_Eigenschaften_der_Steuerfunktion
  // note: nutzt "mathematisch gleichwertige Form" da Parameter dafür
  steuerbetrag(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    const { E0, E1, E2, E3, S1, S2, S3, p1, sg1, p2, sg2, sg3, sg4 } =
      this.#parameter;

    // Nullzone (Grundfreibetrag)
    if (zvE <= E0) {
      return 0;
    }

    // Progressionszone 1
    if (E0 < zvE && zvE <= E1) {
      // return (sg1 + (zvE - E0) * p1) * (zvE - E0);
      return sg1 * (zvE - E0) + Math.pow(zvE - E0, 2) * p1;
    }

    // Progressionszone 2
    if (E1 < zvE && zvE <= E2) {
      // return (sg2 + (zvE - E1) * p2) * (zvE - E1) + C1;
      return sg2 * (zvE - E1) + Math.pow(zvE - E1, 2) * p2 + S1;
    }

    // Proportionalitätszone 1
    if (E2 < zvE && zvE <= E3) {
      // return sg3 * zvE - Math.abs(C3);
      return sg3 * (zvE - E2) + S2;
    }

    // Proportionalitätszone 2
    if (zvE > E3) {
      // return sg4 * zvE - Math.abs(C4);
      return sg4 * (zvE - E3) + S3;
    }

    throw new Error("unreachable");
  }

  /**
   * Berechne Durchschnittssteuersatz
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Steuersatz
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
   * @param zvE zu versteuerndes Einkommen
   * @returns Grenzsteuersatz
   */
  // Quelle: https://de.wikipedia.org/wiki/Einkommensteuer_(Deutschland)#Mathematische_Eigenschaften_der_Steuerfunktion
  grenzsteuersatz(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    const { E0, E1, E2, E3, p1, sg1, p2, sg2, sg3, sg4 } = this.#parameter;

    // Nullzone (Grundfreibetrag)
    if (zvE <= E0) {
      return 0;
    }

    // Progressionszone 1
    if (E0 < zvE && zvE <= E1) {
      return sg1 + (zvE - E0) * p1 * 2;
    }

    // Progressionszone 2
    if (E1 < zvE && zvE <= E2) {
      return sg2 + (zvE - E1) * p2 * 2;
    }

    // Proportionalitätszone 1
    if (E2 < zvE && zvE <= E3) {
      return sg3;
    }

    // Proportionalitätszone 2
    if (zvE > E3) {
      return sg4;
    }

    throw new Error("unreachable");
  }

  /**
   * Sample nominalen Steuerbetrag
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE in Zone 1
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE in Zone 3
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Steuerbeträge
   */
  steuerbetrag_data(start = 0, end = 350_000, steps = 1000): Point[] {
    const { E0, E3, Jahr } = this.#parameter;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > E0) {
      throw new Error(
        `Start '${start}' must be less or equal to E0 '${E0}'`,
      );
    }

    if (end < E3) {
      throw new Error(
        `End '${end}' must be greater or equal to E3 '${E3}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.steuerbetrag(zvE),
        Wertart: "Nominalwert",
        Jahr,
      }));
  }

  /**
   * Sample realen Steuerbetrag
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE in Zone 1
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE in Zone 3
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Steuerbeträge
   */
  steuerbetrag_real_data(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const { Jahr } = this.#parameter;

    if (Jahr > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${Jahr}'`,
      );
    }

    const sb = this.steuerbetrag_data(start, end, steps);

    return sb.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, Jahr, baseyear),
      Wert: this.#inflation.adjust(point.Wert, Jahr, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Durchschnittssteuersatz
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE in Zone 1
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE in Zone 3
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Durchschnittssteuersätze
   */
  steuersatz_data(start = 0, end = 350_000, steps = 1000): Point[] {
    const { E0, E3, Jahr } = this.#parameter;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > E0) {
      throw new Error(
        `Start '${start}' must be less or equal to E0 '${E0}'`,
      );
    }

    if (end < E3) {
      throw new Error(
        `End '${end}' must be greater or equal to E3 '${E3}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.steuersatz(zvE),
        Wertart: "Nominalwert",
        Jahr,
      }));
  }

  /**
   * Sample realen Durchschnittssteuersatz
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE in Zone 1
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE in Zone 3
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Durchschnittssteuersätze
   */
  steuersatz_real_data(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const { Jahr } = this.#parameter;

    if (Jahr > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${Jahr}'`,
      );
    }

    const sd = this.steuersatz_data(start, end, steps);

    return sd.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, Jahr, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Grenzsteuersatz
   *
   * - nur Eckwerte des zvE und anfängliche Grenzsteuersätze
   * - genauerer und effizienterer Plot als `grenzsteuersatz` Funktion
   *
   * @returns Liste der zvE und nominalen Grenzsteuersätze
   */
  grenzsteuersatz_data(): Point[] {
    const { E0, E1, E2, E3, sg1, sg2, sg3, sg4, Jahr } = this.#parameter;
    return [
      { zvE: E0, Wert: sg1, Wertart: "Nominalwert", Jahr },
      { zvE: E1, Wert: sg2, Wertart: "Nominalwert", Jahr },
      { zvE: E2, Wert: sg3, Wertart: "Nominalwert", Jahr },
      { zvE: E3, Wert: sg4, Wertart: "Nominalwert", Jahr },
    ];
  }

  /**
   * Sample realen Grenzsteuersatz
   *
   * - nur Eckwerte des zvE und anfängliche Grenzsteuersätze
   * - genauerer und effizienterer Plot als `grenzsteuersatz` Funktion
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @returns Liste der realen zvE und realen Grenzsteuersätze
   */
  grenzsteuersatz_real_data(
    baseyear: number,
  ): Point[] {
    const { E0, E1, E2, E3, sg1, sg2, sg3, sg4, Jahr } = this.#parameter;

    if (Jahr > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${Jahr}'`,
      );
    }

    const Wertart = `Realwert (${baseyear})`;

    return [
      {
        zvE: this.#inflation.adjust(E0, Jahr, baseyear),
        Wert: sg1,
        Wertart,
        Jahr,
      },
      {
        zvE: this.#inflation.adjust(E1, Jahr, baseyear),
        Wert: sg2,
        Wertart,
        Jahr,
      },
      {
        zvE: this.#inflation.adjust(E2, Jahr, baseyear),
        Wert: sg3,
        Wertart,
        Jahr,
      },
      {
        zvE: this.#inflation.adjust(E3, Jahr, baseyear),
        Wert: sg4,
        Wertart,
        Jahr,
      },
    ];
  }

  /**
   * Sample mehr nominalen Grenzsteuersatz
   *
   * - zusätzliche Punkte für horizontale und vertikale Linien im Plot
   *
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE in Zone 3
   * @returns Liste der zvE und nominalen Grenzsteuersätze
   */
  grenzsteuersatz_data_extended(end = 350_000): Point[] {
    const { E0, E3, sg3, sg4, Jahr } = this.#parameter;

    if (end < E3) {
      throw new Error(
        `End '${end}' must be greater or equal to E3 '${E3}'`,
      );
    }

    const points = this.grenzsteuersatz_data();

    const additional_points: Point[] = [
      { zvE: 0, Wert: 0, Wertart: "Nominalwert", Jahr },
      { zvE: E0, Wert: 0, Wertart: "Nominalwert", Jahr },
      { zvE: E3, Wert: sg3, Wertart: "Nominalwert", Jahr },
      { zvE: end, Wert: sg4, Wertart: "Nominalwert", Jahr },
    ];

    // beware: first `additional_points` then concatenate `points` to keep same `zvE`s in correct order
    return additional_points
      .concat(points)
      .sort((a, b) => a.zvE - b.zvE);
  }

  /**
   * Sample mehr realen Grenzsteuersatz
   *
   * - zusätzliche Punkte für horizontale und vertikale Linien im Plot
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE in Zone 3
   * @returns Liste der realen zvE und realen Grenzsteuersätze
   */
  grenzsteuersatz_real_data_extended(
    baseyear: number,
    end = 350_000,
  ): Point[] {
    const { E0, E3, sg3, sg4, Jahr } = this.#parameter;

    if (Jahr > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${Jahr}'`,
      );
    }

    if (end < E3) {
      throw new Error(
        `End '${end}' must be greater or equal to E3 '${E3}'`,
      );
    }

    const points = this.grenzsteuersatz_real_data(baseyear);

    const Wertart = `Realwert (${baseyear})`;

    const additional_points: Point[] = [
      {
        zvE: this.#inflation.adjust(0, Jahr, baseyear),
        Wert: 0,
        Wertart,
        Jahr,
      },
      {
        zvE: this.#inflation.adjust(E0, Jahr, baseyear),
        Wert: 0,
        Wertart,
        Jahr,
      },
      {
        zvE: this.#inflation.adjust(E3, Jahr, baseyear),
        Wert: sg3,
        Wertart,
        Jahr,
      },
      // note: use nominal since larger real zvEs would extend plot to the right, doesn't affect plot since just endpoint
      // todo: what if real E3 is larger than end?
      { zvE: end, Wert: sg4, Wertart, Jahr },
    ];

    // beware: first `additional_points` then concatenate `points` to keep same `zvE`s in correct order
    return additional_points
      .concat(points)
      .sort((a, b) => a.zvE - b.zvE);
  }
}
