String.prototype.clr = function(p1) {
	return `<font color='#${p1}'>${this}</font>`;
};

const path = require('path'),
	fs = require('fs');

module.exports = function Lancer(mod) {
	const _m = {
		h: [],
		b: [],
		x: []
	};

	try {
		_m.c = require('./config.json');
	}
	catch (event) {
		_m.c = {
			enable: true,
			debug: false,
			bg: false,
			bg_description: 'Enable/disable usage in bgs.',
			time: 800,
			time_description: 'The amount of time you are invincible in ms.',
			effect: 2060,
			effect_description: 'Effect id to apply while invincible.'
		};
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), () => {
			mod.log(`Generated a new config.json.`);
		});
	}

	mod.hook('S_LOGIN', 12, ({ templateId }) => {
		if ([1].includes((templateId - 10101) % 100)) {
			load();
		}
	});

	mod.game.on('leave_game', () => {
		unload();
	});

	mod.command.add(['lancer'], (p1, p2) => {
		switch (p1 ? p1 = p1.toLowerCase() : p1) {
			case undefined:
				if ((_m.c.enable = !_m.c.enable) === true) {
					load();
				}
				else {
					unload();
				}
				return mod.command.message(`Module ${_m.c.enable ? 'enabled'.clr('15FF02') : 'disabled'.clr('FF0202')}.`);
			case 'on':
				if (_m.c.enable) {
					return mod.command.message(`Module is already enabled.`.clr('FF0202'));
				}
				load();
				return mod.command.message(`Module ${(_m.c.enable = !_m.c.enable) === true ? 'enabled.'.clr('15FF02') : ''}`);
			case 'off':
				if (!_m.c.enable) {
					return mod.command.message(`Module is already disabled.`.clr('FF0202'));
				}
				unload();
				return mod.command.message(`Module ${(_m.c.enable = !_m.c.enable) === false ? 'disabled.'.clr('FF0202') : ''}`);
			case 'debug':
				return mod.command.message(`Module debugging ${(_m.c.debug = !_m.c.debug) === true ? 'enabled.'.clr('15FF02') : 'disabled.'.clr('FF0202')}`);
			case 'bg':
			case 'battleground':
			case 'b':
				return mod.command.message(`Module ${(_m.c.bg = !_m.c.bg) === true ? 'enabled'.clr('15FF02') : 'disabled'.clr('FF0202')} in battlegrounds.`);
			default:
				if (!p2) {
					return mod.command.message(`No parameter given.`.clr('FF0202'));
				}
				else if (isNaN(p2)) {
					return mod.command.message(`${p2} is an invalid parameter.`.clr('FF0202'));
				}
				switch (p1) {
					case 'time':
					case 't':
						_m.c.time = parseInt(p2);
						if (_m.c.time < 200) {
							mod.command.message(`Time out of bounds, defaulted to ${_m.c.time = 800}.`.clr('FF0202'));
						}
						else {
							mod.command.message(`Time set to ${_m.c.time}ms.`);
						}
						break;
					case 'effect':
					case 'e':
						_m.c.effect = parseInt(p2);
						if (_m.c.effect < 0) {
							mod.command.message(`Effect out of bounds, defaulted to ${_m.c.effect = 2060}.`.clr('FF0202'));
						}
						else {
							mod.command.message(`Effect set to ${_m.c.effect}.`);
						}
						break;
					default:
						return mod.command.message(`${p1} is an invalid parameter.`.clr('FF0202'));
				}
		}
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), () => {
			mod.log(`Saved changes to config.json.`);
		});
	});

	function load() {
		function hook() {
			_m.h.push(mod.hook(...arguments));
		}

		hook('C_PRESS_SKILL', 4, ({ skill }) => {
			if (_m.z) {
				Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

				mod.send('S_CANNOT_START_SKILL', 4, { skill });
				return false;
			}
		});

		hook('C_START_SKILL', 7, { order: -100 }, ({ skill, w, loc }) => {
			if (_m.z) {
				if ([260100].includes(skill.id)) {
					clearTimeout(_m.t);

					mod.send('C_PLAYER_LOCATION', 5, Object.assign(_m.p, { loc: _m.z, w: _m.w, type: 7 }));
					mod.send('S_ABNORMALITY_END', 1, { target: mod.game.me.gameId, id: _m.c.effect });

					return (_m.z = _m.w = 0) === 0;
				}
				Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

				mod.send('S_CANNOT_START_SKILL', 4, { skill });
				return false;
			}

			if (![260100].includes(skill.id)) return;

			_m.z = Object.assign({}, loc);
			_m.w = w;

			_m.t = setTimeout(() => {
				mod.send('S_ABNORMALITY_BEGIN', 3, { target: mod.game.me.gameId, source: mod.game.me.gameId, id: _m.c.effect, duration: 0, unk: 0, stacks: 1, unk2: 0, unk3: 0 });
				mod.toServer('C_PLAYER_LOCATION', 5, Object.assign({}, _m.p, { loc: _m.z, w: _m.w, type: 2 }));

				_m.t = setTimeout(() => {
					mod.toServer('C_PLAYER_LOCATION', 5, Object.assign(_m.p, { loc: _m.z, w: _m.w, type: 7 }));
					mod.send('S_ABNORMALITY_END', 1, { target: mod.game.me.gameId, id: _m.c.effect });

					setTimeout(() => {
						_m.z = _m.w = 0;
					}, 5);
				}, _m.c.time + 5);
			}, 5);

			Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

			mod.send('S_CANNOT_START_SKILL', 4, { skill });
			return false;
		});

		hook('C_START_TARGETED_SKILL', 6, { order: -100 }, ({ skill, targets }) => {
			if (_m.z) {
				Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

				mod.send('S_CANNOT_START_SKILL', 4, { skill });
				return false;
			}

			if (![90300, 230200].includes(skill.id)) return;		//* Leash, Master's Leash

			switch (skill.id) {
				case 90300:
					if (!targets[0].id) {
						Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

						mod.send('S_CANNOT_START_SKILL', 4, { skill });
						return false;
					}
					break;
				case 230200:
					if (!targets[0].id) {
						Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

						mod.send('S_CANNOT_START_SKILL', 4, { skill });
						return false;
					}
			}
		});

		hook('C_START_INSTANCE_SKILL', 5, { order: -100 }, ({ skill, targets, loc, w }) => {
			if (_m.z) {
				Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

				mod.send('S_CANNOT_START_SKILL', 4, { skill });
				return false;
			}

			if (![240101].includes(skill.id)) return;	//* Chained Leash

			if (!targets[0]) {
				Object.assign(skill, { type: 0, npc: false, huntingZoneId: 0, reserved: 0 });

				mod.send('S_CANNOT_START_SKILL', 4, { skill });
				return false;
			}
		});

		hook('S_USER_EFFECT', 1, { order: 300, filter: { fake: null } }, ({ target, source, circle, operation }) => {
			if (!mod.game.me.is(target)) return;

			if (circle === 2) {
				if (operation === 2) {
					setTimeout(() => {
						if (!_m.b.some(e => e.gameId === source)) return;

						mod.send('S_DUNGEON_EVENT_MESSAGE', 2, { message: `<font size="35">&nbsp;Lost agro...</font>`, type: 42, channel: 0, chat: 0 });
					}, 100);
				}
				else {
					_m.b.push({ gameId: source });

					let h = mod.hook('S_DESPAWN_NPC', 3, { order: 300, filter: { fake: null } }, ({ gameId }) => {
						for (let i in _m.b) {
							if (_m.b[i].gameId === gameId) {
								_m.b.splice(i, 1);

								if (!_m.b.length) {
									mod.unhook(h);
								}
							}
						}
					});
				}
			}
		});

		hook('S_DEFEND_SUCCESS', 3, ({ gameId, perfect }) => {
			return mod.game.me.is(gameId) && !perfect ? (perfect = true, true) : null;
		});
	}

	mod.hook('C_PLAYER_LOCATION', 5, (event) => {
		_m.p = event;
	});

	function unload() {
		if (_m.h.length) {
			for (let i of _m.h) {
				mod.unhook(i);
			}
			_m.h.length = 0;
		}
	}

	this.destructor = () => {
		mod.command.remove(['lancer']);
	};
};