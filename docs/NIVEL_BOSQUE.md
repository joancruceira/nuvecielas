# 🌲 Bosque Mágico — ambientación del nivel 1

> **Repo:** `nuvecielasPlatformer` · nivel índice 0 (el primero del juego)
> **Fecha:** 2026-08-18. Mismo alcance que `NIVEL_LAGO.md`.

---

## 1. El diagnóstico, mirándolo en pantalla

Puse el nivel en pantalla antes de proponer nada. El problema no es que falten
cosas: es que **el fondo es hermoso y la capa jugable no le pertenece**.

| Lo que se ve detrás | Lo que se pisa |
|---|---|
| Árboles gigantes, niebla violeta, lianas colgando | Una franja verde lisa |
| Hongos y flores que brillan en celeste por todos lados | Ladrillos marrones lisos |
| Rayos de sol atravesando las copas | Nada |
| — | Pinchos: triángulos rojos de canvas |
| — | Plataformas: barritas amarillas |
| — | Props del nivel: **ninguno** |

Es exactamente lo que le pasaba al lago antes de `lago.js`.

Y hay algo que el nivel viene sembrando gratis y nadie cobró: **el fondo está
lleno de hongos que brillan, y el jefe del nivel es un Hongo Gigante.**

---

## 2. Lo que entra

### 🍄 Hongos trampolín — la mecánica propia

Hongos de sombrero elástico. Te parás encima y salís disparada más alto que
saltando. Es el ascensor del bosque: gratis, divertido y **se entiende sin una
sola palabra**, igual que el géiser del lago.

Y hace algo que ninguna otra pieza hace: **planta al jefe desde la primera
pantalla**. Cuando la nena llega al Hongo Gigante, viene rebotando en sus hijos
hace veinte minutos. Es el mismo truco que hizo funcionar a la lechuza.

> El sombrero se aplasta al pisarlo y vuelve. Ese aplastón es todo el aviso que
> hace falta: se ve que es blando antes de tocarlo.

### 🌿 Zarzas, ramas y suelo de bosque — el reskin

Lo que más rinde por esfuerzo, por lejos. **Todo lo que la nena toca deja de ser
un rectángulo pintado**:

- Los pinchos pasan a ser **zarzas espinosas** (mismo `TILE.SPIKES`, otra cara —
  igual que el coral punzante del lago).
- Las plataformas pasan a ser **ramas**.
- El suelo deja de ser una franja verde: pasa a ser tierra del bosque con pasto,
  raíces y hongos chiquitos asomando.

### ✨ Rayos de sol y niebla baja — por canvas, sin un solo sprite

El fondo tiene rayos atravesando las copas y la capa jugable no tiene nada. Se
agregan **adelante**, más niebla arrastrándose por el piso. Cuesta casi nada y es
lo que fusiona las dos capas.

### 🪲 Luciérnagas

El equivalente del cardumen del lago: **no hacen daño**. Se juntan alrededor tuyo
cuando te quedás quieta y se dispersan cuando corrés. Fue lo más lindo de mirar
del lago y acá el fondo ya las tiene dibujadas.

### 🌸 La flor que se abre

Se abre dos segundos y se cierra uno y medio, con una estrella adentro.

> **Diferencia a propósito con la almeja del lago: la flor NO saca vida.** Si te
> agarra cerrándose te empuja con una nube de polen y perdés la posición, nada
> más. La almeja está en el último nivel y muerde; esto es el PRIMER nivel del
> juego y el castigo tiene que ser proporcional. La lección —mirar el ritmo y
> entrar a tiempo— se aprende igual.

### 🤚 El árbol de las manos — el gancho narrativo

El lago tiene la Nuveciela de piedra hundida entre las ruinas. Acá va un árbol
antiguo enorme con **huellas de manos marcadas en la corteza**, del tamaño de las
de un chico, algunas ya cubiertas de musgo.

