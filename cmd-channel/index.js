String.prototype.clr = function(c) { return `<font color='#${c}'>${this}</font>`; };

module.exports = function CmdChannel(mod) {
	const _m = {
		c: { '2': 1, '3': 1, '5': 3, '13': 8, '7001': 7, '7002': 3, '7003': 5, '7004': 4, '7005': 10, '7011': 7, '7012': 5, '7013': 1, '7014': 5, '7015': 7, '7021': 3, '7022': 3, '7023': 4, '7031': 3, '8001': 1 },
		h: []
	};

	mod.game.on('enter_game', () => {
		if (!mod.manager.isInstalled('quick-load')) {
			load();
		}
	});

	mod.game.on('leave_game', () => {
		unload();
	});

	mod.command.add(['c', 'ch', 'channel', 'ㅊ'], (a) => {
		let c = _m.sCurrentChannel.channel,
			m = _m.c[mod.game.me.zone],
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

				mod.command.message(`Switching to channel` + ` ${t}`.clr(t === m ? 'FFD700' : '00FF33') + ` of` + ` ${m}.`.clr('FFD700') + `.`);
			}
		}
	});

	mod.hook('S_CURRENT_CHANNEL', 2, ({ channel, type }) => {
		_m.sCurrentChannel = { channel, type };
	});

	function load() {
		function hook() {
			_m.h.push(mod.hook(...arguments));
		}

		hook('S_PREPARE_SELECT_CHANNEL', 1, () => {
			_m.s = true;
		});

		hook('S_CANCEL_SELECT_CHANNEL', 1, () => {
			_m.s = false;
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
		});

		hook('C_PLAYER_LOCATION', 5, (event) => {
			if (_m.sSpawnMe) {
				if (event.loc.z !== _m.sSpawnMe.loc.z) {
					mod.send('S_INSTANT_MOVE', 3, { gameId: mod.game.me.gameId, loc: _m.sSpawnMe.loc, w: _m.sSpawnMe.w });

					delete _m.sSpawnMe;
					return false;
				}
				delete _m.sSpawnMe;
			}
		});
	}

	function unload() {
		if (_m.h.length) {
			for (let i of _m.h) {
				mod.unhook(i);
			}
			_m.h.length = 0;
		}
	}

	this.destructor = () => {
		mod.command.remove(['c', 'ch', 'channel', 'ㅊ']);
	};
};