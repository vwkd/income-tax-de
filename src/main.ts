import { range } from "d3";
import { Inflation } from "@vwkd/inflation";
import type { Parameter } from "./types.ts";

export class Steuer {
  #parameter: Parameter;
  #inflation: Inflation;

  /**
   * Berechne Steuer für Jahr
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
   * @param buffer Extra zvE-Distanz nach letztem zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Steuerbeträge
   */
  steuerbetrag_data(buffer = 100_000, steps = 1000): {
    zvE: number;
    Wert: number;
    Wertart: "Nominalwert";
  }[] {
    const { E3 } = this.#parameter;

    const start = 0;
    const end = E3 + buffer;
    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.steuerbetrag(zvE),
        Wertart: "Nominalwert",
      }));
  }

  /**
   * Sample realen Steuerbetrag
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param buffer Extra zvE-Distanz nach letztem zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und realen Steuerbeträge
   */
  steuerbetrag_real_data<Y extends number>(
    baseyear: Y,
    buffer = 100_000,
    steps = 1000,
  ): {
    zvE: number;
    Wert: number;
    Wertart: `Realwert ${Y}`;
  }[] {
    const { E3 } = this.#parameter;
    const year = this.#parameter.Jahr;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const start = 0;
    const end = E3 + buffer;
    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: this.#inflation.adjust(zvE, year, baseyear),
        Wert: this.#inflation.adjust(this.steuerbetrag(zvE), year, baseyear),
        Wertart: `Realwert (${baseyear})`,
      }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Durchschnittssteuersatz
   *
   * @param buffer Extra zvE-Distanz nach letztem zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Durchschnittssteuersätze
   */
  steuersatz_data(buffer = 100_000, steps = 1000): {
    zvE: number;
    Wert: number;
    Wertart: "Nominalwert";
  }[] {
    const { E3 } = this.#parameter;

    const start = 0;
    const end = E3 + buffer;
    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.steuersatz(zvE),
        Wertart: "Nominalwert",
      }));
  }

  /**
   * Sample realen Durchschnittssteuersatz
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param buffer Extra zvE-Distanz nach letztem zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und realen Durchschnittssteuersätze
   */
  steuersatz_real_data<Y extends number>(
    baseyear: Y,
    buffer = 100_000,
    steps = 1000,
  ): {
    zvE: number;
    Wert: number;
    Wertart: `Realwert ${Y}`;
  }[] {
    const { E3 } = this.#parameter;
    const year = this.#parameter.Jahr;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const start = 0;
    const end = E3 + buffer;
    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: this.#inflation.adjust(zvE, year, baseyear),
        Wert: this.steuersatz(zvE),
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
  grenzsteuersatz_data(): {
    zvE: number;
    Wert: number;
    Wertart: "Nominalwert";
  }[] {
    const { E0, E1, E2, E3, sg1, sg2, sg3, sg4 } = this.#parameter;
    return [
      { zvE: E0, Wert: sg1, Wertart: "Nominalwert" },
      { zvE: E1, Wert: sg2, Wertart: "Nominalwert" },
      { zvE: E2, Wert: sg3, Wertart: "Nominalwert" },
      { zvE: E3, Wert: sg4, Wertart: "Nominalwert" },
    ];
  }

  /**
   * Sample realen Grenzsteuersatz
   *
   * - nur Eckwerte des zvE und anfängliche Grenzsteuersätze
   * - genauerer und effizienterer Plot als `grenzsteuersatz` Funktion
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @returns Liste der zvE und realen Grenzsteuersätze
   */
  grenzsteuersatz_real_data<Y extends number>(
    baseyear: Y,
  ): {
    zvE: number;
    Wert: number;
    Wertart: `Realwert ${Y}`;
  }[] {
    const { E0, E1, E2, E3, sg1, sg2, sg3, sg4 } = this.#parameter;
    const year = this.#parameter.Jahr;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const Wertart = `Realwert (${baseyear})`;

    return [
      { zvE: this.#inflation.adjust(E0, year, baseyear), Wert: sg1, Wertart },
      { zvE: this.#inflation.adjust(E1, year, baseyear), Wert: sg2, Wertart },
      { zvE: this.#inflation.adjust(E2, year, baseyear), Wert: sg3, Wertart },
      { zvE: this.#inflation.adjust(E3, year, baseyear), Wert: sg4, Wertart },
    ];
  }

  /**
   * Sample mehr nominalen Grenzsteuersatz
   *
   * - zusätzliche Punkte für horizontale und vertikale Linien im Plot
   *
   * @param buffer Extra zvE-Distanz nach letztem zvE
   * @returns Liste der zvE und nominalen Grenzsteuersätze
   */
  grenzsteuersatz_data_extended(buffer = 100_000): {
    zvE: number;
    Wert: number;
    Wertart: "Nominalwert";
  }[] {
    const { E0, E3, sg3, sg4 } = this.#parameter;

    const points = this.grenzsteuersatz_data();

    const additional_points: {
      zvE: number;
      Wert: number;
      Wertart: "Nominalwert";
    }[] = [
      { zvE: 0, Wert: 0, Wertart: "Nominalwert" },
      { zvE: E0, Wert: 0, Wertart: "Nominalwert" },
      { zvE: E3, Wert: sg3, Wertart: "Nominalwert" },
      { zvE: E3 + buffer, Wert: sg4, Wertart: "Nominalwert" },
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
   * @param buffer Extra zvE-Distanz nach letztem zvE
   * @returns Liste der zvE und realen Grenzsteuersätze
   */
  grenzsteuersatz_real_data_extended<Y extends number>(
    baseyear: Y,
    buffer = 100_000,
  ): {
    zvE: number;
    Wert: number;
    Wertart: `Realwert ${Y}`;
  }[] {
    const { E0, E3, sg3, sg4 } = this.#parameter;
    const year = this.#parameter.Jahr;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const points = this.grenzsteuersatz_real_data(baseyear);

    const Wertart = `Realwert (${baseyear})`;

    const additional_points: {
      zvE: number;
      Wert: number;
      Wertart: `Realwert ${Y}`;
    }[] = [
      { zvE: this.#inflation.adjust(0, year, baseyear), Wert: 0, Wertart },
      { zvE: this.#inflation.adjust(E0, year, baseyear), Wert: 0, Wertart },
      { zvE: this.#inflation.adjust(E3, year, baseyear), Wert: sg3, Wertart },
      // note: use nominal since larger real zvEs would extend plot to the right, doesn't affect plot since just endpoint
      { zvE: E3 + buffer, Wert: sg4, Wertart },
    ];

    // beware: first `additional_points` then concatenate `points` to keep same `zvE`s in correct order
    return additional_points
      .concat(points)
      .sort((a, b) => a.zvE - b.zvE);
  }
}
