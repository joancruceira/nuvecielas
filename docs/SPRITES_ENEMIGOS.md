# ⚔️ Regenerar todos los enemigos — prompts y reglas

> Para rehacer el bestiario completo del Bosque Mágico, nivel por nivel, bosses
> incluidos, con la calidad y la coherencia que hoy no tienen.
> **Todo lo que sigue está medido del código, no estimado.**

---

## 1. Qué está mal hoy (con números)

Medí los 60 sprites que hay en `img/`. El problema no es que estén feos: es que
**no fueron hechos con las mismas reglas**, y el motor los castiga.

### 1.1 🔴 Los cuadros de una misma animación miden distinto

Casi todos los enemigos se dibujan así (`murcielago.js:156`, `oruga.js:158`,
`cienpies.js:176`, `enemies_level4.js`):

```js
ctx.drawImage(im, -e.w/2, -e.h/2, e.w, e.h);   // ← la caja de la entidad, FIJA
```

El motor **mete cada cuadro a la fuerza en una caja fija**. Si los cuadros no
tienen la misma proporción, el bicho se estira y se encoge solo al animarse:

| Animación | Alturas de sus cuadros | Qué pasa |
|---|---|---|
| `oruga_walk` | 87, 88, 105, 107 | Late al caminar |
| `oruga_attack` | 84, 104, 107 | Se deforma al atacar |
| `cienpies_death` | 117 y **256** | Un cuadro al doble de tamaño |
| `arbusto_idle` | 122, 126 | Vibra |
| `boss_walk` (Rey) | 264, 268, 278, 290 | El boss "respira" sin querer |

El murciélago es el único impecable: **los 16 cuadros miden 80**. Y se nota — es
el enemigo que mejor se ve del juego.

### 1.2 🔴 El boss del nivel 1 no es lo que dice ser

`Level1.js` declara `bossName: 'Hongo Gigante'`. Pero `boss.js:3` dice
*"Usa alien.png como sprite"* y `boss.js:152` dibuja un *"aura verde alienígena"*.

**El jefe del bosque mágico es un alienígena.** Eso hay que arreglarlo sí o sí.

### 1.3 🟠 Hay enemigos sin ningún sprite

`flyer` (44×36) y `ghost` (34×40) se usan en los niveles 1 y 2 y se dibujan con
formas de canvas: un óvalo con dos puntos rojos. Nunca tuvieron arte.

### 1.4 🟠 No hay una escala común

El jugador mide **58×72**. Los enemigos van de 34 a 256 px de caja sin ninguna
lógica compartida, y los sprites de origen van de 80 a 320 px sin relación con
su caja. Por eso el conjunto no se siente de un mismo juego.

---

## 2. Las tres reglas que arreglan todo

### Regla 1 · Pedí HOJAS, no cuadros sueltos
Esta es la más importante y la que resuelve el 1.1. Si pedís los cuadros de a uno,
cada imagen viene con proporciones distintas y el bicho late. **Pedí todos los
cuadros de una animación en una sola imagen, en fila, con celdas iguales**, y
partila después:

```bash
python tools/sprites.py hoja.png --grilla 4x1 --nombre oruga_walk --alto 96
```

Al partir una grilla, **las celdas salen idénticas por construcción**. El problema
desaparece de raíz.

> Esto corrige lo que te había dicho en el pack del lago: ahí sugerí "uno por
> mensaje". Para animaciones **la hoja es mejor**, justamente por esto.

### Regla 2 · Respetá la proporción de la caja
Cada enemigo tiene una caja fija en el juego. Si el sprite viene con otra
proporción, se deforma. La tabla de la sección 4 tiene la proporción exacta de
cada uno — **decísela a ChatGPT en el prompt**.

### Regla 3 · Escala relativa al jugador
El jugador mide 58×72 en pantalla. Todo el bestiario se lee en relación a eso:
un bicho "chico" tiene que verse chico **al lado de la nena**, no en el vacío.
La tabla dice cuántas veces el jugador mide cada uno.

---

## 3. El bloque de estilo (va al principio de CADA prompt)

