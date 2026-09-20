import { toNumber } from "@/lib/numbers.js";

export const gramsForIngredient = (ingredient, products) => {
  const product = products.find((p) => p.id === ingredient.productId);
  if (!product) return null;

  const quantity = toNumber(ingredient.quantity)
  const avgWeightGrams = toNumber(product.avgWeightGrams)
  if(quantity===null) return null
  if (product.unit === "g") return quantity;
  if (product.unit === "kg") return quantity * 1000;

  const needsAvgWeight = product.unit === "ml" || product.unit === "l" || product.unit === "pcs";
  if (needsAvgWeight && avgWeightGrams) {
    return quantity * avgWeightGrams;
  }

  return null;
};

export const computeFoodCost = (ingredients, products ) => {
  return ingredients.reduce((sum, acc) => {
    const product = products.find((p) => p.id === acc.productId);
    
      if (!product) {
        return sum;
      }
      const price = toNumber(product.price)
      const quantity = toNumber(acc.quantity)
      if (!price || !quantity) return sum
      return sum + price * quantity;
  }, 0);
}

export const computeTotalWeight = (ingredients, products) => {
  const gramsArr = ingredients.map((g) => {
    return  gramsForIngredient(g, products)
  }) 
    if(gramsArr.includes(null)) return null
   return gramsArr.reduce((sum, acc) => 
    sum + acc, 0);
}

export const computeFoodCostPercentage = (foodCost, totalWeight, portionWeight, salePrice) => {
  const costPerGram = totalWeight ? foodCost / totalWeight : null;
  const portionCost = costPerGram && portionWeight ? costPerGram * portionWeight : null;
  if(!salePrice || portionCost === null) return null
  return (portionCost / salePrice)*100
  
}