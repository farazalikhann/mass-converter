/* ============ THEME TOGGLE ============ */
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  applyTheme(isLight ? "dark" : "light");
  themeToggle.classList.remove("spin");
  void themeToggle.offsetWidth;
  themeToggle.classList.add("spin");
});

/* ============ TABS ============ */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

/* ============ UNIT CONVERTER ============ */
const categories = {
  Length: {
    units: {
      Kilometer: 1000, Meter: 1, Centimeter: 0.01, Millimeter: 0.001,
      Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254,
    },
  },
  Mass: {
    units: {
      Tonne: 1000, Kilogram: 1, Gram: 0.001, Milligram: 0.000001,
      Pound: 0.45359237, Ounce: 0.028349523125,
    },
  },
  Time: {
    units: {
      Year: 31536000, Month: 2592000, Week: 604800, Day: 86400,
      Hour: 3600, Minute: 60, Second: 1, Millisecond: 0.001,
    },
  },
  Temperature: {
    units: { Celsius: "celsius", Fahrenheit: "fahrenheit", Kelvin: "kelvin" },
  },
  Area: {
    units: {
      "Square Kilometer": 1000000, "Square Meter": 1, "Square Centimeter": 0.0001,
      Hectare: 10000, Acre: 4046.8564224, "Square Mile": 2589988.110336, "Square Foot": 0.09290304,
    },
  },
  Volume: {
    units: {
      "Cubic Meter": 1000, Liter: 1, Milliliter: 0.001,
      Gallon: 3.785411784, Quart: 0.946352946, Pint: 0.473176473, Cup: 0.2365882365,
    },
  },
  Speed: {
    units: {
      "Meter/second": 1, "Kilometer/hour": 0.277778, "Mile/hour": 0.44704,
      Knot: 0.514444, "Foot/second": 0.3048,
    },
  },
  "Data Size": {
    units: {
      Byte: 1, Kilobyte: 1024, Megabyte: 1024 ** 2, Gigabyte: 1024 ** 3, Terabyte: 1024 ** 4,
    },
  },
};

const categorySelect = document.getElementById("category");
const fromUnitSelect = document.getElementById("fromUnit");
const toUnitSelect = document.getElementById("toUnit");
const fromValueInput = document.getElementById("fromValue");
const toValueInput = document.getElementById("toValue");
const resultText = document.getElementById("resultText");
const swapBtn = document.getElementById("swapBtn");

