# 🦉 La Lechuza Guardiana — jefe del Sendero Nocturno

> Reemplaza al **Ciempiés Gigante** (nivel 3, índice 2).
> **Repo:** `nuvecielasPlatformer` · **Fecha:** 2026-08-18.

---

## 1. Por qué el ciempiés no servía

Miré el sprite antes de proponer nada: `cienpies_walk0.png` es un gusano verde
segmentado. El nivel ya tiene **orugas** como enemigo común, así que el jefe se
lee como *"la misma oruga pero más grande"*. No tiene relación con la noche, ni
con la luna, ni con el camino dorado, ni con el castillo al que estás yendo.

No era un problema de calidad de dibujo. Era que no pertenecía.

---

## 2. Por qué una lechuza

**Porque ya está en el nivel y nadie la cobró.**

En `img/sendero0.png` —la primera pantalla del nivel— hay **tres búhos posados en
las ramas mirándote**, bajo la luna llena. Te acompañan todo el camino y el juego
nunca explica por qué están ahí. Al final del sendero, la más grande baja del
árbol.

Eso es un remate que el nivel venía sembrando gratis desde el primer segundo.

Además ordena el bestiario, que hoy es una lista de bichos sueltos:

```
        oruga  →  murciélago  →  LECHUZA
        (come hojas)  (come insectos)  (come murciélagos)
```

El jefe deja de ser "el enemigo grande" y pasa a ser **el de arriba de todo**.

Y no viene a matarte: viene a ver si merecés pasar al Castillo. Para una nena de
esta edad eso es mejor que un monstruo — es una prueba, no una carnicería.

---

## 3. La pelea

Arena: columnas 168-199 (el suelo ya es continuo). Se pelea sobre las tres
plataformas que ya existen en la fila 9.

### El ciclo

```
  posado ──► vuelo ──► picada ──► ATERRIZADO ──► posado
  (te mira)  (círculos)  (se tira)   (le pegás acá)
```

**La regla que enseña la pelea: es un pájaro, y un pájaro necesita un momento
para volver a levantar vuelo.** Mientras vuela no la tocás. Cuando se tira y toca
el piso, queda plantada un segundo y medio: ese es tu turno. Un chico lo descubre
solo a la primera picada, sin cartel.

Los disparos le pegan siempre. El pisotón, sólo aterrizada.

### Las tres fases

| Fase | Vida | Qué cambia |
|---|---|---|
| 1 | 12 → 9 | Una picada por ciclo. Queda aterrizada 1,4 s. Es la fase que enseña. |
| 2 | 8 → 5 | Abre con el **grito**: se apaga la luz. Dos picadas seguidas, 1,1 s de piso. |
| 3 | 4 → 1 | El grito vuelve cada dos ciclos. Tres picadas, 0,9 s de piso. |

### El grito — lo que hace que esta pelea no se parezca a ninguna otra

Se planta de frente, abre las alas y grita: **el camino dorado se apaga**. La
pantalla queda a oscuras salvo un círculo alrededor tuyo y **dos ojos amarillos
flotando**. Cinco segundos. Después las luciérnagas vuelven y el camino se vuelve
a encender solo.

En la oscuridad no la ves: **ves los ojos**. Y los ojos te dicen de dónde viene.

Vale la pena porque hoy `dark: true` sólo cambia colores de tiles — no hay nada
en todo el juego que te tape la visión. La pelea final del sendero es el único
lugar donde eso significa algo, porque el sendero **es** la luz del nivel.

---

## 4. Los sprites — 6 hojas, 16 cuadros

### 4.1 Las reglas que ya aprendimos (van sí o sí)

1. **Una hoja por animación**, todos los cuadros en una fila, celdas iguales. Los
   cuadros pedidos de a uno vienen con proporciones distintas y el bicho late.
2. **Nada de efectos dentro del sprite**: sin estela, sin plumas volando, sin
   destellos, sin sangre. Todo eso lo agrega el juego por código y si viene
   pegado rompe la proporción del cuadro.
3. **Sin texto, sin títulos, sin números, sin carteles, sin marcos.**
4. 🆕 **El cuerpo mide siempre lo mismo.** De la cabeza a las patas, la lechuza
   ocupa la misma altura en *todas* las animaciones. **Las alas se extienden a los
   costados, nunca por encima de la cabeza.** Sin esto, el cuadro con las alas
   abiertas hace que el cuerpo se vea chiquito, que es exactamente lo que pasó con
   la serpiente del nivel 2.

### 4.2 El bloque de estilo (va al principio de CADA prompt)

```
Pixel art de videojuego, estilo retro detallado de 16 bits, calidad profesional.
Contorno oscuro nítido, sombreado en bandas duras (sin degradés suaves),
paleta acotada y saturada, luz de luna desde arriba.
FONDO BLANCO LISO. Sin sombra proyectada, sin piso, sin marco, sin texto.
Una hoja de sprites: TODOS los cuadros en una sola fila horizontal,
celdas del mismo ancho y alto, sin separadores ni numeración.
El CUERPO (de la cabeza a las patas) ocupa la misma altura en todos los cuadros.
Las alas se extienden hacia los COSTADOS, nunca por encima de la cabeza.
SIN estela, SIN plumas sueltas volando, SIN destellos, SIN efectos.
```