Sin cartel, sin cinemática, sin diálogo: sólo está ahí. Una nena que lo ve
entiende sola que **el bosque se acuerda de ellas** — y encaja con que las
Nuvecielas sean manos.

### Lo que NO entra

**Lianas para columpiarse.** Es lo más caro de todo (física de cuerda) y el nivel
ya tiene doble salto y slimes para la verticalidad. Si algún día querés
columpiarse, da para nivel propio.

---

## 3. Los sprites — 17 imágenes

### 3.1 Las reglas que ya aprendimos (van sí o sí)

1. **Una hoja por grupo**, todos los cuadros en una fila, celdas iguales.
2. **Nada de efectos dentro del sprite**: sin destellos, sin partículas, sin
   estela. Todo eso lo agrega el juego por código; pegado adentro rompe la
   proporción del cuadro.
3. **Sin texto, sin títulos, sin números, sin carteles, sin marcos.**
4. **Sin sombra proyectada y sin piso debajo.** La sombra es lo que más ensucia
   el borrado de fondo.
5. Lo que va apoyado en el suelo se dibuja **completo y de frente**, no en
   perspectiva: el juego es de perfil plano.

### 3.2 El bloque de estilo (va al principio de CADA prompt)

```
Pixel art de videojuego, estilo retro detallado de 16 bits, calidad profesional.
Vista lateral plana, de frente, sin perspectiva.
Contorno oscuro nítido, sombreado en bandas duras (sin degradés suaves),
paleta acotada y saturada.
FONDO BLANCO LISO. Sin sombra proyectada, sin piso, sin marco, sin texto.
Todos los elementos en UNA SOLA FILA horizontal, del mismo alto,
sin separadores ni numeración.
```

### 3.3 La paleta del nivel (repetila en cada prompt)

> Bosque encantado de noche: cortezas marrón oscuro y violáceo, musgo verde
> profundo, y **luz bioluminiscente CELESTE y turquesa** saliendo de los hongos y
> las flores. Toques de violeta y magenta en la vegetación. Nada de verde brillante
> de día: es un bosque nocturno iluminado por lo que crece adentro.

---

## 4. Las seis hojas

### 🍄 1. `hongo_salto` — 2 cuadros · proporción **1,2 : 1**

> [estilo] + [paleta]
> Un hongo trampolín de sombrero ancho, abombado y elástico, de aspecto blando y
> rebotable, con el borde grueso y enrollado hacia arriba. Sombrero magenta con
> lunares celestes que brillan, tallo blanco y grueso. Dos cuadros: el primero en
> reposo, bien abombado; el segundo **aplastado** contra el suelo, el sombrero
> chato y desparramado hacia los costados y el tallo comprimido. Los dos cuadros
> con el hongo ocupando el mismo ancho de base.

```bash
python tools/sprites.py hoja.png --grilla 2x1 --nombre hongo_salto --estilo plano --alto 96
```

> El segundo cuadro es el que hace entender que es blando. Que se note el aplastón.

### 🍄 2. `hongo_deco` — 3 cuadros · alto **80 px**

> [estilo] + [paleta]
> Tres grupos de hongos silvestres que brillan, para decorar el suelo del bosque.
> El primero: un grupo de tres hongos finitos y altos de sombrero celeste
> luminoso. El segundo: dos hongos rechonchos de sombrero violeta con manchas
> claras. El tercero: un racimo bajo de muchos hongos chiquitos turquesa
> apiñados. Los tres apoyados sobre su propia base, sin piso dibujado.

```bash
python tools/sprites.py hoja.png --auto --esperados 3 --nombre hongo_deco --estilo plano --alto 80
```

### 🌿 3. `planta` — 4 cuadros · alto **90 px**

