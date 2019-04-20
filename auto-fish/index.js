String.prototype.clr = function(c) { return `<font color='#${c}'>${this}</font>`; };

// const { Readable } = require('tera-data-parser/lib/protocol/stream');

module.exports = function autoFishing(mod) {
	const _m = {
		e: false,
		h: [],
		d: [],
		c: 0,
		i: {
			n: {
				206400: 'Stone Moroko',
				206401: 'Azurecheek Carp',
				206402: 'Crayfish',
				206403: 'Clownfish',
				206404: 'Angelfish',
				206405: 'Black-fin Clownfish',
				206406: 'Squid',
				206407: 'Crucian Carp',
				206408: 'Sea Eel',
				206409: 'Tang Fish',
				206410: 'Freshwater Eel',
				206411: 'Octopus',
				206412: 'Marlin',
				206413: 'Prince Salmon',
				206414: 'Mottled Ray',
				206415: 'Catfish',
				206416: 'Channel Catfish',
				206417: 'Eldritch Carp}',
				// 206418: '???',
				206419: 'Chroma Salmon',
				206420: 'Electric Eel'
			},
			b: {
				206500: 'Giant Blue',
				206501: 'Golden Shark',
				206502: 'Fairy Snakehead',
				206503: 'Golden Sailfish',
				206504: 'Queen Salmon',
				206505: 'Golden Octopus'
			},
			e: 204053,
			t: 204051,
			w: {
				206100: 'Angler' + "'s 'Whiskers I",
				206101: 'Angler' + "'s 'Whiskers II",
				206102: 'Angler' + "'s 'Whiskers III",
				206103: 'Angler' + "'s 'Whiskers IV",
				206104: 'Angler' + "'s 'Whiskers V",
				206105: 'Angler' + "'s 'Whiskers VI"
			},
			h: {
				206600: { name: 'Bait I' },
				206001: { name: 'Bait II', recipe: 204100 },
				206002: { name: 'Bait III', recipe: 204101 },
				206003: { name: 'Bait IV', recipe: 204102 },
				206004: { name: 'Bait V', recipe: 204103 }
			},
			f: 204052
		}
	};

	mod.command.add(['f', 'fish'], (a) => {
		if ((_m.e = !_m.e) === false) {
			unload();
		}
		else {
			_m.s = { n: 0, b: 0, e: 0, t: 0 };

			check();
			load();
		}
		return mod.command.message(`auto-item` + ` ${_m.e ? 'enabled.'.clr('15FF02') : 'disabled.'.clr('FF0202')}`);
	});

	function check() {
		let h = mod.hook('S_INVEN', 16, ({ first, more, size, items }) => {
			_m.sInven = first ? items : _m.sInven.concat(items);

			if (!more) {
				for (let item of _m.sInven) {
					if (item.slot < 40) continue;

					if (_m.i.n.hasOwnProperty(item.id) && !_m.d.some(event => event.dbid === item.dbid)) { _m.d[_m.d.length] = { dbid: item.dbid, id: item.id }; }
					else if (_m.i.w.hasOwnProperty(item.id)) {
						_m.w_slot = item.slot;
						_m.w_name = item.name;

						mod.send('C_EQUIP_ITEM', 2, { gameId: mod.game.me.gameId, slot: _m.w_slot, unk: 0 });
						mod.command.message(`Equipped ${_m.i.w[item.id]}.`);
					}
					else if (_m.i.h.hasOwnProperty(item.id)) {
						if (_m.h_slot) {
							if (item.slot !== _m.h_slot) {
								mod.send('C_MOVE_INVEN_POS', 1, { source: mod.game.me.gameId, from: item.slot, to: _m.h_slot });
							}
						}
						else {
							_m.h_id = item.id;
							_m.h_slot = item.slot;
						}
					}
					else if (_m.i.f === item.id) {
						_m.f_slot = item.slot;
					}
				}
				mod.command.message(`${_m.d.length} fish tagged for dismantling.`);
				mod.unhook(h);
			}
		});
	}

	function load() {
		function hook() {
			_m.h.push(mod.hook(...arguments));
		}

		function cast(event) {
			if (!event && _m.cCastFishingRod.id) {
				_m.state = 'cast';

				mod.send('C_USE_ITEM', 3, { gameId: mod.game.me.gameId, id: _m.cCastFishingRod.id, dbid: 0, target: 0, amount: 1, dest: { x: 0, y: 0, z: 0 }, loc: _m.cPlayerLocation.loc, w: _m.cPlayerLocation.w, unk1: 0, unk2: 0, unk3: 0, unk4: true });
			}
			else if (event) {
				mod.send('C_USE_ITEM', 3, { gameId: mod.game.me.gameId, id: _m.h_id, dbid: 0, target: 0, amount: 1, dest: { x: 0, y: 0, z: 0 }, loc: _m.cPlayerLocation.loc, w: _m.cPlayerLocation.w, unk1: 0, unk2: 0, unk3: 0, unk4: true });
				_m.t = setTimeout(() => { cast(); }, random(500, 1500));
			}
			else {
				_m.t = setTimeout(() => { cast(); }, 500);
			}
		}

		function trash() {
			if (_m.sRequestContract.id) {
				mod.send('C_RQ_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, { contract: _m.sRequestContract.id, dbid: _m.d[0].dbid, id: _m.d[0].id, amount: 1 });
				_m.d.shift();
			}
		}

		hook('C_CAST_FISHING_ROD', 1, ({ dbid, id }) => { _m.cCastFishingRod = { dbid: dbid, id: id }; });

		hook('S_FISHING_BITE', 1, ({ gameId, id }) => {
			if (!mod.game.me.is(gameId)) return;

			_m.t = setTimeout(() => { mod.send('C_START_FISHING_MINIGAME', 1, {}); }, random(250, 1000));
			return false;
		});

		hook('S_START_FISHING_MINIGAME', 1, ({ gameId, grade }) => {
			if (!mod.game.me.is(gameId)) return;

			_m.state = 'minigame';

			if (grade > 10) {
				mod.command.message(`You've hooked a grade ${grade} fish!`);
			}
			_m.t = setTimeout(() => { mod.send('C_END_FISHING_MINIGAME', 1, { pass: true }); }, random(3000, 5000) + (grade * 100));
			return false;
		});

		hook('S_FISHING_CATCH', 1, ({ gameId }) => {
			if (!mod.game.me.is(gameId)) return;

			_m.state = 'catch';

			check();
			_m.t = setTimeout(() => { cast(); }, random(3000, 5000));	//? Probable cause of not in fishing location bug. Must update location soon before casting so saved value is inconsistent with actual location. < 3000 is bad.
		});

		hook('S_FISHING_CATCH_FAIL', 1, ({ gameId }) => {
			if (!mod.game.me.is(gameId)) return;

			_m.t = setTimeout(() => { cast(); }, random(3000, 5000));
		});

		hook('S_SYSTEM_MESSAGE', 1, ({ message }) => { // mod.log(`S_SYSTEM_MESSAGE: message ${message}.`) @4121 = need bait, @4123 = full inv, @3117 = full decomposition list
			const m = mod.parseSystemMessage(message).id;

			if (m === 'SMT_CANNOT_FISHING_NON_BAIT') {
				_m.state = 'craft';

				let h = mod.hook('S_END_PRODUCE', 1, ({ success }) => {
					if (success) {
						_m.t = setTimeout(() => { mod.send('C_START_PRODUCE', 1, { recipe: _m.i.h[_m.h_id].recipe, unk: 0 }); }, 200);
					}
					else {
						_m.t = setTimeout(() => { cast(1); }, 500);

						check();
						mod.unhook(h);
					}
				});
				mod.send('C_START_PRODUCE', 1, { recipe: _m.i.h[_m.h_id].recipe, unk: 0 });
			}
			else if (m === 'SMT_GENERAL_CANT_REG_ITEM_LIMIT') {
				if (_m.sRequestContract) { mod.send('C_DEL_ITEM', 2, { gameId: mod.game.me.gameId, slot: _m.f_slot - 40, amount: 500 }); }
			}
			else if (m === 'SMT_CANNOT_FISHING_FULL_INVEN') {
				_m.state = '_m.d';

				let h = mod.hook('S_REQUEST_CONTRACT', 1, ({ senderId, type, id }) => {
					if (!mod.game.me.is(senderId)) return;

					if (_m.d.length && type === 89) {
						_m.sRequestContract = { id: id };

						_m.t = setTimeout(() => { trash(); }, 200);
						mod.unhook(h);
					}
				});

				mod.send('C_REQUEST_CONTRACT', 1, { type: 89 });
			}
			else if (m === 'SMT_CANNOT_FISHING_NON_AREA' || m === 'SMT_FISHING_RESULT_CANCLE') {	// ? Correct message?
				_m.t = setTimeout(() => { cast(); }, 500);
			}
		});

		hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, ({ item, amount }) => {
			if (!_m.i.n.hasOwnProperty(item) && !_m.i.b.hasOwnProperty(item) && !_m.i.h.hasOwnProperty(item) && item !== _m.i.t && item !== _m.i.e) {
				mod.log(`S_SYSTEM_MESSAGE_LOOT_ITEM: item = ${item}, amount = ${amount}!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
			}

			if (_m.i.n.hasOwnProperty(item)) {
				_m.s.n++;
			}
			else if (item === _m.i.t) {
				_m.s.t += amount;
			}
			else if (_m.i.b.hasOwnProperty(item)) {
				_m.s.b++;
			}
			else if (item === _m.i.e) {
				_m.s.e += amount;
			}
		});

		hook('S_RP_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, ({ success }) => {
			if (!success) return;

			_m.c++;

			if (_m.d.length && _m.c < 20) {
				_m.t = setTimeout(() => { trash(); }, 200);
			}
			else if (_m.sRequestContract.id) {
				setTimeout(() => { mod.send('C_RQ_COMMIT_DECOMPOSITION_CONTRACT', 1, { contract: _m.sRequestContract.id }); }, 200);
			}
		});

		hook('S_RP_COMMIT_DECOMPOSITION_CONTRACT', 1, () => {
			_m.c = 0;

			if (_m.d.length) {
				_m.t = setTimeout(() => { trash(); }, 800);
			}
			else {
				if (_m.sRequestContract.id) {
					mod.send('C_CANCEL_CONTRACT', 1, { type: 89, id: _m.sRequestContract.id });

					delete _m.sRequestContract;
				}
				_m.t = setTimeout(() => { cast(); }, random(1500, 2000));
			}
		});

		hook('C_RETURN_TO_LOBBY', 1, () => { return false; });
	}

	mod.hook('C_PLAYER_LOCATION', 5, ({ loc, w }) => { _m.cPlayerLocation = { loc: loc, w: w }; });

	function unload() {
		clearTimeout(_m.t);
		if (_m.w_slot) {
			mod.send('C_EQUIP_ITEM', 2, { gameId: mod.game.me.gameId, slot: _m.w_slot, unk: 0 });
			mod.command.message(`Re-equipped ${_m.w_name}.`);
		}
		switch (_m.state) {
			case 'cast':
				mod.send('C_USE_ITEM', 3, { gameId: mod.game.me.gameId, id: _m.cCastFishingRod.id, dbid: 0, target: 0, amount: 1, dest: { x: 0, y: 0, z: 0 }, loc: _m.cPlayerLocation.loc, w: _m.cPlayerLocation.w, unk1: 0, unk2: 0, unk3: 0, unk4: true });
				break;
			case 'minigame':
				mod.send('C_END_FISHING_MINIGAME', 1, { pass: true });
				break;
			case 'catch':
			case 'craft':
				break;
			case '_m.d':
				mod.send('C_CANCEL_CONTRACT', 1, { type: 89, id: _m.sRequestContract.id });
				break;
		}

		if (_m.h.length) {
			for (let i of _m.h) { mod.unhook(i); }
		}
		_m.h.length = 0;

		mod.command.message('auto-fish disabled.'.clr('FF0000') + (_m.s.n ? ` Caught fish: ${_m.s.n}, Big-Ass Fish: ${_m.s.b}, Angler Tokens: ${_m.s.t} and Pulsating Essence: ${_m.s.e}.` : ''));
		for (let i in _m) {
			if (['h', 'd', 'i', 'e', 'c', 'cPlayerLocation'].includes(i)) continue;

			delete _m[i];
		}

		_m.d.length = 0;		//! fix, getting deleted
	}

	function random(min, max) { return Math.floor(Math.random() * (max - min) + min); }

	this.destructor = () => { mod.command.remove(['f', 'fish']); };
};