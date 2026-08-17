/**
 * NUVE-WORLD — el contrato compartido del universo Nuvecielas.
 * ============================================================
 *
 * Un solo archivo, JS plano, sin build, que cargan los TRES:
 *
 *   public/index.html          → el hub (React lo envuelve en src/world/bridge.ts)
 *   public/bosque/index.html   → el platformer
 *   public/estrellas/index.html→ Atrapa las Estrellas
 *
 * ¿Por qué un archivo compartido y no el esquema documentado tres veces?
 * Porque un error de sincronización acá no es un bug de interfaz: es perderle
 * el progreso a una nena. Una sola implementación de leer/escribir/migrar.
 *
 * REGLA DE ORO: nada se borra nunca. Sólo se agrega.
 *
 * DEGRADACIÓN: los juegos también se publican solos en sus propios dominios,
 * donde este archivo NO existe. Todo consumidor tiene que chequear
 * `if (window.NuveWorld)` y, si no está, comportarse exactamente como antes.
 */
(function (global) {
  'use strict';

  var PREFIX = 'nuve_v1_';
  var K_PROFILE = 'profile';
  var K_COLLECTION = 'collection';

  // ── Almacenamiento tolerante ──────────────────────────────────────────────
  // Safari en modo privado tira al escribir. El mundo tiene que seguir
  // funcionando igual, simplemente sin recordar.

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Fecha local YYYY-MM-DD (no UTC: importa el día de la nena). */
  function todayISO(date) {
    var d = date || new Date();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
  }

  function daysBetween(fromISO, toISO) {
    var from = Date.parse(fromISO + 'T00:00:00');
    var to = Date.parse(toISO + 'T00:00:00');
    if (isNaN(from) || isNaN(to)) return 0;
    return Math.max(0, Math.round((to - from) / 86400000));
  }

  // ── Quiénes viven en esta casa ────────────────────────────────────────────
  // El roster vive acá y no en el hub para que los juegos también sepan que
  // "Nina" es `nina` y no una visita nueva llamada Nina. Los dibujos quedan del
  // lado del hub: necesitan pasar por el bundler.

  var PLAYERS = [
    { id: 'nina', name: 'Nina', emoji: '☀️', color: '#FFD600' },
    { id: 'jazmin', name: 'Jazmín', emoji: '🩵', color: '#26C6DA' },
    { id: 'natan', name: 'Natan', emoji: '🦸', color: '#1565C0' },
  ];

  var GUEST_PREFIX = 'guest-';
  var GUEST_EMOJI = '🌟';
  var GUEST_COLOR = '#B39DDB';
  var MAX_GUESTS_SHOWN = 3;
  var MAX_NAME = 14;

  /** "María José" → "maria-jose". Sin acentos ni símbolos: es una clave. */
  function slugify(name) {
    return String(name)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function cleanName(raw) {
    return String(raw || '').trim().replace(/\s+/g, ' ').slice(0, MAX_NAME);
  }

  function emptyProfile() {
    return { current: null, players: {} };
  }

  function fixedPlayer(id) {
    for (var i = 0; i < PLAYERS.length; i++) if (PLAYERS[i].id === id) return PLAYERS[i];
    return null;
  }

  /** Los de la casa salen del roster; las visitas, de su propio registro. */
  function resolvePlayer(id, store) {
    if (!id) return null;
    var fixed = fixedPlayer(id);
    if (fixed) return fixed;
    var rec = store.players[id];
    return rec && rec.name
      ? { id: id, name: rec.name, emoji: GUEST_EMOJI, color: GUEST_COLOR }
      : null;
  }

  // ── Perfil ────────────────────────────────────────────────────────────────

  /** Quién está jugando ahora, o null. */
  function currentPlayer() {
    var store = read(K_PROFILE, emptyProfile());
    return resolvePlayer(store.current, store);
  }

  function currentPlayerId() {
    var p = currentPlayer();
    return p ? p.id : null;
  }

  /**
   * Cómo saludar. PURO: sólo lee. Tiene que correr ANTES de `arrive`, porque
   * al anotar la visita de hoy se pierde cuál fue la anterior.
   */
  function arrivalFor(id) {
    var store = read(K_PROFILE, emptyProfile());
    var player = resolvePlayer(id, store);
    if (!player) return null;
    var rec = store.players[id];
    return {
      player: player,
      // Se mira `lastVisit` y no el registro entero: al anotar el nombre de una
      // visita nueva ya hay registro, pero todavía no entró nunca.
      isFirstEver: !(rec && rec.lastVisit),
      daysAway: rec && rec.lastVisit ? daysBetween(rec.lastVisit, todayISO()) : 0,
    };
  }

  var countedThisSession = {};

  /**
   * Deja anotado quién está jugando. La visita se cuenta una sola vez por
   * sesión, pero `current` se actualiza siempre.
   */
  function arrive(id) {
    var store = read(K_PROFILE, emptyProfile());
    var rec = store.players[id] || {};
    var already = countedThisSession[id];
    countedThisSession[id] = true;

    var players = store.players;
    if (!already) {
      var today = todayISO();
      players = Object.assign({}, store.players);
      players[id] = Object.assign({}, rec, {
        firstVisit: rec.firstVisit || today,
        lastVisit: today,
        lastSeen: Date.now(),
        visits: (rec.visits || 0) + 1,
      });
    }
    write(K_PROFILE, { current: id, players: players });
  }

  /**
   * Elegir a alguien y anotar la visita. Devuelve cómo saludarlo (calculado
   * ANTES de anotar, si no daría siempre "entró hoy"), o null si no existe.
   */
  function setCurrentPlayer(id) {
    var arrival = arrivalFor(id);
    if (!arrival) return null;
    arrive(id);
    return arrival;
  }

  /**
   * Entrar escribiendo un nombre. Devuelve el saludo, o null si lo escrito no
   * da un nombre usable. Escribir "Nina" entra como Nina: no duplica.
   *
   * Es lo que permite que un chico entre por CUALQUIER puerta —el hub, el
   * bosque o las estrellas— y el mundo entero lo reconozca.
   */
  function enterByName(rawName) {
    var name = cleanName(rawName);
    var slug = slugify(name);
    if (!slug) return null;

    for (var i = 0; i < PLAYERS.length; i++) {
      if (PLAYERS[i].name.toLowerCase() === name.toLowerCase()) {
        return setCurrentPlayer(PLAYERS[i].id);
      }
    }

    // Se anota el nombre sin contar la visita: `arrivalFor` distingue "tiene
    // nombre" de "ya entró alguna vez" mirando `lastVisit`.
    var id = GUEST_PREFIX + slug;
    var store = read(K_PROFILE, emptyProfile());
    var players = Object.assign({}, store.players);
    players[id] = Object.assign({}, players[id], { name: name });
    write(K_PROFILE, { current: store.current, players: players });

    return setCurrentPlayer(id);
  }

  /** Volver al selector: nadie está jugando. */
  function clearCurrentPlayer() {
    var store = read(K_PROFILE, emptyProfile());
    write(K_PROFILE, { current: null, players: store.players });
  }

  /** Visitas anteriores, de la más reciente a la más vieja. */
  function knownGuests() {
    var store = read(K_PROFILE, emptyProfile());
    return Object.keys(store.players)
      .filter(function (id) {
        return id.indexOf(GUEST_PREFIX) === 0 && store.players[id].name;
      })
      .sort(function (a, b) {
        return (store.players[b].lastSeen || 0) - (store.players[a].lastSeen || 0);
      })
      .slice(0, MAX_GUESTS_SHOWN)
      .map(function (id) {
        return { id: id, name: store.players[id].name, emoji: GUEST_EMOJI, color: GUEST_COLOR };
      });
  }

  // ── Colección: lo que cada jugador logró en cada juego ─────────────────────
  //
  // Forma:  { <playerId>: { wishes, games: { <gameId>: { ...libre } } } }
  //
  // `games[gameId]` es una bolsa libre a propósito: cada juego sabe qué
  // necesita guardar (récord, nivel desbloqueado, estrellas por nivel) y no
  // hace falta que este archivo lo sepa.

  function collectionOf(playerId) {
    var all = read(K_COLLECTION, {});
    return all[playerId] || { wishes: 0 };
  }

  /**
   * Deseos: las estrellas fugaces atrapadas en el Home. Viven en la raíz del
   * jugador y no dentro de `games` porque ya estaban ahí antes de que existiera
   * este archivo, y mover datos guardados es perderlos.
   */
  function wishes(playerId) {
    var id = playerId || currentPlayerId();
    return id ? collectionOf(id).wishes || 0 : 0;
  }

  function addWish(playerId) {
    var id = playerId || currentPlayerId();
    if (!id) return 0;
    var all = read(K_COLLECTION, {});
    var player = all[id] || { wishes: 0 };
    var next = (player.wishes || 0) + 1;
    all[id] = Object.assign({}, player, { wishes: next, lastWish: todayISO() });
    write(K_COLLECTION, all);
    return next;
  }

  /** Lo que este jugador tiene guardado de un juego. Nunca null. */
  function gameState(gameId, playerId) {
    var id = playerId || currentPlayerId();
    if (!id) return {};
    var games = collectionOf(id).games || {};
    return games[gameId] || {};
  }

  /** Mezcla `patch` en lo guardado. Sin jugador elegido, no guarda nada. */
  function patchGameState(gameId, patch, playerId) {
    var id = playerId || currentPlayerId();
    if (!id) return false;

    var all = read(K_COLLECTION, {});
    var player = all[id] || { wishes: 0 };
    var games = Object.assign({}, player.games);
    games[gameId] = Object.assign({}, games[gameId], patch);

    all[id] = Object.assign({}, player, { games: games });
    return write(K_COLLECTION, all);
  }

  /**
   * Guarda un récord si supera al anterior. `better` es 'lower' o 'higher'.
   * Devuelve true si fue récord nuevo.
   */
  function recordBest(gameId, field, value, better, playerId) {
    var id = playerId || currentPlayerId();
    if (!id) return false;

    var previous = gameState(gameId, id)[field];
    var isRecord =
      previous === undefined ||
      previous === null ||
      (better === 'lower' ? value < previous : value > previous);

    if (isRecord) {
      var patch = {};
      patch[field] = value;
      patchGameState(gameId, patch, id);
    }
    return isRecord;
  }

  // ── El diario: lo que pasó, para que el mundo pueda enterarse ─────────────
  //
  // Cada juego anota lo que hace. El hub lo lee y reacciona: Lunaria comenta lo
  // último, la pantalla de Juegos muestra por dónde vas.
  //
  // Se guarda un tope de entradas por jugador: es un diario, no un historial
  // forense, y el localStorage es finito.

  var K_DIARY = 'diary';
  var DIARY_MAX = 30;

  /**
   * Anota algo que pasó. `data` es libre por juego (puntaje, nivel, estrellas).
   * Sin jugador elegido no se anota nada: no sabríamos de quién es.
   */
  function note(game, type, data) {
    var id = currentPlayerId();
    if (!id) return false;

    var all = read(K_DIARY, {});
    var entries = (all[id] || []).slice();

    entries.unshift(
      Object.assign({ game: game, type: type, at: Date.now(), day: todayISO() }, data || {}),
    );

    all[id] = entries.slice(0, DIARY_MAX);
    return write(K_DIARY, all);
  }

  /** Las últimas entradas, de la más nueva a la más vieja. */
  function diary(playerId, limit) {
    var id = playerId || currentPlayerId();
    if (!id) return [];
    var entries = read(K_DIARY, {})[id] || [];
    return limit ? entries.slice(0, limit) : entries;
  }

  /** Lo último que hizo. Es lo que le permite al mundo decir "vi lo que hiciste". */
  function lastNote(playerId) {
    return diary(playerId, 1)[0] || null;
  }

  // ── Lo que ya existía antes de todo esto ──────────────────────────────────
  //
  // `nuve_best`, `nuvecielas_unlocked` y `nuvecielas_stars_N` son de "quien
  // haya jugado": se escribieron cuando los juegos no sabían quién estaba del
  // otro lado. NO se borran ni se reparten.
  //
  // Política (ver docs/PLAN_RECORRIDO.md):
  //   · Progreso de niveles → se hereda como PISO. Nadie queda encerrado fuera
  //     de un nivel al que ya podía entrar; de ahí en más cada uno avanza solo.
  //   · Récords → NO se heredan. Cada jugador arranca su propia marca para
  //     tener algo propio que superar.

  function legacyInt(key) {
    try {
      var v = parseInt(localStorage.getItem(key) || '0', 10);
      return isNaN(v) ? 0 : v;
    } catch (e) {
      return 0;
    }
  }

  var legacy = {
    unlocked: function () {
      return legacyInt('nuvecielas_unlocked');
    },
    starsForLevel: function (idx) {
      return legacyInt('nuvecielas_stars_' + idx);
    },
    bestScore: function () {
      return legacyInt('nuve_best');
    },
  };

  // ── API pública ───────────────────────────────────────────────────────────

  global.NuveWorld = {
    version: 1,

    PLAYERS: PLAYERS,
    GUEST_PREFIX: GUEST_PREFIX,

    currentPlayer: currentPlayer,
    currentPlayerId: currentPlayerId,
    arrivalFor: arrivalFor,
    setCurrentPlayer: setCurrentPlayer,
    enterByName: enterByName,
    clearCurrentPlayer: clearCurrentPlayer,
    knownGuests: knownGuests,

    gameState: gameState,
    patchGameState: patchGameState,
    recordBest: recordBest,
    wishes: wishes,
    addWish: addWish,

    note: note,
    diary: diary,
    lastNote: lastNote,

    legacy: legacy,

    // Utilidades que los tres necesitan y no vale la pena duplicar
    slugify: slugify,
    cleanName: cleanName,
    todayISO: todayISO,
    daysBetween: daysBetween,
  };
})(window);