```
Pixel art de videojuego, estilo retro detallado de 16 bits, calidad profesional.
Vista lateral de perfil, mirando hacia la DERECHA.
Contorno oscuro nítido, sombreado en bandas duras (sin degradés suaves),
paleta acotada y saturada, luz desde arriba.
Criatura completa y centrada en cada celda, sin recortes.
FONDO BLANCO LISO. Sin sombra proyectada, sin piso, sin marco, sin texto.
Una hoja de sprites: TODOS los cuadros en una sola fila horizontal,
celdas del mismo ancho y alto, la criatura del mismo tamaño en todas,
sin separadores ni numeración.
```

Las tres frases que más rinden:

- **"celdas del mismo ancho y alto, la criatura del mismo tamaño en todas"** —
  ataca directo el defecto 1.1.
- **"mirando hacia la DERECHA"** — el motor espeja solo con `facing`; si vienen
  mezclados quedan bichos caminando de espaldas.
- **"FONDO BLANCO LISO, sin sombra proyectada"** — la sombra bajo el bicho es lo
  que más ensucia el borrado automático.

---

## 4. La tabla de escala — la fuente de la coherencia

Sacada de las cajas reales del código. **La altura destino es 2× la caja**: da
nitidez en pantallas densas sin inflar el peso.

| Enemigo | Caja en juego | Proporción | `--alto` | Tamaño vs. la nena |
|---|---|---|---|---|
| 🧍 *Jugadora (referencia)* | *58×72* | *0.8* | — | *—* |
| Walker | 44×44 | cuadrado | 88 | Le llega a la cintura |
| Serpiente | 56×52 | 1.08 apaisado | 104 | Baja y larga |
| Flyer | 44×36 | 1.22 apaisado | 72 | Chico, vuela |
| Ghost | 34×40 | 0.85 vertical | 80 | El más chico del juego |
| Fantasma *(boss n.2)* | 72×80 | 0.9 vertical | 160 | Un poco más alto que ella |
| Hongo Gigante *(boss n.1)* | 96×96 | cuadrado | 192 | Ancho, imponente |
| Oruga | 64×48 | 1.33 apaisado | 96 | Rastrera |
| Arbusto | 56×56 | cuadrado | 112 | Compacto |
| Murciélago | 64×40 | 1.60 apaisado | 80 ✅ | Alas anchas |
| Ciempiés *(boss n.3)* | 256×128 | **2.0 muy apaisado** | 256 | Enorme y largo |
| Caballero Helado | 48×60 | 0.8 vertical | 120 ✅ | Como ella |
| Gárgola | 56×56 | cuadrado | 112 ✅ | Compacta |
| Gota Viviente | 40×40 | cuadrado | 80 | Chiquita |
| Rey de Escarcha *(boss n.4)* | 96×128 | 0.75 vertical | 256 | El doble de alta |

✅ = ya está bien hoy, sólo hay que mantenerlo.

---

## 5. La identidad de cada nivel

Los colores salen del código. **El enemigo tiene que contrastar con su fondo**, no
combinar: si se camufla, no se ve venir.

| Nivel | Cielo | Suelo | Clima | Paleta para los bichos |
|---|---|---|---|---|
| **1 · Bosque Mágico** | violeta oscuro `#1a0a3d`→`#4a1870` | verde `#2a6a18` | Bosque nocturno mágico | Verdes ácidos, marrón corteza, hongos rojo/naranja. **Nada violeta** |
| **2 · Castillo de Nuveciela** | casi negro `#0a0010` | piedra violeta `#2a1040` | Castillo embrujado, oscuro | Blanco espectral, cian fantasmal, dorado viejo. Que **brillen** en la oscuridad |
| **3 · Sendero Nocturno** | azul noche `#0a0520` | tierra `#2a1a0a` | Camino de bosque, de noche | Verde oliva, púrpura tóxico, rojo de ojos. Bichos |
| **4 · Castillo de la Ciela** | azul ártico `#0b1a30` | nieve `#93c5fd` | Castillo congelado | Hielo cian, plata, azul pálido. **Escarcha en todo** |
| **5 · El Lago** | — | — | Subacuático | Ver `docs/SPRITES_LAGO.md` |

---

## 6. Los prompts, nivel por nivel

> Cada fila: el prompt (después del bloque de estilo) y el comando que lo deja
> listo. Los nombres de archivo son **exactamente** los que el motor ya busca —
> si cambiás uno, ese enemigo deja de dibujarse.

