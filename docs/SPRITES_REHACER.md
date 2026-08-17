# 🔁 Rehacer — sólo lo que salió con problemas

> 6 tandas, 14 sprites. Todo lo demás del lago está bien y no se toca.
> Los problemas están **medidos**, no son impresión: abajo va el número de cada uno.

---

## 1. Lo que aprendimos de las dos primeras tandas

Tres reglas nuevas, sacadas de lo que falló. **Van en todos los prompts de acá en adelante.**

### 🔴 Regla A · Nada de estelas, salpicaduras ni sangre DENTRO del sprite

Es el problema más grave y el más fácil de evitar.

El motor mete cada cuadro en una **caja de tamaño fijo**. Si un cuadro trae la
estela pegada, ese cuadro es más ancho que los otros — y al animarse el bicho
**se encoge de golpe**, justo en el momento más visible:

| Sprite | Proporción | Qué tiene de más |
|---|---|---|
| `tiburon_charge0` | 2.02 | — |
| `tiburon_charge01` | 2.17 | — |
| **`tiburon_charge02`** | **2.85** | Estela de burbujas |
| `tiburon_death0` | 1.92 | — |
| `tiburon_death01` | 1.84 | — |
| **`tiburon_death02`** | **2.67** | Charco de sangre |

El tiburón embistiendo se achicaría un 25 % en el tercer cuadro.

> **Las estelas, burbujas, destellos y salpicaduras las dibuja el juego por
> código.** Quedan mejor (se mueven de verdad) y no rompen la proporción.
> En el sprite va **sólo la criatura**.

### 🔴 Regla B · Misma proporción en TODAS las animaciones del mismo bicho

No alcanza con que los cuadros de una animación midan igual: el bicho tiene que
medir lo mismo **nadando, embistiendo y muriendo**. Si no, cambia de tamaño al
cambiar de estado.

Por eso cada tanda de abajo lleva su **proporción exacta**, sacada de los cuadros
que sí salieron bien.

### 🟠 Regla C · Hoja limpia, no lámina de presentación

La segunda tanda vino como láminas lindas: fondo azul, títulos, carteles de
tamaño y cuadros de stats. Se pudo procesar, pero varias etiquetas quedaron
metidas dentro del recorte y hubo que sacarlas a mano.

**Pedila sin nada de eso**: ni títulos, ni números, ni carteles, ni marcos.
Sólo los bichos sobre el fondo.

---

## 2. El bloque de estilo (va al principio de cada prompt)

```
Pixel art de videojuego, estilo retro detallado de 16 bits, calidad profesional.
Vista lateral de perfil, mirando hacia la DERECHA.
Contorno oscuro nítido, sombreado en bandas duras, colores saturados.
FONDO BLANCO LISO.

MUY IMPORTANTE:
- SIN texto, SIN títulos, SIN números, SIN carteles, SIN marcos, SIN stats.
- SIN estela, SIN burbujas, SIN salpicaduras, SIN sangre, SIN efectos:
  SOLO la criatura. Los efectos los agrega el juego aparte.
- SIN sombra proyectada y SIN piso debajo.
- Todos los cuadros en UNA SOLA FILA horizontal, con la criatura del MISMO
  TAMAÑO y la MISMA PROPORCIÓN en todos.
```

---

## 3. Las seis tandas

### 🦈 1. `tiburon_charge` — 3 cuadros · proporción **2,3 : 1**

> El mismo tiburón gris azulado oscuro con cicatrices viejas de las otras
> animaciones, cargando hacia adelante con la boca completamente abierta
> mostrando los dientes, cuerpo estirado y tenso, aleta caudal en tres
> posiciones de impulso. Tres cuadros. El tiburón ocupa exactamente el mismo
> largo y la misma altura en los tres, sin estela ni burbujas de ningún tipo.

```bash
python tools/sprites.py hoja.png --auto --esperados 3 --nombre tiburon_charge --alto 128
```

### 🦈 2. `tiburon_death` — 3 cuadros · proporción **2,3 : 1**

