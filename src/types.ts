/**
 * Parameter um Steuerbetrag-Funktion zu bauen
 */
export interface Parameter {
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