function populateSelect(select, names) {
  select.innerHTML = "";
  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function toCelsius(value, unit) {
  if (unit === "Celsius") return value;
  if (unit === "Fahrenheit") return (value - 32) * (5 / 9);
  if (unit === "Kelvin") return value - 273.15;
}

function fromCelsius(value, unit) {
  if (unit === "Celsius") return value;
  if (unit === "Fahrenheit") return value * (9 / 5) + 32;
  if (unit === "Kelvin") return value + 273.15;
}

function convert() {
  const categoryName = categorySelect.value;
  const category = categories[categoryName];
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;
  const value = parseFloat(fromValueInput.value);

  if (isNaN(value)) {
    toValueInput.value = "";
    resultText.textContent = "";
    return;
  }

  let result;
  if (categoryName === "Temperature") {
    result = fromCelsius(toCelsius(value, fromUnit), toUnit);
  } else {
    const baseValue = value * category.units[fromUnit];
    result = baseValue / category.units[toUnit];
  }

  const rounded = Math.round(result * 1e6) / 1e6;
  toValueInput.value = rounded;
  resultText.textContent = `${value} ${fromUnit} = ${rounded} ${toUnit}`;
}

function loadCategory() {
  const unitNames = Object.keys(categories[categorySelect.value].units);
  populateSelect(fromUnitSelect, unitNames);
  populateSelect(toUnitSelect, unitNames);
  toUnitSelect.selectedIndex = unitNames.length > 1 ? 1 : 0;
  convert();
}

categorySelect.addEventListener("change", loadCategory);
fromUnitSelect.addEventListener("change", convert);
toUnitSelect.addEventListener("change", convert);
fromValueInput.addEventListener("input", convert);
swapBtn.addEventListener("click", () => {
  const tempIndex = fromUnitSelect.selectedIndex;
  fromUnitSelect.selectedIndex = toUnitSelect.selectedIndex;
  toUnitSelect.selectedIndex = tempIndex;
  convert();
});

populateSelect(categorySelect, Object.keys(categories));
loadCategory();

/* ============ PHYSICS FORMULAS (Class 11-12 level) ============ */
const G = 6.674e-11;
const C_LIGHT = 3e8;

const physicsFormulas = {
  "Newton's Second Law": {
    expr: "F = m × a",
    vars: {
      F: { label: "Force", unit: "N" },
      m: { label: "Mass", unit: "kg" },
      a: { label: "Acceleration", unit: "m/s²" },
    },
    solve: {
      F: (v) => v.m * v.a,
      m: (v) => v.F / v.a,
      a: (v) => v.F / v.m,
    },
  },
  "First Equation of Motion": {
    expr: "v = u + a t",
    vars: {
      v: { label: "Final Velocity", unit: "m/s" },
      u: { label: "Initial Velocity", unit: "m/s" },
      a: { label: "Acceleration", unit: "m/s²" },
      t: { label: "Time", unit: "s" },
    },
    solve: {
      v: (x) => x.u + x.a * x.t,
      u: (x) => x.v - x.a * x.t,
      a: (x) => (x.v - x.u) / x.t,
      t: (x) => (x.v - x.u) / x.a,
    },
  },
  "Second Equation of Motion": {
    expr: "s = u t + ½ a t²",
    vars: {
      s: { label: "Displacement", unit: "m" },
      u: { label: "Initial Velocity", unit: "m/s" },
      a: { label: "Acceleration", unit: "m/s²" },
      t: { label: "Time", unit: "s" },
    },
    solve: {
      s: (x) => x.u * x.t + 0.5 * x.a * x.t * x.t,
      u: (x) => (x.s - 0.5 * x.a * x.t * x.t) / x.t,
      a: (x) => (2 * (x.s - x.u * x.t)) / (x.t * x.t),
      t: (x) => {
        if (x.a === 0) return x.s / x.u;
        const disc = x.u * x.u + 2 * x.a * x.s;
        if (disc < 0) return NaN;
        return (-x.u + Math.sqrt(disc)) / x.a;
      },
    },
  },
  "Third Equation of Motion": {
    expr: "v² = u² + 2 a s",
    vars: {
      v: { label: "Final Velocity", unit: "m/s" },
      u: { label: "Initial Velocity", unit: "m/s" },
      a: { label: "Acceleration", unit: "m/s²" },
      s: { label: "Displacement", unit: "m" },
    },
    solve: {
      v: (x) => Math.sqrt(x.u * x.u + 2 * x.a * x.s),
      u: (x) => Math.sqrt(x.v * x.v - 2 * x.a * x.s),
      a: (x) => (x.v * x.v - x.u * x.u) / (2 * x.s),
      s: (x) => (x.v * x.v - x.u * x.u) / (2 * x.a),
    },
  },
  "Momentum": {
    expr: "p = m v",
    vars: {
      p: { label: "Momentum", unit: "kg·m/s" },
      m: { label: "Mass", unit: "kg" },
      v: { label: "Velocity", unit: "m/s" },
    },
    solve: {
      p: (x) => x.m * x.v,
      m: (x) => x.p / x.v,
      v: (x) => x.p / x.m,
    },
  },
  "Work Done": {
    expr: "W = F d",
    vars: {
      W: { label: "Work", unit: "J" },
      F: { label: "Force", unit: "N" },
      d: { label: "Displacement", unit: "m" },
    },
    solve: {
      W: (x) => x.F * x.d,
      F: (x) => x.W / x.d,
      d: (x) => x.W / x.F,
    },
  },
  "Kinetic Energy": {
    expr: "KE = ½ m v²",
    vars: {
      KE: { label: "Kinetic Energy", unit: "J" },
      m: { label: "Mass", unit: "kg" },
      v: { label: "Velocity", unit: "m/s" },
    },
    solve: {
      KE: (x) => 0.5 * x.m * x.v * x.v,
      m: (x) => (2 * x.KE) / (x.v * x.v),
      v: (x) => Math.sqrt((2 * x.KE) / x.m),
    },
  },
  "Potential Energy": {
    expr: "PE = m g h",
    vars: {
      PE: { label: "Potential Energy", unit: "J" },
      m: { label: "Mass", unit: "kg" },
      g: { label: "Gravity", unit: "m/s²", default: 9.8 },
      h: { label: "Height", unit: "m" },
    },
    solve: {
      PE: (x) => x.m * x.g * x.h,
      m: (x) => x.PE / (x.g * x.h),
      g: (x) => x.PE / (x.m * x.h),
      h: (x) => x.PE / (x.m * x.g),
    },
  },
  "Power": {
    expr: "P = W / t",
    vars: {
      P: { label: "Power", unit: "W" },
      W: { label: "Work", unit: "J" },
      t: { label: "Time", unit: "s" },
    },
    solve: {
      P: (x) => x.W / x.t,
      W: (x) => x.P * x.t,
      t: (x) => x.W / x.P,
    },
  },
  "Ohm's Law": {
    expr: "V = I R",
    vars: {
      V: { label: "Voltage", unit: "V" },
      I: { label: "Current", unit: "A" },
      R: { label: "Resistance", unit: "Ω" },
    },
    solve: {
      V: (x) => x.I * x.R,
      I: (x) => x.V / x.R,
      R: (x) => x.V / x.I,
    },
  },
  "Electric Power": {
    expr: "P = V I",
    vars: {
      P: { label: "Power", unit: "W" },
      V: { label: "Voltage", unit: "V" },
      I: { label: "Current", unit: "A" },
    },
    solve: {
      P: (x) => x.V * x.I,
      V: (x) => x.P / x.I,
      I: (x) => x.P / x.V,
    },
  },
  "Universal Gravitation": {
    expr: "F = G m₁ m₂ / r²",
    vars: {
      F: { label: "Force", unit: "N" },
      m1: { label: "Mass 1", unit: "kg" },
      m2: { label: "Mass 2", unit: "kg" },
      r: { label: "Distance", unit: "m" },
    },
    solve: {
      F: (x) => (G * x.m1 * x.m2) / (x.r * x.r),
      m1: (x) => (x.F * x.r * x.r) / (G * x.m2),
      m2: (x) => (x.F * x.r * x.r) / (G * x.m1),
      r: (x) => Math.sqrt((G * x.m1 * x.m2) / x.F),
    },
  },
  "Density": {
    expr: "ρ = m / V",
    vars: {
      rho: { label: "Density", unit: "kg/m³" },
      m: { label: "Mass", unit: "kg" },
      V: { label: "Volume", unit: "m³" },
    },
    solve: {
      rho: (x) => x.m / x.V,
      m: (x) => x.rho * x.V,
      V: (x) => x.m / x.rho,
    },
  },
  "Pressure": {
    expr: "P = F / A",
    vars: {
      P: { label: "Pressure", unit: "Pa" },
      F: { label: "Force", unit: "N" },
      A: { label: "Area", unit: "m²" },
    },
    solve: {
      P: (x) => x.F / x.A,
      F: (x) => x.P * x.A,
      A: (x) => x.F / x.P,
    },
  },
  "Wave Speed": {
    expr: "v = f λ",
    vars: {
      v: { label: "Wave Speed", unit: "m/s" },
      f: { label: "Frequency", unit: "Hz" },
      lambda: { label: "Wavelength", unit: "m" },
    },
    solve: {
      v: (x) => x.f * x.lambda,
      f: (x) => x.v / x.lambda,
      lambda: (x) => x.v / x.f,
    },
  },
  "Electric Charge": {
    expr: "Q = I t",
    vars: {
      Q: { label: "Charge", unit: "C" },
      I: { label: "Current", unit: "A" },
      t: { label: "Time", unit: "s" },
    },
    solve: {
      Q: (x) => x.I * x.t,
      I: (x) => x.Q / x.t,
      t: (x) => x.Q / x.I,
    },
  },
  "Mass-Energy Equivalence": {
    expr: "E = m c²",
    vars: {
      E: { label: "Energy", unit: "J" },
      m: { label: "Mass", unit: "kg" },
    },
    solve: {
      E: (x) => x.m * C_LIGHT * C_LIGHT,
      m: (x) => x.E / (C_LIGHT * C_LIGHT),
    },
  },
};

const formulaSelect = document.getElementById("formulaSelect");
const formulaExpr = document.getElementById("formulaExpr");
const solveForSelect = document.getElementById("solveForSelect");
const variableInputs = document.getElementById("variableInputs");
const calcBtn = document.getElementById("calcBtn");
const physicsResult = document.getElementById("physicsResult");

function loadFormula() {
  const formula = physicsFormulas[formulaSelect.value];
  formulaExpr.textContent = formula.expr;

  solveForSelect.innerHTML = "";
  Object.keys(formula.solve).forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = formula.vars[key].label;
    solveForSelect.appendChild(opt);
  });

  renderVariableInputs();
  physicsResult.textContent = "";
  physicsResult.className = "physics-result";
}

