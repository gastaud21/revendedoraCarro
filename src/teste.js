var items = [
  { name: "Edward", value: 21 },
  { name: "Sharpe", value: 37 },
  { name: "And", value: 45 },
  { name: "The", value: -12 },
  { name: "Magnetic", value: 50 },
  { name: "Zeros", value: 37 },
];

let items2 = items.sort(function (a, b) {
  return b.value - a.value;
});

const num1 = 40000;
const num2 = 5000;

console.log(num1.toLocaleString("pt-br", { minimumFractionDigits: 2 }));
console.log(num2.toLocaleString("pt-br", { minimumFractionDigits: 2 }));
