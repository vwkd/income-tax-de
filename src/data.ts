import type { Parameter } from "./types.ts";

/**
 * Parameter für Einkommensteuerrechner
 *
 * - bis 2001 in Deutsche Mark (DM)
 * - ab 2002 in Euro (€)
 * - Quelle: [BMF - Lohn- und Einkommensteuerrechner - Tarifhistorie](https://www.bmf-steuerrechner.de/javax.faces.resource/2024_07_geä._Tarifhistorie_Steuerrechner.pdf.xhtml)
 * - Ableitungsformeln für Grenzsteuersatzfunktion `rateMargin: (zvE: number) => number`
 *   - für `amount = (a * X + b) * X` und `X = (zvE - c) / d` ist `rateMargin = (2 * a * X + b) / d`
 *   - für `amount = ((a * X + b) * X + c) * X + d` und `X = (zvE - e) / f` ist `rateMargin = ((3 * a * X + 2 * b) * X + c) / f`
 *   - für `amount = (((a * X + b) * X + c) * X + d) * X + e` und `X = (zvE - f) / g` ist `rateMargin = (((4 * a * X + 3 * b) * X + 2 * c) * X + d) / g`
 */
export const parameters: Parameter[] = [{
  year: [1958, 1964],
  pieces: [
    {
      start: 0,
      end: 1_680,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 1_681,
      end: 8_009,
      amount: (zvE) => 0.2 * (zvE - 1_680),
      rateMargin: (_zvE) => 0.2,
    },
    {
      start: 8_010,
      end: 23_999,
      amount: (zvE) => {
        const Y = (zvE - 8_000) / 1_000;
        return (2.9 * Y + 272) * Y + 1_264;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_000) / 1_000;
        return (2 * 2.9 * Y + 272) / 1_000;
      },
    },
    {
      start: 24_000,
      end: 110_039,
      amount: (zvE) => {
        const Y = (zvE - 24_000) / 1_000;
        return ((-0.006 * Y + 1.572) * Y + 382) * Y + 6_358;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 24_000) / 1_000;
        return ((3 * -0.006 * Y + 2 * 1.572) * Y + 382) / 1_000;
      },
    },
    {
      start: 110_040,
      end: Infinity,
      amount: (zvE) => 0.53 * zvE - 11_281,
      rateMargin: (_zvE) => 0.53,
    },
  ],
}, {
  year: [1965, 1974],
  pieces: [
    {
      start: 0,
      end: 1_680,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 1_681,
      end: 8_009,
      amount: (zvE) => 0.19 * (zvE - 1_680),
      rateMargin: (_zvE) => 0.19,
    },
    {
      start: 8_010,
      end: 29_999,
      amount: (zvE) => {
        const Y = (zvE - 8_000) / 1_000;
        return ((-0.086 * Y + 7.764) * Y + 190) * Y + 1_201;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_000) / 1_000;
        return ((3 * -0.086 * Y + 2 * 7.764) * Y + 190) / 1_000;
      },
    },
    {
      start: 30_000,
      end: 77_999,
      amount: (zvE) => {
        const Y = (zvE - 30_000) / 1_000;
        return ((-0.012 * Y + 1.82) * Y + 407) * Y + 8_223;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 30_000) / 1_000;
        return ((3 * -0.012 * Y + 2 * 1.82) * Y + 407) / 1_000;
      },
    },
    {
      start: 78_000,
      end: 110_039,
      amount: (zvE) => {
        const Y = (zvE - 24_000) / 1_000;
        return ((-0.006 * Y + 1.572) * Y + 382) * Y + 6_358;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 24_000) / 1_000;
        return ((3 * -0.006 * Y + 2 * 1.572) * Y + 382) / 1_000;
      },
    },
    {
      start: 110_040,
      end: Infinity,
      amount: (zvE) => 0.53 * zvE - 11_281,
      rateMargin: (_zvE) => 0.53,
    },
  ],
}, {
  year: [1975, 1977],
  pieces: [
    {
      start: 0,
      end: 3_029,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 3_030,
      end: 16_019,
      amount: (zvE) => 0.22 * zvE - 660,
      rateMargin: (_zvE) => 0.22,
    },
    {
      start: 16_020,
      end: 47_999,
      amount: (zvE) => {
        const Y = (zvE - 16_000) / 10_000;
        return ((-49.2 * Y + 505.3) * Y + 3_077) * Y + 2_858;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 16_000) / 10_000;
        return ((3 * -49.2 * Y + 2 * 505.3) * Y + 3_077) / 10_000;
      },
    },
    {
      start: 48_000,
      end: 130_019,
      amount: (zvE) => {
        const Z = (zvE - 48_000) / 10_000;
        return (((0.1 * Z - 6.07) * Z + 109.95) * Z + 4_800) * Z + 16_266;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 48_000) / 10_000;
        return (((4 * 0.1 * Z + 3 * -6.07) * Z + 2 * 109.95) * Z + 4_800) /
          10_000;
      },
    },
    {
      start: 130_020,
      end: Infinity,
      amount: (zvE) => 0.56 * zvE - 12_676,
      rateMargin: (_zvE) => 0.56,
    },
  ],
}, {
  year: 1978,
  pieces: [
    {
      start: 0,
      end: 3_329,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 3_330,
      end: 16_019,
      amount: (zvE) => 0.22 * zvE - 726,
      rateMargin: (_zvE) => 0.22,
    },
    {
      start: 16_020,
      end: 47_999,
      amount: (zvE) => {
        const Y = (zvE - 16_000) / 10_000;
        return ((-49.2 * Y + 505.3) * Y + 3_077) * Y + 2_792;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 16_000) / 10_000;
        return ((3 * -49.2 * Y + 2 * 505.3) * Y + 3_077) / 10_000;
      },
    },
    {
      start: 48_000,
      end: 130_019,
      amount: (zvE) => {
        const Z = (zvE - 48_000) / 10_000;
        return (((0.1 * Z - 6.07) * Z + 109.95) * Z + 4_800) * Z + 16_200;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 48_000) / 10_000;
        return (((4 * 0.1 * Z + 3 * -6.07) * Z + 2 * 109.95) * Z + 4_800) /
          10_000;
      },
    },
    {
      start: 130_020,
      end: Infinity,
      amount: (zvE) => 0.56 * zvE - 12_742,
      rateMargin: (_zvE) => 0.56,
    },
  ],
}, {
  year: [1979, 1980],
  pieces: [
    {
      start: 0,
      end: 3_690,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 3_691,
      end: 16_000,
      amount: (zvE) => 0.22 * zvE - 812,
      rateMargin: (_zvE) => 0.22,
    },
    {
      start: 16_001,
      end: 47_999,
      amount: (zvE) => {
        const Y = (zvE - 16_000) / 10_000;
        return (((10.86 * Y - 154.42) * Y + 925) * Y + 2_200) * Y + 2_708;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 16_000) / 10_000;
        return (((4 * 10.86 * Y + 3 * -154.42) * Y + 2 * 925) * Y + 2_200) /
          10_000;
      },
    },
    {
      start: 48_000,
      end: 129_999,
      amount: (zvE) => {
        const Z = (zvE - 48_000) / 10_000;
        return (((0.1 * Z - 6.07) * Z + 109.95) * Z + 4_800) * Z + 15_298;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 48_000) / 10_000;
        return (((4 * 0.1 * Z + 3 * -6.07) * Z + 2 * 109.95) * Z + 4_800) /
          10_000;
      },
    },
    {
      start: 130_000,
      end: Infinity,
      amount: (zvE) => 0.56 * zvE - 13_644,
      rateMargin: (_zvE) => 0.56,
    },
  ],
}, {
  year: [1981, 1985],
  pieces: [
    {
      start: 0,
      end: 4_212,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 4_213,
      end: 18_000,
      amount: (zvE) => 0.22 * zvE - 926,
      rateMargin: (_zvE) => 0.22,
    },
    {
      start: 18_001,
      end: 59_999,
      amount: (zvE) => {
        const Y = (zvE - 18_000) / 10_000;
        return (((3.05 * Y - 73.76) * Y + 695) * Y + 2_200) * Y + 3_034;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 18_000) / 10_000;
        return (((4 * 3.05 * Y + 3 * -73.76) * Y + 2 * 695) * Y + 2_200) /
          10_000;
      },
    },
    {
      start: 60_000,
      end: 129_999,
      amount: (zvE) => {
        const Z = (zvE - 60_000) / 10_000;
        return (((0.09 * Z - 5.45) * Z + 88.13) * Z + 5_040) * Z + 20_018;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 60_000) / 10_000;
        return (((4 * 0.09 * Z + 3 * -5.45) * Z + 2 * 88.13) * Z + 5_040) /
          10_000;
      },
    },
    {
      start: 130_000,
      end: Infinity,
      amount: (zvE) => 0.56 * zvE - 14_837,
      rateMargin: (_zvE) => 0.56,
    },
  ],
}, {
  year: [1986, 1987],
  pieces: [
    {
      start: 0,
      end: 4_536,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 4_537,
      end: 18_035,
      amount: (zvE) => 0.22 * zvE - 998,
      rateMargin: (_zvE) => 0.22,
    },
    {
      start: 18_036,
      end: 80_027,
      amount: (zvE) => {
        const Y = (zvE - 18_000) / 10_000;
        return (((2.10 * Y - 56.02) * Y + 600) * Y + 2_200) * Y + 2_962;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 18_000) / 10_000;
        return (((4 * 2.10 * Y + 3 * -56.02) * Y + 2 * 600) * Y + 2_200) /
          10_000;
      },
    },
    {
      start: 80_028,
      end: 130_031,
      amount: (zvE) => {
        const Z = (zvE - 80_000) / 10_000;
        return (42 * Z + 5_180) * Z + 29_417;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 80_000) / 10_000;
        return (2 * 42 * Z + 5_180) / 10_000;
      },
    },
    {
      start: 130_032,
      end: Infinity,
      amount: (zvE) => 0.56 * zvE - 16_433,
      rateMargin: (_zvE) => 0.56,
    },
  ],
}, {
  year: [1988, 1989],
  pieces: [
    {
      start: 0,
      end: 4_752,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 4_753,
      end: 18_035,
      amount: (zvE) => 0.22 * zvE - 1_045,
      rateMargin: (_zvE) => 0.22,
    },
    {
      start: 18_036,
      end: 80_027,
      amount: (zvE) => {
        const Y = (zvE - 17_982) / 10_000;
        return (((0.34 * Y - 21.58) * Y + 392) * Y + 2_200) * Y + 2_911;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 17_982) / 10_000;
        return (((4 * 0.34 * Y + 3 * -21.58) * Y + 2 * 392) * Y + 2_200) /
          10_000;
      },
    },
    {
      start: 80_028,
      end: 130_031,
      amount: (zvE) => {
        const Z = (zvE - 79_974) / 10_000;
        return (70 * Z + 4_900) * Z + 26_974;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 79_974) / 10_000;
        return (2 * 70 * Z + 4_900) / 10_000;
      },
    },
    {
      start: 130_032,
      end: Infinity,
      amount: (zvE) => 0.56 * zvE - 19_561,
      rateMargin: (_zvE) => 0.56,
    },
  ],
}, {
  year: [1990, 1995],
  pieces: [
    {
      start: 0,
      end: 5_616,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 5_617,
      end: 8_153,
      amount: (zvE) => 0.19 * zvE - 1_067,
      rateMargin: (_zvE) => 0.19,
    },
    {
      start: 8_154,
      end: 120_041,
      amount: (zvE) => {
        const Y = (zvE - 8_100) / 10_000;
        return (151.94 * Y + 1_900) * Y + 472;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_100) / 10_000;
        return (2 * 151.94 * Y + 1_900) / 10_000;
      },
    },
    {
      start: 120_042,
      end: Infinity,
      amount: (zvE) => 0.53 * zvE - 22_842,
      rateMargin: (_zvE) => 0.53,
    },
  ],
}, {
  year: [1996, 1997],
  pieces: [
    {
      start: 0,
      end: 12_095,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 12_096,
      end: 55_727,
      amount: (zvE) => {
        const Y = (zvE - 12_042) / 10_000;
        return (86.63 * Y + 2_590) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 12_042) / 10_000;
        return (2 * 86.63 * Y + 2_590) / 10_000;
      },
    },
    {
      start: 55_728,
      end: 120_041,
      amount: (zvE) => {
        const Z = (zvE - 55_674) / 10_000;
        return (151.91 * Z + 3_346) * Z + 12_949;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 55_674) / 10_000;
        return (2 * 151.91 * Z + 3_346) / 10_000;
      },
    },
    {
      start: 120_042,
      end: Infinity,
      amount: (zvE) => 0.53 * zvE - 22_842,
      rateMargin: (_zvE) => 0.53,
    },
  ],
}, {
  year: 1998,
  pieces: [
    {
      start: 0,
      end: 12_365,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 12_366,
      end: 58_643,
      amount: (zvE) => {
        const Y = (zvE - 12_312) / 10_000;
        return (91.19 * Y + 2_590) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 12_312) / 10_000;
        return (2 * 91.19 * Y + 2_590) / 10_000;
      },
    },
    {
      start: 58_644,
      end: 120_041,
      amount: (zvE) => {
        const Z = (zvE - 58_590) / 10_000;
        return (151.96 * Z + 3_434) * Z + 13_938;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 58_590) / 10_000;
        return (2 * 151.96 * Z + 3_434) / 10_000;
      },
    },
    {
      start: 120_042,
      end: Infinity,
      amount: (zvE) => 0.53 * zvE - 22_843,
      rateMargin: (_zvE) => 0.53,
    },
  ],
}, {
  year: 1999,
  pieces: [
    {
      start: 0,
      end: 13_067,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 13_068,
      end: 17_063,
      amount: (zvE) => {
        const Y1 = (zvE - 13_014) / 10_000;
        return (350.35 * Y1 + 2_390) * Y1;
      },
      rateMargin: (zvE) => {
        const Y1 = (zvE - 13_014) / 10_000;
        return (2 * 350.35 * Y1 + 2_390) / 10_000;
      },
    },
    {
      start: 17_064,
      end: 66_365,
      amount: (zvE) => {
        const Y2 = (zvE - 17_010) / 10_000;
        return (101.31 * Y2 + 2_670) * Y2 + 1_011;
      },
      rateMargin: (zvE) => {
        const Y2 = (zvE - 17_010) / 10_000;
        return (2 * 101.31 * Y2 + 2_670) / 10_000;
      },
    },
    {
      start: 66_366,
      end: 120_041,
      amount: (zvE) => {
        const Z = (zvE - 66_312) / 10_000;
        return (151.93 * Z + 3_669) * Z + 16_637;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 66_312) / 10_000;
        return (2 * 151.93 * Z + 3_669) / 10_000;
      },
    },
    {
      start: 120_042,
      end: Infinity,
      amount: (zvE) => 0.53 * zvE - 22_886,
      rateMargin: (_zvE) => 0.53,
    },
  ],
}, {
  year: 2000,
  pieces: [
    {
      start: 0,
      end: 13_499,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 13_500,
      end: 17_495,
      amount: (zvE) => {
        const Y = (zvE - 13_446) / 10_000;
        return (262.76 * Y + 2_290) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 13_446) / 10_000;
        return (2 * 262.76 * Y + 2_290) / 10_000;
      },
    },
    {
      start: 17_496,
      end: 114_695,
      amount: (zvE) => {
        const Z = (zvE - 17_442) / 10_000;
        return (133.74 * Z + 2_500) * Z + 957;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 17_442) / 10_000;
        return (2 * 133.74 * Z + 2_500) / 10_000;
      },
    },
    {
      start: 114_696,
      end: Infinity,
      amount: (zvE) => 0.51 * zvE - 20_575,
      rateMargin: (_zvE) => 0.51,
    },
  ],
}, {
  year: 2001,
  pieces: [
    {
      start: 0,
      end: 14_093,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 14_094,
      end: 18_089,
      amount: (zvE) => {
        const Y = (zvE - 14_040) / 10_000;
        return (387.89 * Y + 1_990) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 14_040) / 10_000;
        return (2 * 387.89 * Y + 1_990) / 10_000;
      },
    },
    {
      start: 18_090,
      end: 107_567,
      amount: (zvE) => {
        const Z = (zvE - 18_036) / 10_000;
        return (142.49 * Z + 2_300) * Z + 857;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 18_036) / 10_000;
        return (2 * 142.49 * Z + 2_300) / 10_000;
      },
    },
    {
      start: 107_568,
      end: Infinity,
      amount: (zvE) => 0.485 * zvE - 19_299,
      rateMargin: (_zvE) => 0.485,
    },
  ],
}, {
  year: [2002, 2003],
  pieces: [
    {
      start: 0,
      end: 7_235,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 7_236,
      end: 9_251,
      amount: (zvE) => {
        const Y = (zvE - 7_200) / 10_000;
        return (768.85 * Y + 1_990) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 7_200) / 10_000;
        return (2 * 768.85 * Y + 1_990) / 10_000;
      },
    },
    {
      start: 9_252,
      end: 55_007,
      amount: (zvE) => {
        const Z = (zvE - 9_216) / 10_000;
        return (278.65 * Z + 2_300) * Z + 432;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 9_216) / 10_000;
        return (2 * 278.65 * Z + 2_300) / 10_000;
      },
    },
    {
      start: 55_008,
      end: Infinity,
      amount: (zvE) => 0.485 * zvE - 9_872,
      rateMargin: (_zvE) => 0.485,
    },
  ],
}, {
  year: 2004,
  pieces: [
    {
      start: 0,
      end: 7_664,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 7_665,
      end: 12_739,
      amount: (zvE) => {
        const Y = (zvE - 7_664) / 10_000;
        return (793.1 * Y + 1_600) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 7_664) / 10_000;
        return (2 * 793.1 * Y + 1_600) / 10_000;
      },
    },
    {
      start: 12_740,
      end: 52_151,
      amount: (zvE) => {
        const Z = (zvE - 12_739) / 10_000;
        return (265.78 * Z + 2_405) * Z + 1_016;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 12_739) / 10_000;
        return (2 * 265.78 * Z + 2_405) / 10_000;
      },
    },
    {
      start: 52_152,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 8_845,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: [2005, 2006],
  pieces: [
    {
      start: 0,
      end: 7_664,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 7_665,
      end: 12_739,
      amount: (zvE) => {
        const Y = (zvE - 7_664) / 10_000;
        return (883.74 * Y + 1_500) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 7_664) / 10_000;
        return (2 * 883.74 * Y + 1_500) / 10_000;
      },
    },
    {
      start: 12_740,
      end: 52_151,
      amount: (zvE) => {
        const Z = (zvE - 12_739) / 10_000;
        return (228.74 * Z + 2_397) * Z + 989;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 12_739) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_152,
      end: Infinity,
      amount: (zvE) => 0.42 * zvE - 7_914,
      rateMargin: (_zvE) => 0.42,
    },
  ],
}, {
  year: [2007, 2008],
  pieces: [
    {
      start: 0,
      end: 7_664,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 7_665,
      end: 12_739,
      amount: (zvE) => {
        const Y = (zvE - 7_664) / 10_000;
        return (883.74 * Y + 1_500) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 7_664) / 10_000;
        return (2 * 883.74 * Y + 1_500) / 10_000;
      },
    },
    {
      start: 12_740,
      end: 52_151,
      amount: (zvE) => {
        const Z = (zvE - 12_739) / 10_000;
        return (228.74 * Z + 2_397) * Z + 989;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 12_739) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_152,
      end: 250_000,
      amount: (zvE) => 0.42 * zvE - 7_914,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 250_001,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 15_414,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2009,
  pieces: [
    {
      start: 0,
      end: 7_834,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 7_835,
      end: 13_139,
      amount: (zvE) => {
        const Y = (zvE - 7_834) / 10_000;
        return (936.68 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 7_834) / 10_000;
        return (2 * 936.68 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_140,
      end: 52_551,
      amount: (zvE) => {
        const Z = (zvE - 13_139) / 10_000;
        return (228.74 * Z + 2_397) * Z + 1_007;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_139) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_552,
      end: 250_400,
      amount: (zvE) => 0.42 * zvE - 8_064,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 250_401,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 15_576,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: [2010, 2012],
  pieces: [
    {
      start: 0,
      end: 8_004,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 8_005,
      end: 13_469,
      amount: (zvE) => {
        const Y = (zvE - 8_004) / 10_000;
        return (912.17 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_004) / 10_000;
        return (2 * 912.17 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_470,
      end: 52_881,
      amount: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (228.74 * Z + 2_397) * Z + 1_038;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_882,
      end: 250_730,
      amount: (zvE) => 0.42 * zvE - 8_172,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 250_731,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 15_694,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2013,
  pieces: [
    {
      start: 0,
      end: 8_130,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 8_131,
      end: 13_469,
      amount: (zvE) => {
        const Y = (zvE - 8_130) / 10_000;
        return (933.70 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_130) / 10_000;
        return (2 * 933.70 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_470,
      end: 52_881,
      amount: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (228.74 * Z + 2_397) * Z + 1_014;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_882,
      end: 250_730,
      amount: (zvE) => 0.42 * zvE - 8_196,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 250_731,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 15_718,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2014,
  pieces: [
    {
      start: 0,
      end: 8_354,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 8_355,
      end: 13_469,
      amount: (zvE) => {
        const Y = (zvE - 8_354) / 10_000;
        return (974.58 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_354) / 10_000;
        return (2 * 974.58 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_470,
      end: 52_881,
      amount: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (228.74 * Z + 2_397) * Z + 971;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_882,
      end: 250_730,
      amount: (zvE) => 0.42 * zvE - 8_239,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 250_731,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 15_761,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2015,
  pieces: [
    {
      start: 0,
      end: 8_472,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 8_473,
      end: 13_469,
      amount: (zvE) => {
        const Y = (zvE - 8_472) / 10_000;
        return (997.6 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_472) / 10_000;
        return (2 * 997.6 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_470,
      end: 52_881,
      amount: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (228.74 * Z + 2_397) * Z + 948.68;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_469) / 10_000;
        return (2 * 228.74 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 52_882,
      end: 250_730,
      amount: (zvE) => 0.42 * zvE - 8_261.29,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 250_731,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 15_783.19,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2016,
  pieces: [
    {
      start: 0,
      end: 8_652,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 8_653,
      end: 13_669,
      amount: (zvE) => {
        const Y = (zvE - 8_652) / 10_000;
        return (993.62 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_652) / 10_000;
        return (2 * 993.62 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_670,
      end: 53_665,
      amount: (zvE) => {
        const Z = (zvE - 13_669) / 10_000;
        return (225.4 * Z + 2_397) * Z + 952.48;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_669) / 10_000;
        return (2 * 225.4 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 53_666,
      end: 254_446,
      amount: (zvE) => 0.42 * zvE - 8_394.14,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 254_447,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 16_027.52,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2017,
  pieces: [
    {
      start: 0,
      end: 8_820,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 8_821,
      end: 13_769,
      amount: (zvE) => {
        const Y = (zvE - 8_820) / 10_000;
        return (1_007.27 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 8_820) / 10_000;
        return (2 * 1_007.27 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_770,
      end: 54_057,
      amount: (zvE) => {
        const Z = (zvE - 13_769) / 10_000;
        return (223.76 * Z + 2_397) * Z + 939.57;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_769) / 10_000;
        return (2 * 223.76 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 54_058,
      end: 256_303,
      amount: (zvE) => 0.42 * zvE - 8_475.44,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 256_304,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 16_164.53,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2018,
  pieces: [
    {
      start: 0,
      end: 9_000,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 9_001,
      end: 13_996,
      amount: (zvE) => {
        const Y = (zvE - 9_000) / 10_000;
        return (997.8 * Y + 1_400) * Y;
      },
      rateMargin: (zvE) => {
        const Y = (zvE - 9_000) / 10_000;
        return (2 * 997.8 * Y + 1_400) / 10_000;
      },
    },
    {
      start: 13_997,
      end: 54_949,
      amount: (zvE) => {
        const Z = (zvE - 13_996) / 10_000;
        return (220.13 * Z + 2_397) * Z + 948.49;
      },
      rateMargin: (zvE) => {
        const Z = (zvE - 13_996) / 10_000;
        return (2 * 220.13 * Z + 2_397) / 10_000;
      },
    },
    {
      start: 54_950,
      end: 260_532,
      amount: (zvE) => 0.42 * zvE - 8_621.75,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 260_533,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 16_437.7,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2019,
  pieces: [
    {
      start: 0,
      end: 9_168,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 9_169,
      end: 14_254,
      amount: (zvE) => {
        const y = (zvE - 9_168) / 10_000;
        return (980.14 * y + 1_400) * y;
      },
      rateMargin: (zvE) => {
        const y = (zvE - 9_168) / 10_000;
        return (2 * 980.14 * y + 1_400) / 10_000;
      },
    },
    {
      start: 14_255,
      end: 55_960,
      amount: (zvE) => {
        const z = (zvE - 14_254) / 10_000;
        return (216.16 * z + 2_397) * z + 965.58;
      },
      rateMargin: (zvE) => {
        const z = (zvE - 14_254) / 10_000;
        return (2 * 216.16 * z + 2_397) / 10_000;
      },
    },
    {
      start: 55_961,
      end: 265_326,
      amount: (zvE) => 0.42 * zvE - 8_780.9,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 265_327,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 16_740.68,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2020,
  pieces: [
    {
      start: 0,
      end: 9_408,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 9_409,
      end: 14_532,
      amount: (zvE) => {
        const y = (zvE - 9_408) / 10_000;
        return (972.87 * y + 1_400) * y;
      },
      rateMargin: (zvE) => {
        const y = (zvE - 9_408) / 10_000;
        return (2 * 972.87 * y + 1_400) / 10_000;
      },
    },
    {
      start: 14_533,
      end: 57_051,
      amount: (zvE) => {
        const z = (zvE - 14_532) / 10_000;
        return (212.02 * z + 2_397) * z + 972.79;
      },
      rateMargin: (zvE) => {
        const z = (zvE - 14_532) / 10_000;
        return (2 * 212.02 * z + 2_397) / 10_000;
      },
    },
    {
      start: 57_052,
      end: 270_500,
      amount: (zvE) => 0.42 * zvE - 8_963.74,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 270_501,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 17_078.74,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2021,
  pieces: [
    {
      start: 0,
      end: 9_744,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 9_745,
      end: 14_753,
      amount: (zvE) => {
        const y = (zvE - 9_744) / 10_000;
        return (995.21 * y + 1_400) * y;
      },
      rateMargin: (zvE) => {
        const y = (zvE - 9_744) / 10_000;
        return (2 * 995.21 * y + 1_400) / 10_000;
      },
    },
    {
      start: 14_754,
      end: 57_918,
      amount: (zvE) => {
        const z = (zvE - 14_753) / 10_000;
        return (208.85 * z + 2_397) * z + 950.96;
      },
      rateMargin: (zvE) => {
        const z = (zvE - 14_753) / 10_000;
        return (2 * 208.85 * z + 2_397) / 10_000;
      },
    },
    {
      start: 57_919,
      end: 274_612,
      amount: (zvE) => 0.42 * zvE - 9_136.63,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 274_613,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 17_374.99,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2022,
  pieces: [
    {
      start: 0,
      end: 10_347,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 10_348,
      end: 14_926,
      amount: (zvE) => {
        const y = (zvE - 10_347) / 10_000;
        return (1_088.67 * y + 1_400) * y;
      },
      rateMargin: (zvE) => {
        const y = (zvE - 10_347) / 10_000;
        return (2 * 1_088.67 * y + 1_400) / 10_000;
      },
    },
    {
      start: 14_927,
      end: 58_596,
      amount: (zvE) => {
        const z = (zvE - 14_926) / 10_000;
        return (206.43 * z + 2_397) * z + 869.32;
      },
      rateMargin: (zvE) => {
        const z = (zvE - 14_926) / 10_000;
        return (2 * 206.43 * z + 2_397) / 10_000;
      },
    },
    {
      start: 58_597,
      end: 277_825,
      amount: (zvE) => 0.42 * zvE - 9_336.45,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 277_826,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 17_671.20,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2023,
  pieces: [
    {
      start: 0,
      end: 10_908,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 10_909,
      end: 15_999,
      amount: (zvE) => {
        const y = (zvE - 10_908) / 10_000;
        return (979.18 * y + 1_400) * y;
      },
      rateMargin: (zvE) => {
        const y = (zvE - 10_908) / 10_000;
        return (2 * 979.18 * y + 1_400) / 10_000;
      },
    },
    {
      start: 16_000,
      end: 62_809,
      amount: (zvE) => {
        const z = (zvE - 15_999) / 10_000;
        return (192.59 * z + 2_397) * z + 966.53;
      },
      rateMargin: (zvE) => {
        const z = (zvE - 15_999) / 10_000;
        return (2 * 192.59 * z + 2_397) / 10_000;
      },
    },
    {
      start: 62_810,
      end: 277_825,
      amount: (zvE) => 0.42 * zvE - 9_972.98,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 277_826,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 18_307.73,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}, {
  year: 2024,
  pieces: [
    {
      start: 0,
      end: 11_784,
      amount: (_zvE) => 0,
      rateMargin: (_zvE) => 0,
    },
    {
      start: 11_785,
      end: 17_005,
      amount: (zvE) => {
        const y = (zvE - 11_784) / 10_000;
        return (954.80 * y + 1_400) * y;
      },
      rateMargin: (zvE) => {
        const y = (zvE - 11_784) / 10_000;
        return (2 * 954.80 * y + 1_400) / 10_000;
      },
    },
    {
      start: 17_006,
      end: 66_760,
      amount: (zvE) => {
        const z = (zvE - 17_005) / 10_000;
        return (181.19 * z + 2_397) * z + 991.21;
      },
      rateMargin: (zvE) => {
        const z = (zvE - 17_005) / 10_000;
        return (2 * 181.19 * z + 2_397) / 10_000;
      },
    },
    {
      start: 66_761,
      end: 277_825,
      amount: (zvE) => 0.42 * zvE - 10_636.31,
      rateMargin: (_zvE) => 0.42,
    },
    {
      start: 277_826,
      end: Infinity,
      amount: (zvE) => 0.45 * zvE - 18_971.06,
      rateMargin: (_zvE) => 0.45,
    },
  ],
}];
