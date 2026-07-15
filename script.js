// Each category holds units with a factor to convert INTO the base unit.
// Temperature needs custom formulas instead of a plain factor.
const categories = {
  Length: {
    base: "meter",
    units: {
      Kilometer: 1000,
      Meter: 1,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Mile: 1609.344,
      Yard: 0.9144,
      Foot: 0.3048,
      Inch: 0.0254,
    },
  },
  Mass: {
    base: "kilogram",
    units: {
      Tonne: 1000,
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Pound: 0.45359237,
      Ounce: 0.028349523125,
    },
  },
  Time: {
    base: "second",
    units: {
      Year: 31536000,
      Month: 2592000,
      Week: 604800,
      Day: 86400,
      Hour: 3600,
      Minute: 60,
      Second: 1,
      Millisecond: 0.001,
    },
  },
  Temperature: {
    base: "celsius",
    units: {
      Celsius: "celsius",
      Fahrenheit: "fahrenheit",
      Kelvin: "kelvin",
    },
  },
  Area: {
    base: "sqmeter",
    units: {
      "Square Kilometer": 1000000,
      "Square Meter": 1,
      "Square Centimeter": 0.0001,
      Hectare: 10000,
      Acre: 4046.8564224,
      "Square Mile": 2589988.110336,
      "Square Foot": 0.09290304,
    },
  },
  Volume: {
    base: "liter",
    units: {
      "Cubic Meter": 1000,
      Liter: 1,
      Milliliter: 0.001,
      Gallon: 3.785411784,
      Quart: 0.946352946,
      Pint: 0.473176473,
      Cup: 0.2365882365,
    },
  },
  Speed: {
    base: "mps",
    units: {
      "Meter/second": 1,
      "Kilometer/hour": 0.277778,
      "Mile/hour": 0.44704,
      Knot: 0.514444,
      "Foot/second": 0.3048,
    },
  },
  "Data Size": {
    base: "byte",
    units: {
      Byte: 1,
      Kilobyte: 1024,
      Megabyte: 1024 ** 2,
      Gigabyte: 1024 ** 3,
      Terabyte: 1024 ** 4,
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

function populateSelect(select, unitNames) {
  select.innerHTML = "";
  unitNames.forEach((name) => {
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
  const categoryName = categorySelect.value;
  const unitNames = Object.keys(categories[categoryName].units);
  populateSelect(fromUnitSelect, unitNames);
  populateSelect(toUnitSelect, unitNames);
  toUnitSelect.selectedIndex = unitNames.length > 1 ? 1 : 0;
  convert();
}

function init() {
  populateSelect(categorySelect, Object.keys(categories));
  loadCategory();
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

init();