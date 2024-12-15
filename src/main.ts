import type { Parameter } from "./types.ts";

export class Steuer {
  #parameter: Parameter;

  /**
   * Berechne Steuer für Jahr
   *
   * @param parameter Parameter für Jahr
   */
  constructor(parameter: Parameter) {
    this.#parameter = parameter;
  }

  /**
   * Berechne Steuerbetrag
   *
   * @param {number} zvE zu versteuerndes Einkommen
   * @returns {number} Steuerbetrag
   */
  // Quelle: https://de.wikipedia.org/wiki/Einkommensteuer_(Deutschland)#Mathematische_Eigenschaften_der_Steuerfunktion
  // note: nutzt "mathematisch gleichwertige Form" da Parameter dafür
  steuerbetrag(zvE: number): number {
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
   * @param {number} zvE zu versteuerndes Einkommen
   * @returns {number} Steuersatz
   */
  steuersatz(zvE: number): number {
    return this.steuerbetrag(zvE) / zvE;
  }

  /**
   * Berechne Grenzsteuersatz
   *
   * @param {number} zvE zu versteuerndes Einkommen
   * @returns {number} Grenzsteuersatz
   */
  // Quelle: https://de.wikipedia.org/wiki/Einkommensteuer_(Deutschland)#Mathematische_Eigenschaften_der_Steuerfunktion
  grenzsteuersatz(zvE: number): number {
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
   * Liste Eckwerte des zvE
   * @returns Array der Eckwerte des zvE
   */
  eckwerte(): number[] {
    const { E0, E1, E2, E3 } = this.#parameter;
    return [E0, E1, E2, E3];
  }

  /**
   * Liste anfängliche Grenzsteuersätze
   * @returns Array der anfänglichen Grenzsteuersätze
   */
  grenzsteuersätze(): number[] {
    const { sg1, sg2, sg3, sg4 } = this.#parameter;
    return [sg1, sg2, sg3, sg4];
  }

  /**
   * Liste Eckwerte des zvE und anfängliche Grenzsteuersätze
   *
   * Achtung: Eckwärte des zvE um 1 erhöht, damit "ab" statt "bis"
   * @returns Array der Eckwerte des zvE und anfänglichen Grenzsteuersätze
   */
  eckwerte_grenzsteuersätze(): { x: number; y: number }[] {
    const { E0, E1, E2, E3, sg1, sg2, sg3, sg4 } = this.#parameter;
    return [
      { x: E0 + 1, y: sg1 },
      { x: E1 + 1, y: sg2 },
      { x: E2 + 1, y: sg3 },
      { x: E3 + 1, y: sg4 },
    ];
  }
}
