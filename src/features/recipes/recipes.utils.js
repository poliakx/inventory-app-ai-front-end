export const gramsForIngredient = (ingredient, products) => {
  const product = products.find((p) => p.id === ingredient.productId);
  if (!product) return undefined;

  if (product.unit === "g") return ingredient.quantity;
  if (product.unit === "kg") return ingredient.quantity * 1000;

  const needsAvgWeight = product.unit === "ml" || product.unit === "l" || product.unit === "pcs";
  if (needsAvgWeight && product.avgWeightGrams) {
    return ingredient.quantity * product.avgWeightGrams;
  }

  return undefined;
};

export const computeFoodCost = (ingredients, products ) => {
  return ingredients.reduce((sum, acc) => {
    const product = products.find((p) => p.id === acc.productId);
      if (!product) {
        return sum;
      }
      return sum + product.price * acc.quantity;
  }, 0);
}

export const computeTotalWeight = (ingredients, products) => {
   return ingredients.reduce((sum, acc) => 
    sum + gramsForIngredient(acc, products), 0);
}

export const computeFoodCostPercentage = (foodCost, totalWeight, portionWeight, salePrice) => {
  const costPerGram = totalWeight ? foodCost / totalWeight : null;
  const portionCost = costPerGram && portionWeight ? costPerGram * portionWeight : null;
  if(!salePrice || portionCost === null) return null
  return (portionCost / salePrice)*100
  
}