> [estilo] + [paleta]
> Cuatro plantas de suelo de bosque encantado, en fila: un helecho grande de
> hojas abiertas en abanico; un manojo de pasto alto y puntiagudo con florcitas
> celestes que brillan en las puntas; una planta de hojas anchas y oscuras con
> nervaduras luminosas; y un tronco caído cubierto de musgo con hongos chiquitos
> creciéndole encima. Todos apoyados sobre su propia base.

```bash
python tools/sprites.py hoja.png --auto --esperados 4 --nombre planta --estilo plano --alto 90
```

### 🌸 4. `flor` — 2 cuadros · proporción **1,1 : 1**

> [estilo] + [paleta]
> Una flor gigante del bosque encantado, de las que se abren y se cierran. Dos
> cuadros: en el primero **cerrada**, un capullo puntiagudo de pétalos apretados
> color violeta oscuro con las venas brillando apenas. En el segundo **abierta**,
> los mismos pétalos desplegados como una corona, mostrando el centro luminoso
> celeste. Los dos cuadros con la flor de la misma altura y la misma base.

```bash
python tools/sprites.py hoja.png --grilla 2x1 --nombre flor --estilo plano --alto 110
```

### 🌵 5. `zarza` — 2 cuadros · **cuadrado, se repite en fila**

> [estilo] + [paleta]
> Dos matas de zarzas espinosas de bosque, para poner una al lado de la otra
> formando una barrera continua. Tallos leñosos oscuros y retorcidos con espinas
> largas y curvas apuntando hacia arriba, y alguna hojita violeta. **Los dos
> cuadros tienen que poder ir pegados uno al lado del otro sin que se note el
> corte**: los tallos llegan hasta los bordes izquierdo y derecho de la celda.
> Cuadrados, del mismo tamaño.

```bash
python tools/sprites.py hoja.png --grilla 2x1 --nombre zarza --estilo plano --alto 96
```

### 🪵 6. `suelo` — 3 cuadros · **cuadrados, se repiten en fila**

> [estilo] + [paleta]
> Tres celdas cuadradas de suelo de bosque encantado, para repetir en fila
> formando el piso. La primera: tierra oscura con una capa de pasto y musgo
> arriba. La segunda: la misma tierra con una raíz gruesa asomando y dos hongos
> chiquitos celestes que brillan. La tercera: tierra sola, sin pasto, para las
> capas de abajo. **Las tres tienen que poder ir pegadas una al lado de la otra
> sin que se note el corte.** Cuadradas y del mismo tamaño.

```bash
python tools/sprites.py hoja.png --grilla 3x1 --nombre suelo --estilo plano --alto 96
```

### 🤚 7. `arbol_manos` — 1 cuadro · alto **420 px**

Éste es el del gancho. Va solo y grande.

> [estilo] + [paleta]
> Un árbol antiguo y enorme, de tronco ancho y retorcido, cubierto de musgo, en un
> bosque encantado de noche. En la corteza del tronco hay **huellas de manos
> abiertas marcadas en la madera**, del tamaño de las manos de un chico, algunas
> nítidas y otras ya casi tapadas por el musgo, repartidas a distintas alturas
> como si las hubieran ido dejando con los años. De las ramas cuelgan lianas y
> crecen hongos celestes que brillan en la base del tronco.
>
> Solemne y cálido, no siniestro: es un árbol que se acuerda de alguien.
> Sin cara, sin ojos, sin boca: es un árbol, no un monstruo.

```bash
python tools/sprites.py hoja.png --auto --esperados 1 --nombre arbol_manos --estilo unico --alto 420
```

---

## 5. Mientras tanto

**El nivel ya está construido y andando** con todo dibujado por canvas: los
hongos rebotan, la flor se abre, las luciérnagas te siguen, hay rayos de sol y
niebla, y las zarzas y el suelo ya no son rectángulos de color. Se puede jugar.

Cuando lleguen los sprites entran solos, sin tocar la lógica: el dibujado ya está
separado (`drawImage` si hay sprite, forma de canvas si no), igual que en el lago.
