import type { parameters } from "./data.ts";
import type { IntRange, Last } from "./types/utils.ts";

/**
 * Parameter um Steuerbetrag zu berechnen
 */
export interface Parameter {
  /**
   * Jahr ab dem Parameter gelten
   */
  fromYear: number;
  /**
   * Jahr bis dem die Parameter gelten
   */
  toYear: number;
  /**
   * Währung
   */
  currency: "DEM" | "EUR";
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

type Parameters = typeof parameters;

export type FirstYear = Parameters[0]["fromYear"];
export type LastYear = Last<Parameters>["toYear"];
export type Years = IntRange<FirstYear, LastYear>;
export type Year = Years[number];

export type Currency = Parameters[number]["currency"];