### 🌲 Nivel 1 — Bosque Mágico

| Animación | Prompt | Comando |
|---|---|---|
| `walker_idle` (2) | `Una criatura rechoncha del bosque, con cuerpo de musgo verde y corteza, ojos grandes brillantes, patas cortas y gruesas, una seta pequeña creciéndole en la espalda. Dos cuadros de reposo: respirando.` | `--grilla 2x1 --nombre walker_idle --alto 88` |
| `walker_attack` (1) | `La misma criatura de musgo embistiendo con la cabeza baja, boca abierta con dientes de madera, ojos furiosos.` | `--nombre walker_attack --alto 88` |
| `walker_hit` (1) | `La misma criatura golpeada, ojos apretados, trozos de musgo saltando, destello rojo.` | `--nombre walker_hit --alto 88` |
| `serpiente_idle` (2) | `Una serpiente del bosque verde esmeralda con vientre amarillo, enroscada y alerta, lengua bífida, ojos ámbar. Dos cuadros de reposo. Formato apaisado.` | `--grilla 2x1 --nombre serpiente_idle --alto 104` |
| `serpiente_walk` (3) | `La misma serpiente reptando, cuerpo ondulado en tres posiciones de avance. Formato apaisado, ocupando el ancho de la celda.` | `--grilla 3x1 --nombre serpiente_walk --alto 104` |
| `serpiente_attack` (1) | `La misma serpiente lanzando la mordida, boca muy abierta con colmillos, cuello estirado hacia adelante.` | `--nombre serpiente_attack --alto 104` |
| **`hongo_idle`** (2) 🆕 | `Un HONGO GIGANTE monstruoso: sombrero rojo enorme con manchas blancas, ojos amarillos furiosos bajo el sombrero, tronco grueso con boca dentada, raíces como brazos. Imponente, ocupa toda la celda. Dos cuadros de reposo: hinchándose.` | `--grilla 2x1 --nombre hongo_idle --alto 192` |
| **`hongo_attack`** (2) 🆕 | `El mismo hongo gigante golpeando el suelo con sus raíces-brazo, sombrero echado hacia atrás, boca abierta soltando esporas verdes.` | `--grilla 2x1 --nombre hongo_attack --alto 192` |
| **`hongo_hit`** (1) 🆕 | `El mismo hongo gigante golpeado, sombrero abollado, esporas saltando, destello rojo.` | `--nombre hongo_hit --alto 192` |

> ⚠️ El hongo **reemplaza a `alien.png`**. Cuando lo tengas, hay que tocar
> `boss.js` (hoy carga `img/alien.png` y le dibuja un aura verde alienígena).
> Eso lo hago yo — son ~10 líneas.

### 👻 Nivel 2 — Castillo de Nuveciela

| Animación | Prompt | Comando |
|---|---|---|
| `fantasma_idle` (2) | `Un fantasma de castillo, blanco azulado translúcido con el borde luminoso, cola vaporosa en vez de piernas, ojos negros huecos y sonrisa torcida. Elegante, no gracioso. Dos cuadros flotando.` | `--grilla 2x1 --nombre fantasma_idle --alto 160` |
| `fantasma_attack` (1) | `El mismo fantasma abalanzándose, boca enorme abierta, brazos vaporosos extendidos hacia adelante, más brillante.` | `--nombre fantasma_attack --alto 160` |
| `fantasma_hit` (1) | `El mismo fantasma disipándose por el golpe, silueta rota en jirones, destello.` | `--nombre fantasma_hit --alto 160` |
| **`ghost_idle`** (2) 🆕 | `Un fantasmita pequeño y redondo, blanco fosforescente con ojitos negros simples, colita ondulada. Simpático pero inquietante. Dos cuadros flotando.` | `--grilla 2x1 --nombre ghost_idle --alto 80` |
| **`flyer_fly`** (3) 🆕 | `Un murciélago-espectro pequeño del castillo, cuerpo violeta oscuro con alas membranosas translúcidas de borde cian brillante, ojos rojos. Tres cuadros de aleteo. Formato apaisado.` | `--grilla 3x1 --nombre flyer_fly --alto 72` |