### 4.3 El personaje (repetilo en cada hoja para que no cambie)

> Una lechuza gigante y antigua, guardiana de un camino en el bosque de noche.
> Plumaje marrón oscuro y gris pizarra con motas crema, penachos de plumas sobre
> la cabeza como cuernos, cara redonda en forma de corazón color hueso, pico
> corto y curvo, garras grandes y oscuras. **Ojos enormes de un amarillo dorado
> que brilla en la oscuridad** — son lo más importante del diseño, se tienen que
> ver desde lejos. Imponente y solemne, no monstruosa ni sangrienta: es una
> guardiana antigua, no un demonio.

---

## 5. Las seis hojas

### 🦉 1. `lechuza_posado` — 2 cuadros · **vista lateral, mirando a la DERECHA**

> [estilo] + [personaje]
> La lechuza posada, quieta y erguida, con las alas plegadas contra el cuerpo y
> las garras cerradas sobre una rama que no se ve. Dos cuadros: en el primero
> mira al frente con los ojos bien abiertos; en el segundo gira apenas la cabeza,
> con los ojos igual de abiertos. El cuerpo del mismo tamaño y en la misma
> posición en los dos.

```bash
python tools/sprites.py hoja.png --grilla 2x1 --nombre lechuza_posado --alto 280
```

### 🦉 2. `lechuza_vuelo` — 4 cuadros · **vista lateral, mirando a la DERECHA**

> [estilo] + [personaje]
> La lechuza volando, en un ciclo completo de aleteo de cuatro cuadros: alas
> arriba del todo, alas a media altura bajando, alas abajo del todo extendidas a
> los costados, alas subiendo. El cuerpo y la cabeza quedan a la MISMA altura en
> los cuatro cuadros: sólo se mueven las alas. Las garras recogidas contra el
> cuerpo.

```bash
python tools/sprites.py hoja.png --grilla 4x1 --nombre lechuza_vuelo --alto 280
```

### 🦉 3. `lechuza_picada` — 2 cuadros · **vista lateral, mirando a la DERECHA**

> [estilo] + [personaje]
> La lechuza lanzándose en picada: cuerpo estirado hacia adelante, alas pegadas y
> echadas hacia atrás, garras abiertas y adelantadas listas para agarrar, ojos
> fijos y muy abiertos. Dos cuadros con una diferencia mínima en las garras y las
> plumas de la cola. El cuerpo del mismo tamaño en los dos, sin líneas de
> velocidad ni estela.

```bash
python tools/sprites.py hoja.png --grilla 2x1 --nombre lechuza_picada --alto 280
```

### 🦉 4. `lechuza_grito` — 3 cuadros · **vista FRONTAL, mirándote de frente**

> [estilo] + [personaje]
> **De frente, mirando directo al espectador**, plantada sobre las dos garras.
> Tres cuadros del mismo gesto: en el primero las alas plegadas y el pico
> cerrado; en el segundo las alas a medio abrir y el pico entreabierto; en el
> tercero **las alas completamente abiertas hacia los costados** y el pico bien
> abierto gritando, con los ojos amarillos enormes y encendidos. El cuerpo a la
> misma altura en los tres: lo único que crece es la envergadura hacia los lados.

```bash
python tools/sprites.py hoja.png --grilla 3x1 --nombre lechuza_grito --alto 280
```

> Éste es el cuadro más importante de los seis: es el momento en que se apaga la
> luz del nivel. Que valga la pena mirarlo.

### 🦉 5. `lechuza_damage` — 2 cuadros · **vista lateral, mirando a la DERECHA**

> [estilo] + [personaje]
> La lechuza golpeada: la cabeza echada hacia atrás, un ala caída, los ojos
> apretados y las plumas del cuello erizadas. Dos cuadros del mismo tamaño, sin
> sangre, sin plumas sueltas volando y sin destellos.

```bash
python tools/sprites.py hoja.png --grilla 2x1 --nombre lechuza_damage --alto 280
```

### 🦉 6. `lechuza_death` — 3 cuadros · **vista lateral, mirando a la DERECHA**

> [estilo] + [personaje]
> La lechuza vencida en tres cuadros: primero de rodillas con las alas caídas y
> la cabeza gacha; después sentada, encogida, con los ojos cerrados; y por último
> acurrucada y quieta, con las alas envolviéndola como un manto y los penachos
> bajos. **Serena, no violenta**: se rinde y se duerme, no agoniza. Los tres
> cuadros del mismo tamaño, sin sangre y sin plumas sueltas.

```bash
python tools/sprites.py hoja.png --grilla 3x1 --nombre lechuza_death --alto 280
```

---

## 6. Lo que apareció al construirla y al jugarla

