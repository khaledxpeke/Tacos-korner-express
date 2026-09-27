/**
 * Photos for customisation options, keyed by option name.
 * Files come from TheMealDB's free ingredient set; sizes, crusts and styles have no photo on purpose.
 */
const mealDb: Record<string, string> = {
  Anchovies: "Anchovies",
  Avocado: "Avocado",
  BBQ: "Barbeque Sauce",
  Bacon: "Bacon",
  "Caramelised Onion": "Onion",
  "Carne Asada": "Beef",
  Cheddar: "Cheddar Cheese",
  "Chicken Tikka": "Chicken Thighs",
  "Chipotle Crema": "Sour Cream",
  Chipotle: "Hot Sauce",
  "Cotija Cheese": "Feta",
  "Extra Cheese": "Cheese",
  "Extra Hot 🔥🔥": "Scotch Bonnet",
  "Extra Jalapeños": "Jalapeno",
  "Fried Egg": "Egg",
  "Grilled Chicken": "Chicken Breast",
  "Ground Beef": "Minced Beef",
  Guacamole: "Avocado",
  "Habanero 🔥": "Scotch Bonnet",
  "Hot 🔥": "Red Chilli",
  Jalapeños: "Jalapeno",
  "Mango Salsa": "Mango",
  Medium: "Chilli",
  Mild: "Green Chilli",
  Mushroom: "Mushrooms",
  Mushrooms: "Mushrooms",
  Mustard: "Mustard",
  "Pepper Jack": "Monterey Jack Cheese",
  Pepperoni: "Chorizo",
  Pesto: "Basil",
  "Pico de Gallo": "Tomatoes",
  Pineapple: "Pineapple",
  "Queso Fresco": "Feta",
  "Red Onions": "Red Onions",
  "Salsa Roja": "Salsa",
  "Salsa Verde": "Green Salsa",
  "Secret Sauce": "Mayonnaise",
  Shrimp: "Prawns",
  "Sour Cream": "Sour Cream",
  "Sweet Corn": "Sweetcorn",
  "Tartar Sauce": "Mayonnaise",
  Tomato: "Tomatoes",
  Tuna: "Tuna",
  "White Cream": "Double Cream",
};

export function ingredientImage(name: string): string | undefined {
  const file = mealDb[name];
  return file ? `https://www.themealdb.com/images/ingredients/${encodeURIComponent(file)}-Small.png` : undefined;
}
