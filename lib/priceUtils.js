/**
 * Calculates the live gold rate-based pricing for a product.
 * Returns the calculated price and a flag indicating if live pricing was applied.
 */
export function calculateProductPrice(product, rate_999) {
  if (!product) return { hasLivePrice: false, priceVal: 0, price: "" };

  const netGoldWeight = parseFloat(product.net_gold_weight);
  
  // If net_gold_weight is present and greater than 0, and we have a valid gold rate
  if (rate_999 && !isNaN(netGoldWeight) && netGoldWeight > 0) {
    // 1. Calculate Karat Rate
    const karat = product.karat || "14K";
    let karatMultiplier = 14; // Default if not matched
    
    // Extract digit from karat string robustly, e.g., "22K", "18K", "14K"
    const karatLower = String(karat).toLowerCase();
    if (karatLower.includes("22")) {
      karatMultiplier = 22;
    } else if (karatLower.includes("18")) {
      karatMultiplier = 18;
    } else if (karatLower.includes("14")) {
      karatMultiplier = 14;
    } else {
      const match = karat.match(/(\d+)/);
      if (match) {
        karatMultiplier = parseInt(match[1], 10);
      }
    }

    const karatRate = (rate_999 / 24) * karatMultiplier;

    // 2. Gold Amount
    const goldAmount = netGoldWeight * karatRate;

    // 3. Subtotal
    const diamondVal = parseFloat(product.diamond_net_amount) || 0;
    const makingVal = parseFloat(product.making_net_amount) || 0;
    const otherVal = parseFloat(product.other_net_amount) || 0;
    const subtotal = goldAmount + diamondVal + makingVal + otherVal;

    // 4. GST Amount
    const gstPctVal = parseFloat(product.gst_percentage) || 0;
    const gstAmount = subtotal * (gstPctVal / 100);

    // 5. Final Price
    const finalPrice = subtotal + gstAmount;
    const roundedPrice = Math.round(finalPrice);

    return {
      hasLivePrice: true,
      priceVal: roundedPrice,
      price: `₹${roundedPrice.toLocaleString("en-IN")}`,
      karatRate,
      goldAmount,
      subtotal,
      gstAmount,
      diamondAmount: diamondVal,
      makingAmount: makingVal,
      otherAmount: otherVal,
    };
  }

  // Fallback to manual price
  return {
    hasLivePrice: false,
    priceVal: product.priceVal,
    price: product.price,
    karatRate: 0,
    goldAmount: 0,
    subtotal: 0,
    gstAmount: 0,
    diamondAmount: 0,
    makingAmount: 0,
    otherAmount: 0,
  };
}