> El mismo tiburón derrotado en tres cuadros: primero herido con cicatrices
> abiertas y el ojo apagándose, después ladeándose de costado, y por último
> volcado con el vientre hacia arriba y los ojos cerrados. Los tres cuadros con
> el tiburón del mismo largo, sin sangre, sin charco, sin burbujas.

```bash
python tools/sprites.py hoja.png --auto --esperados 3 --nombre tiburon_death --alto 128
```

> El tercer cuadro de la tanda anterior traía un charco de sangre. Además de
> romper la proporción, **es un juego para chicos**: mejor sin sangre.

### 🐟 3. `aguja_dash` — 3 cuadros · proporción **4,3 : 1** *(falta entero)*

> El mismo pez aguja amarillo y plateado de hocico largo y puntiagudo, lanzado
> a máxima velocidad en línea recta: cuerpo completamente rígido, aletas
> pegadas al cuerpo, cola en tres posiciones de latigazo. Tres cuadros, el pez
> del mismo largo en los tres, sin estela, sin burbujas y sin líneas de
> velocidad.

```bash
python tools/sprites.py hoja.png --auto --esperados 3 --nombre aguja_dash --alto 90
```

> De la primera tanda no se pudo usar ninguno: todos traían la estela, y eso
> llevaba la proporción de 4,3 a 8,1 — el pez se veía a la mitad de largo.

### 🐟 4. `aguja_death` — 2 cuadros · proporción **4,3 : 1**

> El mismo pez aguja derrotado en dos cuadros: uno de costado con el ojo en
> cruz y el cuerpo flácido, otro dado vuelta panza arriba. Los dos del mismo
> largo, sin burbujas ni marcas.

```bash
python tools/sprites.py hoja.png --auto --esperados 2 --nombre aguja_death --alto 90
```

*(dispersión actual 0,54 — los dos cuadros no miden igual)*

### 🦀 5. `cangrejo_death` — 2 cuadros · proporción **1,7 : 1**

> El mismo cangrejo naranja de caparazón crema abovedado, derrotado en dos
> cuadros: uno tambaleándose con las patas dobladas, otro dado vuelta panza
> arriba con las patas encogidas y los ojos en espiral. **Los dos cuadros con
> el cangrejo ocupando el mismo ancho** — la misma proporción que cuando
> camina, sin estirar las patas fuera de esa medida.

```bash
python tools/sprites.py hoja.png --auto --esperados 2 --nombre cangrejo_death --alto 90
```

*(dispersión actual 0,62 — el segundo cuadro es mucho más ancho porque abre las patas)*

### 🗿 6. `estatua` — 1 cuadro · alto **320 px**

Ésta no es un problema de medida: **es de contenido.** Salió un Poseidón con
tridente. Se ve muy bien, pero pierde el gancho: la idea era que la nena
reconociera en el fondo del lago **algo de su propio mundo**.

Para que ChatGPT sepa qué es una Nuveciela, hay que describírsela — no la conoce:

> Una estatua de piedra antigua hundida en el fondo de un lago, cubierta de
> musgo, percebes y algas, con una grieta atravesándola.
>
> La estatua representa a una criatura con forma de MANO ABIERTA de pie sobre
> sus dedos, como si los dedos fueran piernas. Sobre el dorso de la mano tiene
> una cara sencilla y dulce (dos ojos redondos y una sonrisa pequeña), y de la
> parte de arriba le cae una melena larga y ondulada esculpida en piedra que
> le cubre los costados. Sin brazos, sin tridente, sin corona.
>
> Piedra clara desgastada, con la melena y la cara todavía reconocibles bajo el
> musgo. Melancólica, solemne, como un monumento olvidado.

```bash
python tools/sprites.py hoja.png --auto --esperados 1 --nombre estatua --alto 320
```

---

## 4. Cuando las tengas

Pasámelas y las proceso. Además de dejarlas con el nombre correcto,
**verifico la dispersión de cada tanda** y te digo si quedó dentro de tolerancia
(≤ 0,35) o si hay que insistir con algún cuadro. Es la misma medición con la que
salieron estos seis.

Y si alguna vuelve con la estela puesta igual, avisame: puedo recortarla, pero
sale mejor pedida de nuevo.
