const fs = require('fs');
const path = 'app/shop/[slug]/page.jsx';
let content = fs.readFileSync(path, 'utf-8');

const startString = '<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-8">';
const quantityIndex = content.indexOf('{/* Quantity & Actions Stack */}');

const startIndex = content.indexOf(startString);

if (startIndex === -1 || quantityIndex === -1) {
  console.log('Not found boundaries', startIndex, quantityIndex);
  process.exit(1);
}

// Find the end of the grid wrapper which is ')}' just before the quantity stack
const beforeQuantity = content.substring(startIndex, quantityIndex);
const endIndex = startIndex + beforeQuantity.lastIndexOf(')}') + 2; 

const gridContent = content.substring(startIndex + startString.length, endIndex - 2);

const markers = [
  "{/* Size Selector Row",
  "{/* Diamond Weight Selector",
  "{/* Karat Selector",
  "{/* Colour Selector",
  "{/* Engraving Section",
  "{/* Shape Selector"
];

const indices = markers.map(m => gridContent.indexOf(m));
if (indices.includes(-1)) {
  console.log('Marker missing', indices);
  process.exit(1);
}

const sections = {};
markers.forEach((m, i) => {
  let end = gridContent.length;
  for (let j = 0; j < markers.length; j++) {
    if (i !== j && indices[j] > indices[i] && indices[j] < end) {
      end = indices[j];
    }
  }
  let s = gridContent.substring(indices[i], end);
  s = s.replace(/sm:order-\d+/g, 'sm:order-none');
  sections[m] = s;
});

const leftCol = `
                    {/* LEFT COLUMN */}
                    <div className="contents sm:flex sm:flex-col sm:gap-y-6">
                      ${sections[markers[0]]}                      ${sections[markers[2]]}                      ${sections[markers[4]]}                    </div>
`;

const rightCol = `
                    {/* RIGHT COLUMN */}
                    <div className="contents sm:flex sm:flex-col sm:gap-y-6">
                      ${sections[markers[1]]}                      ${sections[markers[3]]}                      ${sections[markers[5]]}                    </div>
`;

const newOuter = `<div className="flex flex-col gap-y-6 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0 mb-8">` + leftCol + rightCol;

const newContent = content.substring(0, startIndex) + newOuter + content.substring(endIndex - 2);

fs.writeFileSync(path, newContent, 'utf-8');
console.log('Successfully wrote', newContent.length, 'bytes');
