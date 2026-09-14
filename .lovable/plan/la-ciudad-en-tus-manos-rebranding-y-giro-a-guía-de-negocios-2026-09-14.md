# La Ciudad en tus Manos — rebranding y giro a guía de negocios

Pasamos de "Parcha Foods" (guía gastronómica de Cali, enfocada al Mundial) a **La Ciudad en tus Manos**: una guía de negocios por ciudad, empezando por **Barbosa (Santander)** y **Santana (Boyacá)**.

## 1. Nueva marca

- Nombre en toda la app, el título de la pestaña, el manifiesto de la app instalable, el pie de página y los textos compartibles: **La Ciudad en tus Manos**.
- Logo nuevo generado: una mano abierta sosteniendo una silueta de ciudad con un pin de ubicación. Se usa en encabezado, menú lateral, favicon e iconos de la app instalada.
- Paleta urbana en lugar de la cálida actual:
  - Azul profundo (principal) — edificios, confianza.
  - Turquesa / cian (secundario) — acentos y botones.
  - Ámbar suave (destacados) — promociones y estrellas.
  - Grises fríos para fondos y bordes.
- Todo sale de los tokens de color centrales, así que botones, sombras y degradados de toda la app cambian solos.

## 2. Selector de ciudad

- Desplegable de ciudad en el encabezado, siempre visible: **Barbosa (Santander)**, **Santana (Boyacá)**, **Cali (Valle)**.
- Botón "Usar mi ubicación": toma el GPS y selecciona automáticamente la ciudad más cercana entre las disponibles.
- La ciudad elegida se guarda en el dispositivo y filtra todo: inicio, mapa, listados, categorías, cerca de mí, favoritos y eventos.
- Al primer ingreso se muestra una pantalla corta para escoger ciudad o usar ubicación.

## 3. Categorías de negocio (no solo comida)

Se reemplaza la barra de categorías gastronómicas por categorías de tipo de negocio:

| Categoría | Ejemplos |
|---|---|
| Comida | restaurantes, cafés, comidas rápidas, panaderías |
| Salud y bienestar | droguerías, consultorios, odontología, veterinarias |
| Belleza | peluquerías, barberías, spa, uñas |
| Ropa y calzado | boutiques, almacenes, calzado |
| Entretenimiento | bares, billares, gimnasios, eventos |
| Hogar y ferretería | ferreterías, muebles, electrodomésticos |
| Servicios | talleres, lavanderías, papelerías, tecnología |
| Hospedaje | hoteles, hostales, fincas |
| Mercados | supermercados, fruterías, carnicerías |

- Los negocios de comida que ya existen quedan bajo **Comida**, y su tipo actual (parrilla, sushi, café…) se conserva como subtipo interno para búsqueda y para el ícono del mapa.
- Los filtros avanzados y el buscador se actualizan a esta taxonomía.

## 4. Negocios reales de Barbosa (Santander)

- Busco en internet negocios reales de Barbosa (nombre, dirección, teléfono, categoría, barrio, coordenadas aproximadas) cubriendo las categorías de arriba.
- Los cargo como negocios de la ciudad Barbosa, con foto genérica apropiada a su categoría cuando no haya foto real disponible.
- Los 90 negocios actuales de Cali se marcan como ciudad **Cali** y siguen visibles solo cuando se elige esa ciudad.
- Aviso claro: los datos encontrados en internet pueden estar incompletos o desactualizados; luego los puedes corregir desde el panel.

## 5. Quitar el Mundial

- Se eliminan: rutas mundialistas, resultados, calendario de partidos, progreso de Colombia y la categoría "Plato Mundialista".
- Se quitan sus enlaces del menú, el inicio y los accesos rápidos de la app instalada.
- Las secciones de videos cortos, promociones, fidelidad, eventos y el panel de dueño de negocio se mantienen.

## Detalles técnicos

- **Base de datos**: nueva columna `city` en `businesses` y `events` (con valor por defecto `Cali` para lo existente, luego `Barbosa` para lo nuevo) y una columna `business_type` para la categoría macro; la `category` actual pasa a subtipo. Migración con GRANTs y políticas intactas.
- **Estado de ciudad**: contexto React `CityProvider` + `useCity`, persistido con `safeGetItem`/`safeSetItem`, con reverse-geocoding por distancia haversine contra las coordenadas de cada ciudad (ya existe `calculate_distance_km`).
- **Categorías**: un solo módulo `src/data/categories.ts` como fuente de verdad (id, nombre, ícono, color, alias) consumido por `CategoryBar`, `categoryIcons`, `categoryImages`, filtros y mapa.
- **Archivos a eliminar**: `worldcup.ts`, `RutasMundialistas.tsx`, `WorldCup*.tsx`, `ColombiaProgress.tsx`, `RouteMap.tsx` y sus rutas en `App.tsx`.
- **SEO**: `index.html`, `manifest.json`, `sitemap.xml`, `llms.txt` y `robots.txt` actualizados al nuevo nombre, descripción y rutas por ciudad.

## Orden de trabajo

1. Marca: logo, paleta, nombres y metadatos.
2. Quitar el Mundial.
3. Base de datos: columnas de ciudad y tipo de negocio; marcar lo existente como Cali.
4. Selector de ciudad y filtrado global.
5. Nuevas categorías de negocio en toda la interfaz.
6. Investigar y cargar los negocios reales de Barbosa.