function renderVariableInputs() {
  const formula = physicsFormulas[formulaSelect.value];
  const target = solveForSelect.value;

  variableInputs.innerHTML = "";
  Object.keys(formula.vars).forEach((key) => {
    if (key === target) return;
    const info = formula.vars[key];

    const field = document.createElement("div");
    field.className = "field";

    const label = document.createElement("label");
    label.textContent = `${info.label} (${info.unit})`;
    label.setAttribute("for", `var-${key}`);

    const input = document.createElement("input");
    input.type = "number";
    input.id = `var-${key}`;
    input.dataset.key = key;
    if (info.default !== undefined) input.value = info.default;

    field.appendChild(label);
    field.appendChild(input);
    variableInputs.appendChild(field);
  });

  physicsResult.textContent = "";
  physicsResult.className = "physics-result";
}

function calculatePhysics() {
  const formula = physicsFormulas[formulaSelect.value];
  const target = solveForSelect.value;
  const inputs = variableInputs.querySelectorAll("input");

  const values = {};
  let hasEmpty = false;
  inputs.forEach((input) => {
    const val = parseFloat(input.value);
    if (input.value.trim() === "" || isNaN(val)) hasEmpty = true;
    values[input.dataset.key] = val;
  });

  physicsResult.classList.remove("show");
  void physicsResult.offsetWidth;

  if (hasEmpty) {
    physicsResult.textContent = "Please fill in all fields with valid numbers.";
    physicsResult.className = "physics-result error show";
    return;
  }

  const result = formula.solve[target](values);

  if (isNaN(result) || !isFinite(result)) {
    physicsResult.textContent = "Invalid input for this formula (check for divide-by-zero or negative square root).";
    physicsResult.className = "physics-result error show";
    return;
  }

  const rounded = Math.round(result * 1e6) / 1e6;
  const targetInfo = formula.vars[target];
  physicsResult.textContent = `${targetInfo.label} = ${rounded} ${targetInfo.unit}`;
  physicsResult.className = "physics-result show";
}

populateSelect(formulaSelect, Object.keys(physicsFormulas));
formulaSelect.addEventListener("change", loadFormula);
solveForSelect.addEventListener("change", renderVariableInputs);
calcBtn.addEventListener("click", calculatePhysics);

loadFormula();