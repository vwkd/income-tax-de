# README

Einkommensteuerrechner für Deutschland



## Funktionen

- Berechne Steuerbetrag, Durchschnittssteuersatz, Grenzsteuersatz, und Rabatt durch Absetzung
- Liste Eckwerte des zu versteuernden Einkommens
- Vollständige Tarifhistorie seit 1958



## Benutzung

- Liste unterstützte Jahre und verwendete Währungen

```ts
import { IncomeTax } from "@vwkd/income-tax-de";

console.log(IncomeTax.years); // [ 1958, 1959, 1960, ... ]
console.log(IncomeTax.currencies); // [ "DEM", "EUR" ]
```

- Liste Jahr, Währung und Grundfreibetrag für Jahr

```ts
import { IncomeTax } from "@vwkd/income-tax-de";

const year = 2020;

const incomeTax = new IncomeTax(year);

console.log(incomeTax.year); // 2020
console.log(incomeTax.currency); // EUR
console.log(incomeTax.breakpoints[0]); // 9408
```

- Berechne Steuerbetrag, Durchschnittssteuersatz und Grenzsteuersatz für Jahr und zu versteuerndes Einkommen

```ts
import { IncomeTax } from "@vwkd/income-tax-de";

const year = 2020;
const zvE = 14_533;

const incomeTax = new IncomeTax(year);

console.log(incomeTax.amount(zvE)); // 973.03
console.log(incomeTax.rateAverage(zvE)); // 0.0669
console.log(incomeTax.rateMargin(zvE)); // 0.2397
```

- Berechne Rabatt auf Kosten durch Absetzung für Jahr und zu versteuerndes Einkommen

```ts
import { IncomeTax } from "@vwkd/income-tax-de";

const year = 2020;
const zvE = 12_345;
const cost = 100;

const incomeTax = new IncomeTax(year);

console.log(incomeTax.rateMargin(zvE - cost)); // 0.1952
console.log(incomeTax.discount(cost, zvE) / cost); // 0.1962
console.log(incomeTax.rateMargin(zvE)); // 0.1971
```
