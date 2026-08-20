# 👭 El subnivel de Nina y Jazmín — segunda ronda

> **Repo:** `nuvecielasPlatformer` · `js/submision/` · **Fecha:** 2026-08-20.
> Se entra por la puerta mágica del Castillo de Nuveciela (nivel 2, col 104).

---

## 1. De dónde partimos — y esto hay que decirlo

**Es el pedazo mejor hecho del juego.** No es una opinión de cortesía: es el único
que tiene arte propio para *todo* —nada dibujado por código— y el único con las
zonas y sus intenciones escritas en el mapa. Los tres tramos de tablones sobre el
agua traen la regla anotada en el propio código:

> *"El jugador SIEMPRE ve el tablón antes del vacío."*

Eso es diseño, no improvisación. Así que acá no hay nada que completar.

Y la premisa se sostiene sola: dos nenas reales, en **Rosario de verdad** —con el
Monumento a la Bandera en el fondo—, rescatando gatitos de un ladrón y un
perrero. La regla del mundo real está respetada casi en todo.

### Lo que hay hoy

| Zona | Columnas | Qué es |
|---|---|---|
| 1 | 0-44 | Costanera tranquila — se aprenden los controles |
| 2 | 45-89 | Zona urbana — el colectivo abandonado como plataforma |
| 3 | 92-129 | Sector deteriorado — pozos de agua con tablón |
| 4 | 130-159 | Río Paraná / tormenta — plataformas de metal |
| 5 | 160-189 | Arena del jefe |
| 6 | 190-199 | Rescate de Pablo |

**Los corazones se quedan como están: eliminan.** Se evaluó que convencieran en
vez de eliminar y la decisión fue mantener lo que ya funciona.

---

## 2. Lo que entra

### 🌇 La luz que corre — lo más barato y lo que más cambia

Hoy el cielo es **un degradé fijo de atardecer** con el sol clavado al 75 % de la
pantalla. No se mueve con la cámara y no cambia en 200 tiles: la costanera, la
ciudad, el río y el corralón se ven con exactamente la misma luz.

Pasa a correr con el avance:

```
  costanera  →  ciudad   →   río      →  corralón   →  rescate
  sol de     →  atardece →  tormenta  →   noche     →  primeras
  la tarde                                             luces
```

El sol baja y se corre en el cielo a medida que avanzás, el degradé va de dorado
a violeta a negro, y las estrellas aparecen recién sobre el río. **Es puro código
y no necesita un solo sprite.** Es la forma más honesta de que un nivel largo se
sienta un viaje y no un pasillo.

### 🚧 El corralón — la única regla del mundo real que estaba rota

La arena del jefe (zona 5) tiene hoy **piso violeta con brillo mágico**
(`DARK_GLOW: '#a060f0'`). Es lo único del subnivel que no podría existir en
Rosario, y encima justo en el tramo donde el nivel se pone serio.

Pasa a ser **el corralón municipal de noche**: el mismo piso pero en cemento y
chapa, y la luz deja de ser violeta mágica para ser **naranja de sodio**, la de
los faroles de la calle. Igual de distinto y de amenazante que antes, y real.

Y encaja con la historia mejor que el violeta: **el corralón es adonde se llevan
a los gatos.** Por eso el jefe está ahí.

### 🐈 Los gatitos te siguen en fila

Hoy hay 14 gatitos repartidos y juntarlos sólo suma puntos: no pasa nada con
ellos. Pasan a **seguirte en fila**, como patitos, cada uno un poco atrás del
anterior, y **los entregás al final** junto con Pablo.

Dos cosas se arreglan solas con esto:

- Lo que juntaste **se ve** todo el tiempo, sin mirar un número.
- El final deja de ser *"matá al jefe"* y pasa a ser *"llegaste con todos"*.

### 🚌 Vida de calle — obstáculos, no más villanos

El nivel no necesita más enemigos. Necesita que la calle esté viva.

**El colectivo ya está dibujado** (`bus.png`) y hoy es un adorno fijo. Pasa a
cruzar de vez en cuando por el fondo de la zona urbana. Y se suman cosas que
esquivás pero que no son malas: un carrito que rueda, un charco.

Y gente que **no** te ataca: el kiosquero en su kiosco, una señora paseando un
perro. Ese contraste es lo que hace que el ladrón y el perrero se sientan la
excepción y no la norma — que es exactamente lo que son.

### 🌳 Escenarios nuevos

Tres tramos más, todos Rosario real:

- **El Parque de la Independencia** — el lago, las hamacas, el rosedal. Verde y
  abierto, el respiro antes del río.
- **La peatonal Córdoba** — vidrieras, toldos, gente. El tramo más "ciudad" de
  todos, y el más angosto.
- **Los túneles del Parque España** — un tramo cerrado y oscuro **sin inventar
  nada mágico**: es un túnel de verdad que existe. Resuelve la necesidad de un
  tramo tenso sin romper la regla.

---

## 3. Los sprites que hacen falta

Lo de la luz, el corralón, los gatitos en fila y el colectivo **ya está andando
sin sprites nuevos**. Estas hojas son para la vida de calle y los escenarios.

### 3.1 Las reglas de siempre

1. **Una hoja por grupo**, todo en una fila.
2. **Nada de efectos dentro del sprite**: sin destellos, sin polvo, sin estelas.
3. **Sin texto, sin títulos, sin números, sin carteles, sin marcos.**
4. **Sin sombra proyectada y sin piso debajo.**
5. Vista lateral plana, de frente, sin perspectiva.

### 3.2 El bloque de estilo (va al principio de CADA prompt)

