String.prototype.clr = function(c) { return `<font color='#${c}'>${this}</font>`; };

const fs = require('fs'),
	path = require('path'),
	Vec3 = require('tera-vec3');

module.exports = function Hunt(mod) {
	const _m = {
		a: [5250, 60486, 60487, 60488, 60489, 60490, 81186, 100701, 100705, 100719, 100721, 139112, 139162, 139187, 139696, 139737, 149035, 149296, 149307, 149336, 149489, 166598, 166599, 166600, 166601, 166602, 166603, 166687, 166688, 166689, 166690, 166691, 166692, 170002, 177339, 181116, 186786, 200528, 201024, 210536, 212782, 213302, 213396, 216000, 220219, 220358, 221635, 222674, 854563, 854564, 854565, 854566, 854567, 854568],
		m: { '2': 1, '3': 1, '5': 3, '13': 8, '7001': 7, '7002': 3, '7003': 5, '7004': 4, '7005': 10, '7011': 7, '7012': 5, '7013': 1, '7014': 5, '7015': 7, '7021': 3, '7022': 3, '7023': 4, '7031': 3, '8001': 1 },
		l: {
			'1': [
				{
					'sectionId': 80001,
					'name': 'Betsael',
					'huntingZoneId': [57, 3932257, 13107257],
					'templateId': 33
				},
				new Vec3(-54610.01953125, 41647.359375, 2784),
				new Vec3(-50932.4921875, 50468.1796875, 3761),
				new Vec3(-60326.20703125, 54388.3671875, 3859),
				new Vec3(-71134.03125, 49143.20703125, 3950),
				new Vec3(-71826.15625, 56373.41796875, 3957)
			],
			'2': [
				{
					'sectionId': 61001,
					'name': 'Reaver',
					'huntingZoneId': [10, 6553610, 13107210],
					'templateId': 99
				},
				new Vec3(78914.28125, 88163.5, 942),
				new Vec3(79220.359375, 91821.96875, 1012),
				new Vec3(73008.171875, 92356.703125, 1117),
				new Vec3(74242.28125, 96907.4375, 859)
			],
			'3': [
				{
					'sectionId': 79001,
					'name': 'Linyphi',
					'huntingZoneId': [51, 6553651, 13107251],
					'templateId': 7011
				},
				new Vec3(3405.49169921875, 51545.203125, 6417),	// mobs on spawn
				new Vec3(676.2628784179688, 49109.95703125, 6567),
				new Vec3(4957.32763671875, 47758.96484375, 6587),	// mobs on spawn
				new Vec3(10871.0927734375, 46168.94140625, 7405),
				new Vec3(10367.078125, 53741.7109375, 7390),
				new Vec3(9780.38671875, 61433.25, 7749.68017578125),	// No clear spot, had to take high ground.
				new Vec3(9916.609375, 63925.98828125, 7353)
			],
			'4': [
				{
					'sectionId': 61001,
					'name': 'Kanash',
					'huntingZoneId': [4, 6553604, 13107204],
					'templateId': 5011
				},
				new Vec3(105087.6875, 64952.375, 2801),	// mobs on spawn
				new Vec3(104744.1171875, 67596.453125, 2620),	// mobs on spawn
				new Vec3(111691.65625, 68841.828125, 3142),
				new Vec3(116075.1875, 63897.9375, 3109),
				new Vec3(116489.0234375, 69580.296875, 3839),
				new Vec3(117999.25, 84112.9609375, 6147),
				new Vec3(117368.1484375, 88864.5234375, 6285),
				new Vec3(111797.6171875, 90658.875, 6436),
				new Vec3(112682.5703125, 81895.46875, 5945)	// mobs on spawn
			],
			'5': [
				{
					'sectionId': 79001,
					'name': 'Yunaras',
					'huntingZoneId': [52, 6553652, 13107252],
					'templateId': 9050
				},
				new Vec3(-3020.85693359375, 31313.728515625, 5063),	// mobs on spawn
				new Vec3(-3773.42041015625, 47593.921875, 4831),
				new Vec3(4024.450927734375, 58461.18359375, 6030),
				new Vec3(244.1110076904297, 69767.65625, 6650)
			],
			'6': [
				{
					'sectionId': 74001,
					'name': 'Nyxarras',
					'huntingZoneId': [38, 6553638, 13107238],
					'templateId': 35
				},
				new Vec3(-88737.0234375, -12339.9501953125, 620),
				new Vec3(-95430.890625, -7880.12353515625, 513),
				new Vec3(-83684.21875, -1504.6448974609375, 1088)
			]
		},
		h: [],
		t: [],
		b: []
	};

	try {
		_m.c = require('./config.json');
	}
	catch (event) {
		_m.c = {
			enabled: true,
			debug: false
		};
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), (e) => {
			mod.log(`Generated config.json`);
		});
	}

	mod.command.add('t', (a) => {
		switch (a ? a.toLowerCase() : a) {
			case undefined:
				_m.sPcbanginventoryDatalist.slot = -1;
				break;
			case '1':
				msg(`${_m.m[mod.game.me.zone]}`, 'n');
				break;
			case '2':
				msg(`${_m.m[2]}`, 'n');
				break;
			default:
		}
		msg(`Notice me senpai!`, 'n');
	});

	mod.game.on('enter_game', () => {
		if (_m.c.enabled) {
			load();
		}
	});

	mod.game.on('leave_game', () => {
		unload();
	});

	mod.game.me.on('change_zone', () => {
		_m.b.length = 0;
	});

	mod.command.add(['c', 'ch', 'channel', 'ㅊ'], (a) => {
		let c = _m.sCurrentChannel.channel,
			m = _m.m[mod.game.me.zone],
			t = null;

		if (mod.game.me.inBattleground || mod.game.me.inCombat || m === 1 || _m.sCurrentChannel.type !== 1 || c > 10) {
			mod.command.message(`${mod.game.me.inBattleground ? 'You are in a battleground' : mod.game.me.inCombat ? 'You are in combat' : c > 10 ? 'You are in an instance' : m === 1 ? 'There is only one channel' : t !== 1 ? 'You are restricted from switching channels' : ''}.`.clr('FF0000'));
		}
		else {
			switch (a ? a.toLowerCase() : a) {
				case undefined:
				case 'n':
				case 'next':
					t = c === m ? 1 : c + 1;
					break;
				case 'b':
				case 'back':
					t = c === 1 ? m : c - 1;
					break;
				default:
					if (isNaN(a) || (a < 1 && m !== 10) || (a > m) || a === c.toString()) {
						mod.command.message(`${isNaN(a) || (a < 1 && m !== 10) ? a + ' is an invalid parameter' : a > m ? a + ' exceeds the maximum number of channels (' + m + ')' : a === c.toString() ? 'You are already on this channel' : ''}.`.clr('FF0000'));
					}
					else {
						t = a === 0 ? 10 : a;
					}
			}
			if (t) {
				mod.send('C_SELECT_CHANNEL', 1, { unk: 1, zone: mod.game.me.zone, channel: t - 1 });

				mod.command.message(`Switching to channel` + ` ${t}`.clr(t === m ? 'FFD700' : '00FF33') + ` of` + ` ${m}`.clr('FFD700') + `.`);
			}
		}
	});

	mod.command.add(['hunt', 'h'], (a, m) => {
		if (_m.sPcbanginventoryDatalist.slot === -1) {
			msg(`You must have a Village Atlas to use this module!`.clr('FF0202'));
			unload(1);
		}
		else {
			switch (a ? a.toLowerCase() : a) {
				case undefined:
					if ((_m.c.enable = !_m.c.enable) === true) {
						load();
					}
					else {
						unload();
					}
					return mod.command.message(`Module ${_m.c.enable ? 'enabled'.clr('15FF02') : 'disabled'.clr('FF0202')}.`);
				case 'on':
					if (_m.c.enabled) {
						return msg(`Module is already enabled.`.clr('FF0202'));
					}
					load();
					return msg(`Module` + ` ${(_m.c.enabled = !_m.c.enabled) === true ? 'enabled.'.clr('15FF02') : ''}`);
				case 'off':
					if (!_m.c.enabled) {
						return msg(`Module is already disabled.`.clr('FF0202'));
					}
					unload();
					return msg(`Module` + ` ${(_m.c.enabled = !_m.c.enabled) === false ? 'disabled.'.clr('FF0202') : ''}`);
				case 'd':
				case 'debug':
					msg(`Module debugging` + ` ${(_m.c.debug = !_m.c.debug) === true ? 'enabled.'.clr('15FF02') : 'disabled.'.clr('FF0202')}`);
					break;
				default:
					if (_m.c.enabled) {
						let a1 = !isNaN(a) ? a.substr(0, 1) : _m.t[1] ? _m.t[1].substr(0, 1) : '1',
							a2 = !isNaN(a) ? a.length > 1 ? a.substr(1, 1) : '1' : _m.t[1] ? _m.t[1].substr(1, 1) : '1',
							a3 = { '1': 5, '2': 4, '3': 7, '4': 9, '5': 4, '6': 3 };

						_m.t[2] = _m.t[1] || null;

						switch (a) {
							case 'n':
							case 'next':
								_m.t[1] = _m.t[0] = _m.t[1] && !(a1 === '6' && a2 === '3') ? a2 < a3[a1] ? a1 + ++a2 : ++a1 + '1' : '11';
								_m.t[9] = 'next';
								if (_m.c.debug) {
									mod.log(`Next: ${_m.t[0]}.`);
								}
								break;
							case 'b':
							case 'back':
								_m.t[1] = _m.t[0] = _m.t[1] && !(a1 === '1' && a2 === '1') ? a2 > 1 ? a1 + --a2 : (--a1).toString() + a3[a1] : '63';	// --a1 needs to be converted to string or else it adds the value of a3[a1]. Not sure why this happens here and not with 'n', 'next'.
								_m.t[9] = 'back';
								if (_m.c.debug) {
									mod.log(`Back: ${_m.t[0]}.`);
								}
								break;
							case 'r':
							case 'random':
								_m.t[1] = _m.t[0] = (a1 = Math.floor(Math.random() * 6 + 1)).toString() + Math.floor(Math.random() * a3[a1] + 1);
								_m.t[9] = 'random';
								if (_m.c.debug) {
									mod.log(`Random: ${_m.t[0]}.`);
								}
								break;
							case 'a':
							case 'auto':
								_m.t[1] = _m.t[0] = _m.t[1] ? a1 === '6' && a2 === '3' ? '11' : a2 < a3[a1] ? a1 + ++a2 : ++a1 + '1' : (a1 = Math.floor(Math.random() * 6 + 1)).toString() + Math.floor(Math.random() * a3[a1] + 1);
								_m.t[9] = 'auto';
								if (_m.c.debug) {
									mod.log(`Auto: ${_m.t[0]}.`);
								}
								break;
							default:
								if (isNaN(a) || !a3[a1] || a2 < 1 || a2 > a3[a1] || a.length > 2) {
									if (_m.c.debug) {
										mod.log(`Failed because ${(isNaN(a) ? 'isNaN(a)' : a3[a1] ? a.length > 2 ? 'a.length > 2' : a.length === 2 && (a2 < 1 || a2 > a3[a1]) ? a2 < 1 ? 'a2 < 1' : 'a2 > a3[a1]' : 'null' : '!a3[a1]')}`);
									}
									return msg(`${a} is an invalid parameter.`.clr('FF0202'));
								}
								_m.t[1] = _m.t[0] = a1 + a2;
								_m.t[9] = 'manual';
						}
					}
					else {
						msg(`Enable the module to use this feature.`.clr('021DFF'));
					}
			}
			if (_m.t[0]) {	// Need a better way to compare location. Player may move.
				// if (_m.c.debug) mod.log(`Compare: ${_m.cPlayerLocation.loc} and ${_m.l[_m.t[0].substr(0, 1)][_m.t[0].substr(1, 1)]}`);
				// if (_m.cPlayerLocation.loc === _m.l[_m.t[0].substr(0, 1)][_m.t[0].substr(1, 1)]) {
				/// /if (a === 'r' || a === 'random')
				/// /	_m.t[0] = (a1 = Math.floor(Math.random() * 6 + 1)).toString() + Math.floor(Math.random() * a3[a1] + 1);
				/// /else {
				// msg(`You're already at this location!`.clr('FF0202'));
				// reset();
				// return;
				/// /}
				// }
				mod.send('C_PCBANGINVENTORY_USE_SLOT', 1, { slot: _m.sPcbanginventoryDatalist.slot });
				if (_m.c.debug) {
					mod.log(`																		\n` +
							`Section ID		: ${_m.l[_m.t[0].substr(0, 1)][0].sectionId},			\n` +
							`Vec3			: ${_m.l[_m.t[0].substr(0, 1)][_m.t[0].substr(1, 1)]}		`
					);
				}
			}
		}
	});

	mod.hook('S_CURRENT_CHANNEL', 2, ({ channel, type }) => { _m.sCurrentChannel = { channel: channel, type: type }; });

	function load() {
		function hook() { _m.h.push(mod.hook(...arguments)); }

		function auto() {
			_m.timer = setTimeout(() => {
				let	a0,
					a1 = _m.t[1].substr(0, 1),
					a2 = _m.t[1].substr(1, 1),
					a3 = { '1': 5, '2': 4, '3': 7, '4': 9, '5': 4, '6': 3 };

				if ((a0 = _m.sCurrentChannel.channel !== _m.m[mod.game.me.zone] ? _m.sCurrentChannel.channel + 1 : null) !== null) {
					mod.send('C_SELECT_CHANNEL', 1, { unk: 1, zone: mod.game.me.zone, channel: a0 - 1 });
					if (_m.c.debug) {
						mod.log(`Auto: switching to channel ${a0} of ${_m.m[mod.game.me.zone]}.`);
					}
				}
				else {
					_m.t[1] = _m.t[0] = !(a1 === '6' && a2 === '3') ? a2 < a3[a1] ? a1 + ++a2 : ++a1 + '1' : '11';

					mod.send('C_PCBANGINVENTORY_USE_SLOT', 1, { slot: _m.sPcbanginventoryDatalist.slot });
					if (_m.c.debug) {
						mod.log(`Auto: ${_m.t[0]}.`);
					}
				}
			}, 10000);
		}

		hook('S_PCBANGINVENTORY_DATALIST', 1, ({ inventory }) => {
			_m.sPcbanginventoryDatalist = _m.sPcbanginventoryDatalist || { slot: -1 };

			if (_m.sPcbanginventoryDatalist.slot === -1) {
				for (const { item, slot } of inventory) {
					if (_m.a.includes(item)) {
						if (_m.c.debug) {
							mod.log(`_m.sPcbanginventoryDatalist.slot = ${slot}`);
						}
						return void (_m.sPcbanginventoryDatalist.slot = slot);
					}
				}
				return void (_m.sPcbanginventoryDatalist.slot = -1);
			}
		});

		hook('S_VILLAGE_LIST_TO_TELEPORT', 1, () => {
			if (_m.t[0]) {
				mod.send('C_TELEPORT_TO_VILLAGE', 1, { id: _m.l[_m.t[0].substr(0, 1)][0].sectionId });
				return false;
			}
		});

		hook('S_ACTION_END', 5, ({ gameId, type }) => {
			if (!mod.game.me.is(gameId) || type === 37) return;		// 37 = Interrupted by loading.

			_m.t[1] = _m.t[2];
			_m.t[0] = null;

			if (_m.t[9] === 'auto') {
				clearTimeout(_m.timer);
				msg(`You have been interupted.`);
			}
		});

		hook('S_PREPARE_SELECT_CHANNEL', 1, () => {
			_m.s = true;
		});

		hook('S_CANCEL_SELECT_CHANNEL', 1, () => {
			_m.s = false;

			if (_m.t[9] === 'auto') {
				clearTimeout(_m.timer);
				msg(`You have been interupted.`);
			}
		});

		hook('S_LOAD_TOPO', 3, { order: 100 }, (event) => {
			if (_m.s) {
				return (event.quick = true);
			}
			_m.s = false;
		});

		hook('S_SPAWN_ME', 3, { order: 100 }, (event) => {
			_m.sSpawnMe = event;

			if (_m.s) {
				_m.s = false;

				mod.send('S_SPAWN_ME', 3, event);
				mod.send('C_PLAYER_LOCATION', 5, { loc: event.loc, w: event.w, lookDirection: 0, dest: event.loc, type: 7, jumpDistance: 0, inShuttle: 0, time: 0 });
			}

			if (_m.t[9] === 'auto') {
				auto();
			}

			return _m.t[0] ? (Object.assign(event.loc, _m.l[_m.t[0].substr(0, 1)][_m.t[0].substr(1, 1)]), mod.send('C_PLAYER_LOCATION', 5, { loc: event.loc, w: event.w, lookDirection: 0, dest: event.loc, type: 7, jumpDistance: 0, inShuttle: 0, time: 0 }), true) : null;
		});

		hook('C_PLAYER_LOCATION', 5, (event) => {
			_m.t[0] = null;

			if (_m.sSpawnMe) {
				if (event.loc.z !== _m.sSpawnMe.loc.z) {
					mod.send('S_INSTANT_MOVE', 3, { gameId: mod.game.me.gameId, loc: _m.sSpawnMe.loc, w: _m.sSpawnMe.w });

					delete _m.sSpawnMe;
					return false;
				}
				delete _m.sSpawnMe;
			}
		});

		hook('S_CURRENT_CHANNEL', 2, ({ channel, type }) => {
			_m.sCurrentChannel = { channel: channel, type: type };
			if (_m.c.debug) {
				// mod.log(`Current channel is ${channel} of ${channels[mod.game.me.zone]} and type is ${type}`);
			}
		});

		hook('S_SPAWN_NPC', 10, (event) => {
			if ([2, 4].includes(event.status) || event.villager) return;

			Object.values(_m.l).forEach(v => {
				if (v[0].huntingZoneId.includes(event.huntingZoneId) && v[0].templateId === event.templateId) {
					_m.b.push(event.gameId);
					mod.send('S_SPAWN_DROPITEM', 6, { gameId: event.gameId * 10, loc: event.loc, item: 98260, amount: 1, expiry: 600000, explode: false, masterwork: false, enchant: 0, source: 0, debug: false, owners: [{ id: 0 }] });

					clearTimeout(_m.timer);

					msg(`${_m.name = v[0].name} found!`, 'n');
				}
			});
		});

		hook('S_DESPAWN_NPC', 3, { order: -100 }, (event) => {
			if (_m.b.includes(event.gameId)) {
				if (event.type === 5) {
					msg(`${_m.name} is dead!`, 'n');
				}
				else if (event.type === 1) {
					msg(`${_m.name} is out of range...!`, 'n');
				}
				_m.b.splice(_m.b.indexOf(event.gameId), 1);
				mod.send('S_DESPAWN_DROPITEM', 4, { gameId: event.gameId * 10 });
			}
		});
	}

	function unload(event) {
		if (event) {
			mod.command.remove('hunt', 'h');
		}
		if (_m.h.length) {
			for (let i of _m.h) {
				mod.unhook(i);
			}
			_m.h.length = 0;
		}
		_m.t[0] = null;
	}

	function msg(event, type = null) {
		mod.command.message(event);
		if (type) {
			mod.send('S_DUNGEON_EVENT_MESSAGE', 2, { type: 42, chat: false, channel: 0, message: event });	// 31 = Normal Text, 42 = Blue Shiny Text
		}
	}

	this.destructor = () => {
		mod.command.remove(['hunt', 'h']);
	};
};