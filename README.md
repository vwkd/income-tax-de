# README

Einkommensteuerrechner für Deutschland



## Funktionen

- berechne Steuerbetrag, Durchschnittssteuersatz und Grenzsteuersatz für zu versteuerndes Einkommen
- sample Punkte für Plot
- nominale und reale Werte



## Benutzung

```ts
import { Steuer, steuerbetrag } from "@vwkd/income_tax_de";
import { Inflation } from "@vwkd/inflation";
import { currencyReplacements, inflationRates } from "@vwkd/inflation/de";

const jahr = 2020;
const zvE = 14_533;

const inflation = new Inflation(inflationRates, currencyReplacements);
const params = steuerbetrag.find((s) => s.Jahr == jahr);
const steuer = new Steuer(params, inflation);

console.log(steuer.steuerbetrag(zvE)); // 973.03
console.log(steuer.steuersatz(zvE)); // 0.0669
console.log(steuer.grenzsteuersatz(zvE)); // 0.2397
```
