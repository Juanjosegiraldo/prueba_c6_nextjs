# Recipe templates for the demo

Ready-to-use recipes to create quickly during the presentation. Create them
**one at a time** (do not repeat the same call): recipes have **no** uniqueness
constraint on the name, so sending the same one twice creates two documents.

## Images

The `image` field uses a `placehold.co` URL (a gray box) that **always works**.
For a real photo, replace it with a Pexels URL:

1. Go to [pexels.com](https://pexels.com) and search for the dish.
2. Right-click the photo → **"Copy image address"**.
3. Make sure it starts with **`images.pexels.com`** (the only real host allowed
   in `next.config.ts`; any other host would fail with `next/image`).
4. Paste that URL into the `image` field.

> Note: the `difficulty` field must keep the values `easy`, `medium` or `hard`
> (the app renders them as "Fácil", "Media" and "Difícil"). Do not translate them.

---

## Option 1 — Browser console (fastest)

Open the deployed site, press **F12** → **Console** tab, and paste each block
(one at a time):

```js
// 1. Arepa de Huevo
await fetch("/api/recipes", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Arepa de Huevo",
    prepTime: 25, difficulty: "medium", servings: 2,
    ingredients: ["Masa de maíz", "2 huevos", "Sal", "Aceite"],
    steps: ["Forma la arepa", "Fríe ligeramente", "Abre y rellena con el huevo", "Sella y fríe"],
    image: "https://images.pexels.com/photos/10896056/pexels-photo-10896056.jpeg"
  })
}).then(r => r.json()).then(console.log);
```

```js
// 2. Sancocho de Gallina
await fetch("/api/recipes", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Sancocho de Gallina",
    prepTime: 90, difficulty: "hard", servings: 6,
    ingredients: ["1 gallina", "Yuca", "Plátano", "Papa", "Mazorca", "Cilantro"],
    steps: ["Cocina la gallina", "Agrega yuca, plátano y papa", "Sazona", "Sirve con arroz"],
    image: "https://images.pexels.com/photos/34822475/pexels-photo-34822475.jpeg"
  })
}).then(r => r.json()).then(console.log);
```

```js
// 3. Patacón con Hogao
await fetch("/api/recipes", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Patacón con Hogao",
    prepTime: 30, difficulty: "easy", servings: 4,
    ingredients: ["2 plátanos verdes", "Tomate", "Cebolla", "Sal", "Aceite"],
    steps: ["Fríe el plátano", "Aplástalo y fríe de nuevo", "Prepara el hogao", "Sirve encima"],
    image: "https://images.pexels.com/photos/37093509/pexels-photo-37093509.jpeg"
  })
}).then(r => r.json()).then(console.log);
```

```js
// 4. Bandeja Paisa
await fetch("/api/recipes", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Bandeja Paisa",
    prepTime: 60, difficulty: "hard", servings: 1,
    ingredients: ["Frijoles", "Arroz", "Carne molida", "Chicharrón", "Huevo", "Plátano maduro", "Aguacate"],
    steps: ["Cocina los frijoles", "Prepara el arroz", "Fríe la carne y el chicharrón", "Emplata todo"],
    image: "https://images.pexels.com/photos/4552978/pexels-photo-4552978.jpeg"
  })
}).then(r => r.json()).then(console.log);
```

Expected response for each: `{ data: {...}, code: 201, message: "Recipe created" }`.

---

## Option 2 — Postman

1. Create a **POST** request to `https://prueba-c6-nextjs.vercel.app/api/recipes`.
2. In **Headers**: `Content-Type` = `application/json`.
3. In **Body** → **raw** → **JSON**, paste only the object (without the `fetch`):

```json
{
  "name": "Arepa de Huevo",
  "prepTime": 25,
  "difficulty": "medium",
  "servings": 2,
  "ingredients": ["Masa de maíz", "2 huevos", "Sal", "Aceite"],
  "steps": ["Forma la arepa", "Fríe ligeramente", "Rellena con el huevo", "Sella y fríe"],
  "image": "https://images.pexels.com/photos/10896056/pexels-photo-10896056.jpeg"
}
```

```json
{
  "name": "Sancocho de Gallina",
  "prepTime": 90,
  "difficulty": "hard",
  "servings": 6,
  "ingredients": ["1 gallina", "Yuca", "Plátano", "Papa", "Mazorca", "Cilantro"],
  "steps": ["Cocina la gallina", "Agrega yuca, plátano y papa", "Sazona", "Sirve con arroz"],
  "image": "https://images.pexels.com/photos/34822475/pexels-photo-34822475.jpeg"
}
```

```json
{
  "name": "Patacón con Hogao",
  "prepTime": 30,
  "difficulty": "easy",
  "servings": 4,
  "ingredients": ["2 plátanos verdes", "Tomate", "Cebolla", "Sal", "Aceite"],
  "steps": ["Fríe el plátano", "Aplástalo y fríe de nuevo", "Prepara el hogao", "Sirve encima"],
  "image": "https://images.pexels.com/photos/37093509/pexels-photo-37093509.jpeg"
}
```

```json
{
  "name": "Bandeja Paisa",
  "prepTime": 60,
  "difficulty": "hard",
  "servings": 1,
  "ingredients": ["Frijoles", "Arroz", "Carne molida", "Chicharrón", "Huevo", "Plátano maduro", "Aguacate"],
  "steps": ["Cocina los frijoles", "Prepara el arroz", "Fríe la carne y el chicharrón", "Emplata todo"],
  "image": "https://images.pexels.com/photos/4552978/pexels-photo-4552978.jpeg"
}
```

4. **Send**. Repeat, swapping the body for each recipe.

---

## Recommendation

For the demo, **Option 1 (browser console)** is the simplest: nothing to install
and it uses relative paths, so it works the same locally and in production.