### 🌙 Nivel 3 — Sendero Nocturno

**El nivel mejor resuelto del juego.** El murciélago no se toca. De la oruga, el
arbusto y el ciempiés conviene rehacer las hojas para que los cuadros midan igual.

| Animación | Prompt | Comando |
|---|---|---|
| `oruga_walk` (4) | `Una oruga gorda púrpura con rombos amarillos en el lomo, ojos amarillos furiosos, patitas cortas. Cuatro cuadros de avance ondulante. Formato apaisado, MISMO tamaño en las cuatro celdas.` | `--grilla 4x1 --nombre oruga_walk --alto 96` |
| `oruga_attack` (4) | `La misma oruga irguiendo la mitad delantera del cuerpo, boca abierta, en cuatro cuadros.` | `--grilla 4x1 --nombre oruga_attack --alto 96` |
| `oruga_damage` (4) | `La misma oruga golpeada, encogida, destello rojo, en cuatro cuadros.` | `--grilla 4x1 --nombre oruga_damage --alto 96` |
| `oruga_death` (4) | `La misma oruga derrotada: se desploma y se deshace en humo púrpura, cuatro cuadros.` | `--grilla 4x1 --nombre oruga_death --alto 96` |
| `arbusto_idle` (4) | `Un arbusto viviente verde oliva con hojas puntiagudas, dos ojos rojos brillantes escondidos entre el follaje, raíces-patas. Cuatro cuadros meciéndose.` | `--grilla 4x1 --nombre arbusto_idle --alto 112` |
| `arbusto_damage` (4) | `El mismo arbusto perdiendo hojas por el golpe, ojos apretados, cuatro cuadros.` | `--grilla 4x1 --nombre arbusto_damage --alto 112` |
| `arbusto_death` (3) | `El mismo arbusto marchitándose hasta quedar ramas peladas, tres cuadros.` | `--grilla 3x1 --nombre arbusto_death --alto 112` |
| `cienpies_walk` (3) | `Un CIEMPIÉS GIGANTE verde oscuro acorazado, muchísimas patas, manchas rojas en los segmentos, mandíbulas enormes, ojos rojos. MUY apaisado: el doble de largo que de alto. Tres cuadros de avance.` | `--grilla 3x1 --nombre cienpies_walk --alto 256` |
| `cienpies_attack` (3) | `El mismo ciempiés gigante irguiendo la cabeza con las mandíbulas abiertas de par en par, cuerpo en arco. Muy apaisado.` | `--grilla 3x1 --nombre cienpies_attack --alto 256` |
| `cienpies_damage` (3) | `El mismo ciempiés gigante golpeado, segmentos agrietados, destello rojo. Muy apaisado.` | `--grilla 3x1 --nombre cienpies_damage --alto 256` |
| `cienpies_death` (2) | `El mismo ciempiés gigante derrumbándose, segmentos separándose. Muy apaisado. **Los dos cuadros del mismo tamaño.**` | `--grilla 2x1 --nombre cienpies_death --alto 256` |

> El `cienpies_death` es el que hoy tiene un cuadro de 117 y otro de 256. Ese
> arreglo se ve enseguida.

### ❄️ Nivel 4 — El Castillo de la Ciela

Las gárgolas, el guardia y la gota **ya tienen alturas parejas**. El que necesita
la mano es el boss (264→290 entre cuadros).