```
Pixel art de videojuego, estilo retro detallado de 16 bits, calidad profesional.
Vista lateral plana, de frente, sin perspectiva.
Contorno oscuro nítido, sombreado en bandas duras, paleta acotada.
FONDO BLANCO LISO. Sin sombra proyectada, sin piso, sin marco, sin texto.
Todos los elementos en UNA SOLA FILA horizontal, sin separadores ni numeración.
```

### 3.3 La regla del mundo real (repetila en cada prompt)

> Esto pasa en **Rosario, Argentina, en la vida real**. Nada mágico, nada de
> fantasía, nada que brille por sí solo. Materiales reales: chapa, cemento,
> ladrillo, madera pintada y descascarada, plástico, hierro oxidado. La luz sale
> de faroles de sodio, vidrieras y ventanas — nunca de los objetos mismos.

---

## 4. Las hojas

### 🧍 1. `gente` — 5 personas · alto **136 px** (igual que las mellis)

> [estilo] + [regla del mundo real]
> Cinco personas de una calle de barrio, de cuerpo entero y de frente, quietas,
> como esperando: un **kiosquero** de delantal apoyado en el mostrador; una
> **señora mayor** con un perrito chiquito de la correa; un **pibe en bici**
> parado con un pie en el piso; una **mamá con cochecito**; y un **barrendero**
> con su carro y su escoba. Gente común, amable, nada de villanos. Todos del
> mismo alto y apoyados sobre su propia base.

```bash
python tools/sprites.py hoja.png --auto --esperados 5 --nombre gente --salida img/submision --estilo plano --alto 136
```

### 🛒 2. `obstaculo` — 4 props · alto **110 px**

> [estilo] + [regla del mundo real]
> Cuatro cosas tiradas en la vereda, en fila: un **carrito de supermercado**
> volcado de costado; una **pila de cajones de verdulería** de plástico
> apilados; un **tacho de basura** de metal abollado; y un **charco de agua**
> chato con un reflejo apenas. Cosas de las que esquivás caminando, no peligros.

```bash
python tools/sprites.py hoja.png --auto --esperados 4 --nombre obstaculo --salida img/submision --estilo plano --alto 110
```

### 🌳 3. `parque` — 5 props · alto **170 px** — *Parque de la Independencia*

> [estilo] + [regla del mundo real]
> Cinco cosas de un parque grande de ciudad, en fila: un **juego de hamacas** de
> caño pintado; un **tobogán** de chapa; un **cantero de rosas** con el borde de
> ladrillo; un **bebedero** de cemento; y un **bote de remos** de madera dado
> vuelta en la orilla de un lago. Todos apoyados sobre su propia base.

```bash
python tools/sprites.py hoja.png --auto --esperados 5 --nombre parque --salida img/submision --estilo plano --alto 170
```

### 🏬 4. `peatonal` — 4 props · alto **200 px** — *peatonal Córdoba*

> [estilo] + [regla del mundo real]
> Cuatro pedazos de una calle peatonal comercial, en fila: una **vidriera** de
> local con toldo a rayas; un **puesto de diarios y revistas**; una **maceta
> grande de cemento** con una planta; y un **cartel de chapa** de una zapatería,
> viejo y despintado. Vistos de frente, planos, como fachada.

```bash
python tools/sprites.py hoja.png --auto --esperados 4 --nombre peatonal --salida img/submision --estilo plano --alto 200
```

### 🚇 5. `tunel` — 5 celdas · **cuadradas, se repiten en fila** — *Parque España*

> [estilo] + [regla del mundo real]
> Cinco celdas cuadradas de la pared de un túnel viejo de ladrillo, para repetir
> en fila. Ladrillo colorado oscuro y húmedo, con manchas de humedad y musgo en
> las juntas. Una de las cinco tiene un **caño de hierro** cruzando, otra una
> **rejilla de ventilación**, otra un **farol de pared apagado**. **Las cinco
> tienen que poder ir pegadas una al lado de la otra sin que se note el corte.**

```bash
python tools/sprites.py hoja.png --grilla 5x1 --nombre tunel --salida img/submision --estilo plano --alto 96
```

### 🚧 6. `corralon` — 5 props · alto **190 px**

> [estilo] + [regla del mundo real]
> Cinco cosas de un corralón municipal de noche, en fila: un **portón de reja**
> de hierro con candado; un **contenedor** de chapa abollado; una **pila de
> jaulas** vacías de alambre; un **poste de luz** de hormigón con una lámpara de
> sodio naranja; y una **casilla** de chapa con una ventanita. Sucio, gastado,
> pero no siniestro: es un depósito municipal, no una mazmorra.

```bash
python tools/sprites.py hoja.png --auto --esperados 5 --nombre corralon --salida img/submision --estilo plano --alto 190
```

---

## 5. Fondos de los escenarios nuevos

Tres fondos anchos, del mismo formato que los que ya hay (`bg_rosario2.png` es
1774×452). Cada uno se cruza con el anterior según el avance, igual que en el
Sendero Nocturno.

> [estilo]
> Fondo panorámico ancho de videojuego, para desplazamiento lateral.
> **1.** El **Parque de la Independencia** de Rosario al atardecer: árboles
> grandes, el lago con el puentecito, el rosedal, gente lejos.
> **2.** La **peatonal Córdoba** al anochecer: fachadas de locales con las
> vidrieras encendidas, toldos, carteles, luces cálidas.
> **3.** El **corralón municipal** de noche: paredón de chapa, reja larga, un
> par de faroles de sodio naranja, cielo negro sin estrellas.
>
> Los tres con el horizonte a la misma altura para que crucen sin salto.

---

## 6. Lo que NO entra

**Más villanos humanos.** Dos y un jefe alcanzan. El problema del nivel nunca fue
que faltaran enemigos: era que la calle estaba vacía entre uno y otro.
