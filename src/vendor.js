
function createH (size) {
  return document.createElement(`h${size}`);
}

function fillText (el, text) {
  el.textContent = text;
  return el;
}

export { createH, fillText };
