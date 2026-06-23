# Plantillas de recetas para la demo

Recetas listas para crear rápido durante la presentación. Créalas **una a una**
(no repitas la misma llamada): las recetas **no** tienen restricción de unicidad
en el nombre, así que enviar la misma dos veces crea dos documentos.

## Imágenes

El campo `image` usa una URL de `placehold.co` (un recuadro gris) que **siempre
funciona**. Para una foto real, reemplázala por una URL de Pexels:

1. Entra a [pexels.com](https://pexels.com) y busca el plato.
2. Clic derecho en la foto → **"Copiar dirección de la imagen"**.
3. Asegúrate de que empiece con **`images.pexels.com`** (el único host real
   permitido en `next.config.ts`; cualquier otro host fallaría con `next/image`).
4. Pega esa URL en el campo `image`.

> Nota: el campo `difficulty` debe mantener los valores `easy`, `medium` o `hard`
> (la app los muestra como "Fácil", "Media" y "Difícil"). No los traduzcas.

---

## Opción 1 — Consola del navegador (lo más rápido)

Abre el sitio desplegado, presiona **F12** → pestaña **Console**, y pega cada
bloque (uno a la vez):

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

Respuesta esperada para cada una: `{ data: {...}, code: 201, message: "Recipe created" }`.

---

## Opción 2 — Postman

1. Crea una petición **POST** a `https://prueba-c6-nextjs.vercel.app/api/recipes`.
2. En **Headers**: `Content-Type` = `application/json`.
3. En **Body** → **raw** → **JSON**, pega solo el objeto (sin el `fetch`):

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

4. **Send**. Repite, cambiando el body por cada receta.

---

## Recomendación

Para la demo, la **Opción 1 (consola del navegador)** es la más simple: no hay
nada que instalar y usa rutas relativas, así que funciona igual en local y en
producción.
