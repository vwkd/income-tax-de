/**
 * Funktion die Steuerbetrag berechnet
 * @param {number} zvE zu versteuerndes Einkommen
 * @returns {number} Steuerbetrag
 */
export declare function steuerbetrag(zvE: number): number;

/**
 * Parameter um Steuerbetrag-Funktion zu bauen
 */
export interface Parameters {
  /**
   * Eckwert des zvE in Zone 0 (Grundfreibetrag)
   */
  E0: number;
  /**
   * Eckwert des zvE in Zone 1
   */
  E1: number;
  /**
   * Eckwert des zvE in Zone 2
   */
  E2: number;
  /**
   * Eckwert des zvE in Zone 3
   */
  E3: number;
  /**
   * Steuerbetrag an Eckwert in Zone 1
   */
  S1: number;
  /**
   * Steuerbetrag an Eckwert in Zone 2
   */
  S2: number;
  /**
   * Steuerbetrag an Eckwert in Zone 3
   */
  S3: number;
  /**
   * Linearer Progressionsfaktor in Zone 1
   */
  p1: number;
  /**
   * Anfänglicher Grenzsteuersatz in Zone 1
   */
  sg1: number;
  /**
   * Linearer Progressionsfaktor in Zone 2
   */
  p2: number;
  /**
   * Anfänglicher Grenzsteuersatz in Zone 2
   */
  sg2: number;
  /**
   * Anfänglicher Grenzsteuersatz in Zone 3
   */
  sg3: number;
  /**
   * Anfänglicher Grenzsteuersatz in Zone 4
   */
  sg4: number;
}

/**
 * Baue Funktion die Steuerbetrag berechnet
 * @returns Funktion die Steuerbetrag berechnet
 */
// Quelle: https://de.wikipedia.org/wiki/Einkommensteuer_(Deutschland)#Mathematische_Eigenschaften_der_Steuerfunktion
export function get_steuerbetrag(
  { E0, E1, E2, E3, S1, S2, S3, p1, sg1, p2, sg2, sg3, sg4 }: Parameters,
): typeof steuerbetrag {
  return (zvE: number) => {
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
  };
}
