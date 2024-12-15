# README

Einkommensteuerrechner für Deutschland



## Funktionen

- berechne Steuerbetrag, Durchschnittssteuersatz und Grenzsteuersatz für zu versteuerndes Einkommen
- sample Punkte für Plot
- nominale und reale Werte



## Benutzung

```ts
import { IncomeTax } from "@vwkd/income-tax-de";
import { Inflation } from "@vwkd/inflation";

const year = 2020;
const zvE = 14_533;

const inflation = new Inflation("DE");
const incomeTax = new IncomeTax(year, inflation);

console.log(incomeTax.amount(zvE)); // 973.03
console.log(incomeTax.rateAverage(zvE)); // 0.0669
console.log(incomeTax.rateMargin(zvE)); // 0.2397
```
