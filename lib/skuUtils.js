export function computeManufacturingSku(item) {
  if (!item) return '';

  const segments = [];

  // 1. Style Number
  if (item.style_number) {
    segments.push(item.style_number);
  }

  // 2. Karat
  if (item.karat) {
    segments.push(item.karat);
  }

  // 3. Colour Code
  if (item.selectedColour) {
    const colourCode = item.selectedColour
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    if (colourCode) segments.push(colourCode);
  }

  // 4. Category Code + Size
  if (item.selectedSize) {
    const categoryMap = {
      'rings': 'RG', 'necklaces': 'NK', 'bangles': 'BN', 'earrings': 'ER',
      'bracelets': 'BR', 'pendants': 'PD', 'chains': 'CH', 'mangalsutra': 'MS',
      'sets': 'ST', 'anklets': 'AK', 'nose pins': 'NP'
    };
    
    let catCode = '';
    if (item.category) {
      catCode = categoryMap[item.category.toLowerCase()] || '';
    }
    
    segments.push(`${catCode}${item.selectedSize}`);
  }

  // 5. Shape Code
  if (item.selectedShape) {
    const shapeMap = {
      'round': 'RD', 'princess': 'PR', 'oval': 'OV', 'cushion': 'CU',
      'emerald': 'EM', 'pear': 'PE', 'marquise': 'MQ', 'radiant': 'RA',
      'asscher': 'AS', 'heart': 'HE', 'trillion': 'TR', 'baguette': 'BG',
      'triangle': 'TG'
    };
    const shapeCode = shapeMap[item.selectedShape.toLowerCase()] || '';
    if (shapeCode) {
      segments.push(shapeCode);
    }
  }

  // 6. Diamond Weight Code
  if (item.selectedDiamondWeight) {
    // Parse numeric carat value
    const match = item.selectedDiamondWeight.toString().match(/[\d.]+/);
    if (match) {
      const carat = parseFloat(match[0]);
      if (!isNaN(carat)) {
        const weightCode = Math.round(carat * 100).toString();
        segments.push(weightCode);
      }
    }
  }

  return segments.join('-');
}