**La pelea se rompía sola.** Al probarla salió que, si le pegabas en cada
aterrizaje, la lechuza volvía al piso con la ventana reseteada y se la podía
matar encadenando doce pisotones seguidos sin que llegara a volar una sola vez:
la pelea duraba cinco segundos. Ahora, golpeada, levanta vuelo. **Un golpe por
aterrizaje**, y la pelea completa dura unos 40 segundos.

**El grito no se disparaba nunca.** Estaba puesto para salir sólo desde el estado
"posada en la rama"… al que la lechuza no vuelve nunca si le acertás siempre. O
sea que el apagón —el corazón de la pelea— era invisible para quien jugara bien.
Ahora también se decide al terminar el golpe, y encima cae mejor: el golpe que la
pasa de fase la hace tambalear, y de ahí grita.

**Miraba siempre para el otro lado.** Asumí que los sprites estaban dibujados
mirando a la izquierda y están dibujados mirando a la **derecha**: el espejado
quedó invertido y la lechuza le daba la espalda al jugador todo el tiempo. Se
midió en vez de suponer —dónde cae el disco facial respecto del centro del
cuerpo— y ahora se espeja al revés. Es el bug que más ensuciaba todo lo demás:
un bicho que te da la espalda se lee como un bicho que no te ve.

**Parecía un bucle fijo.** Dos causas, las dos arregladas:

- Después de cada picada volvía **siempre a la misma percha**. Ahora sube a la
  altura de la rama pero en horizontal se acerca a vos, así que nunca arranca
  dos veces desde el mismo lugar.
- Se tiraba **cuando se le cumplía un cronómetro**, no cuando lograba ponerse
  encima. Ahora vuela al triple de velocidad (300 px/s) y sólo se lanza cuando
  está a menos de 100 px de estar justo arriba tuyo. El tope de 2,8 s quedó
  únicamente para que no se quede dando vueltas si corrés en círculos.

**Era grande.** La caja pasó de 128×120 a **96×120** y el dibujo de 150 a 125 px
de alto: la lechuza mide ahora 1,7 veces la nena en vez de 2,1.

---

## 7. Cuando las tengas

Pasámelas y las proceso: las parto, les saco el fondo, verifico que el cuerpo mida
igual entre animaciones y las dejo con el nombre correcto en `img/level3/`.

Mientras tanto la pelea **ya está construida y andando** con una lechuza dibujada
por canvas: se puede jugar, se siente el grito y la oscuridad. Cuando lleguen los
sprites entran solos, sin tocar la lógica.

---

## 8. Lo que llegó, y en qué se diferencia de lo pedido

ChatGPT mandó **una sola imagen de 1942×809 con tres filas** en vez de seis hojas
separadas. La calidad es muy buena, pero el reparto de cuadros no fue el pedido,
así que la lista de animaciones se ajustó a lo que realmente vino:

| Animación | Pedido | Llegó |
|---|---|---|
| `posado` | 2 | 2 ✅ |
| `vuelo` | 4 | 4 ✅ |
| `picada` | 2 | **3** — vino un cuadro extra de alas altas y quedó mejor |
| `aterrizado` | — | **2** ← nuevo |
| `grito` | 3 | **2** |
| `damage` | 2 | 2 ✅ |
| `death` | 3 | 3 ✅ |

**`aterrizado` no estaba en el plan y es la mejora más grande.** Llegaron dos
cuadros de la lechuza encogida, con las alas caídas y las patas plantadas. Ésa es
exactamente la ventana en la que le pegás, y antes reusaba los cuadros de la
rama: ahora el momento vulnerable se distingue de un vistazo, sin cartel.

Quedaron tres cuadros **sin usar**, por si hacen falta después: uno de vuelo con
las alas muy altas, uno frontal con las alas abiertas y las garras adelantadas
(sería un golpe de frente buenísimo), y uno de la lechuza posada de perfil.

### El problema que había que resolver antes de cortar

Los cuadros de vuelo tienen **las alas por encima de la cabeza**. Como el motor
escala por la altura de la imagen, escalarlos todos a la misma altura hacía que
el cuerpo se viera chico justo al volar: el mismo error que dejó gigante a la
serpiente del nivel 2, al revés.

La solución no fue medir el alto sino **el disco facial**: la cara es lo único
que no cambia de tamaño entre poses. Se contó cuántos píxeles de cara clara tiene
cada cuadro y se escaló cada uno para que esa medida sea idéntica (√área = 36).
Después todos se pegaron **en un lienzo común de 378×284, apoyados abajo y
centrados**. Así los PNG miden todos igual, el motor los escala con un solo
factor y la lechuza no cambia de tamaño al pasar de posada a volando.

De paso, la misma detección de píxeles amarillos sirvió para medir **dónde está
cada ojo en cada cuadro**. Esa tabla es la que usa el apagón para poner los dos
faroles sobre la cabeza: la cabeza se mueve muchísimo entre poses, y sin la tabla
los ojos quedaban flotando en el aire al lado del bicho.

> Con luz normal los ojos ya no se dibujan por código: los sprites los traen
> pintados y agregarles brillo encima sólo los ensuciaba. Los faroles existen
> únicamente durante el apagón, que es cuando son la única información que tenés.
