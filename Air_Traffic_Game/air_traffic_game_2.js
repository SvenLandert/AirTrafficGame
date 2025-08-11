const gridEl = document.querySelector(".Grid");
const countPerRow = 10;

console.log(countPerRow);

const possibleFields = new Array(countPerRow * countPerRow).fill();

console.log(possibleFields.length);

possibleFields.forEach((field, index) => {
  let div = document.createElement("div");
  div.className = "Field";
  gridEl.append(div);
});