| Animación | Prompt | Comando |
|---|---|---|
| `guardia_idle` (1) | `Un caballero de armadura cubierta de escarcha, yelmo cerrado con visor brillando cian, escudo y lanza de hielo. Congelado por dentro, se mueve con esfuerzo.` | `--nombre guardia_idle --alto 120` |
| `guardia_walk` (3) | `El mismo caballero helado avanzando pesadamente, tres cuadros, escarcha cayéndole de la armadura.` | `--grilla 3x1 --nombre guardia_walk --alto 120` |
| `guardia_defense` (4) | `El mismo caballero cubriéndose tras el escudo de hielo, agachado, cuatro cuadros.` | `--grilla 4x1 --nombre guardia_defense --alto 120` |
| `guardia_attacked` (4) | `El mismo caballero golpeado, la armadura se agrieta y salta escarcha, cuatro cuadros.` | `--grilla 4x1 --nombre guardia_attacked --alto 120` |
| `gargola_idle` (5) | `Una gárgola de piedra gris azulada cubierta de hielo, alas plegadas, ojos cian encendidos, gesto feroz. Cinco cuadros: despertando de a poco.` | `--grilla 5x1 --nombre gargola_idle --alto 112` |
| `gargola_fly` (5) | `La misma gárgola volando con las alas de piedra desplegadas, cinco cuadros de aleteo.` | `--grilla 5x1 --nombre gargola_fly --alto 112` |
| `gargola_frozen` (5) | `La misma gárgola dentro de un bloque de hielo translúcido, inmóvil, cinco cuadros con el hielo agrietándose.` | `--grilla 5x1 --nombre gargola_frozen --alto 112` |
| `gota_walk` (6) | `Una gotita de agua viviente celeste translúcida con ojitos simpáticos, cuerpo que se estira y se aplasta al saltar. Seis cuadros de rebote.` | `--grilla 6x1 --nombre gota_walk --alto 80` |
| `gota_frozen` (6) | `La misma gotita convertida en un cubito de hielo, ojos sorprendidos, seis cuadros congelándose.` | `--grilla 6x1 --nombre gota_frozen --alto 80` |
| `boss_idle` (1) | `El REY DE ESCARCHA: un rey alto y esquelético de hielo azul translúcido, corona de carámbanos, capa de escarcha, ojos blancos ardientes, cetro helado. Majestuoso y cruel. De pie, imponente.` | `--nombre boss_idle --alto 256` |
| `boss_walk` (4) | `El mismo Rey de Escarcha avanzando, capa ondeando, cuatro cuadros. **Mismo tamaño en los cuatro.**` | `--grilla 4x1 --nombre boss_walk --alto 256` |
| `boss_attack` (5) | `El mismo Rey de Escarcha alzando el cetro y desatando una ventisca, cinco cuadros. Mismo tamaño en los cinco.` | `--grilla 5x1 --nombre boss_attack --alto 256` |
| `boss_jump` (2) | `El mismo Rey de Escarcha saltando: uno agazapado juntando fuerza, otro en el aire con la capa extendida.` | `--grilla 2x1 --nombre boss_jump --alto 256` |
| `boss_frozen` (3) | `El mismo Rey de Escarcha atrapado en su propio hielo, tres cuadros.` | `--grilla 3x1 --nombre boss_frozen --alto 256` |

---

## 7. Dónde va cada cosa

```bash
# Niveles 1 y 2 → la raíz de img/
python tools/sprites.py hoja.png --grilla 2x1 --nombre walker_idle --alto 88 --salida img

# Nivel 3 → img/level3/
python tools/sprites.py hoja.png --grilla 4x1 --nombre oruga_walk --alto 96 --salida img/level3

# Nivel 4 → img/level4/
python tools/sprites.py hoja.png --grilla 4x1 --nombre boss_walk --alto 256 --salida img/level4
```

⚠️ **Los sprites nuevos pisan a los viejos.** Antes de la primera tanda:

```bash
cp -r img img_backup
```

---

## 8. Por dónde empezar

| Orden | Qué | Por qué |
|---|---|---|
| 1 | **Hongo Gigante** (5) | Hoy el jefe del bosque es un alien. Es lo más roto |
| 2 | **`flyer` y `ghost`** (5) | Nunca tuvieron arte: hoy son óvalos con dos puntos |
| 3 | **Walker y serpiente** (8) | Son los primeros enemigos que ve cualquiera |
| 4 | **`cienpies_death`** (2) | Un cuadro al doble de tamaño, se ve feo y es barato |
| 5 | **Oruga y arbusto** (23) | Rehacer las hojas para que dejen de latir |
| 6 | **Rey de Escarcha** (15) | Ya funciona; es pulido |
| 7 | Gárgola, guardia, gota (34) | Los que mejor están. Último |

**Total: ~92 sprites.** Con los pasos 1 a 4 (**20 sprites**) el juego ya se ve
notablemente más de una pieza.

Cuando tengas la primera tanda, pasámela y la proceso: además de dejarla lista,
verifico que todos los cuadros midan igual y que ninguno haya perdido detalle.
