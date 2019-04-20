String.prototype.clr = function(c) { return `<font color='#${c}'>${this}</font>`; };

const path = require('path'),
	fs = require('fs');

module.exports = function autoItem(mod) {
	const _m = {
		s: require('./strings/strings.' + mod.region + '.json')['item'],
		h: [],
		e: [],
		p: [],
		u: true
	};

	try {
		_m.c = require('./config.json');
	}
	catch (event) {
		_m.c = {
			enable: true,
			debug: false,
			generic: true,
			notice: {
				'369': 'Diamond',
				'28601': 'Design: Golden Plate',
				'28603': 'Design: Silver Plate',
				'28607': 'Design: Diamond',
				'98531': 'Frostmetal Equipment Chest',
				'98532': 'Stormcry Equipment Chest'
			},
			delete: {},
			slot: []
		};

		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), () => {
			mod.log(`Generated a new config.json`);
		});
	}

	let count = 0;

	mod.game.on('enter_game', () => {
		_m.n = mod.game.me.name;
		if (_m.c.enable) {
			load();
		}
	});

	mod.game.on('leave_game', () => {
		unload();
	});

	mod.command.add('broker', () => {
		mod.send('S_NPC_MENU_SELECT', 1, { type: 28 });
		return false;
	});

	mod.command.add('item', (p1, p2) => {
		let v1 = p1.match(/\w+/)[0].toLowerCase(),
			v2 = p1.match(/[^\w]/)[0],
			v3 = p2 && p2.match(/\d/)[0] === '1' ? parseInt(p2.match(/(\d+)@/)[1]) : null;
		if (_m.c.debug) {
			mod.log(`${_m.s[v3 || p2]}`);
		}

		if (p2 && !_m.s[v3 || p2]) {
			return mod.command.message(`Either 1] link an item or 2] enter a valid item id after the command to use this feature.`.clr('FF0202'));
		}
		switch (p1 ? v1 : p1) {
			case undefined:
				if ((_m.c.enable = !_m.c.enable) === false) {
					unload();
				}
				else {
					load();
				}
				return mod.command.message(`auto-item` + ` ${_m.c.enable ? 'enabled.'.clr('15FF02') : 'disabled.'.clr('FF0202')}`);
			case 'notice':
			case 'n':
				switch (v2) {
					case '+':
						if (!_m.c.notice[v3 || p2]) {
							Object.assign(_m.c.notice, { [v3 || p2]: _m.s[v3 || p2] });

							mod.command.message(`Notice: added` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + `.`);
						}
						else {
							return mod.command.message(`Notice:` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + ` has already been saved.`.clr('FF0202'));
						}
						break;
					case '-':
						if (_m.c.notice[v3 || p2]) {
							delete _m.c.notice[v3 || p2];

							mod.command.message(`Notice: removed` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + `.`);
						}
						else {
							return mod.command.message(`Notice:` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + ` has not been saved.`.clr('FF0202'));
						}
						break;
				}
				break;
			case 'delete':
			case 'd':
				switch (v2) {
					case '+':
						if (!_m.c.delete[v3 || p2]) {
							Object.assign(_m.c.delete, { [v3 || p2]: _m.s[v3 || p2] });

							mod.command.message(`Delete: added` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + `.`);
						}
						else {
							return mod.command.message(`Delete:` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + ` has already been saved.`.clr('FF0202'));
						}
						break;
					case '-':
						if (_m.c.delete[v3 || p2]) {
							delete _m.c.delete[v3 || p2];

							mod.command.message(`Delete: removed` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + `.`);
						}
						else {
							return mod.command.message(`Delete:` + ` ${v3 ? p2 : '<ChatLinkAction param="1#####' + p2 + '@' + mod.game.me.playerId + '@' + mod.game.me.name + '">&lt;' + _m.s[p2] + '&gt;</ChatLinkAction>'}`.clr('FFD700') + ` has not been saved.`.clr('FF0202'));
						}
						break;
				}
				break;
			case 'slot':
			case 's':
				if (v3) {
					switch (v2) {
						case '+':
							if (!_m.c.slot.some(e => e.id === v3)) {
								for (let [k, v] of Object.entries(_m.sInven)) {
									if (v.slot < 40) continue;

									if (v.id === v3) {
										_m.c.slot.push({ id: v.id, name: _m.s[v3], slot: v.slot });

										mod.command.message(`Slot: saved` + ` ${p2}`.clr('FFD700') + ` to slot ${v.slot}`);
										break;
									}
									else if (parseInt(k) === Object.keys(_m.sInven).length) {
										return mod.command.message(`Slot:` + ` ${p2}`.clr('FFD700') + ` must be in your inventory.`.clr('FF0202'));
									}
								}
							}
							else {
								return mod.command.message(`Slot:` + ` ${p2}`.clr('FFD700') + ` has already been saved.`.clr('FF0202'));
							}
							break;
						case '-':
							if (_m.c.slot.some((e, i) => e.id === v3 ? (_m.i = i, true) : false)) {
								_m.c.slot.splice(_m.i);

								mod.command.message(`Slot: removed` + ` ${p2}`.clr('FFD700') + `.`);
							}
							else {
								return mod.command.message(`Slot:` + ` ${p2}`.clr('FFD700') + ` has not been saved.`.clr('FF0202'));
							}
							break;
					}
				}
				else {
					return mod.command.message(`You must link an item for the slot command.`.clr('FF0202'));
				}
				break;
			default:
				return mod.command.message(`${p1} is an invalid parameter.`.clr('FF0202'));
		}
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), () => {
			mod.log(`Saved changes to config.json`);
		});
	});

	function load() {
		function hook() {
			_m.h.push(mod.hook(...arguments));
		}

		hook('S_INVEN', 16, { order: 100, filter: { fake: null } }, ({ first, more, size, items }) => {
			_m.sInven = first ? items : _m.sInven.concat(items);

			if (!more) {
				if (_m.u) {
					_m.u = !_m.u;

					_m.e = Array(size).fill().map((e, i) => i + 40).filter(e => Object.entries(_m.sInven).map(e => e[1].slot).indexOf(e) === -1);
				}

				for (let [k, v] of Object.entries(_m.sInven)) {
					if (v.slot < 40) continue;

					if (_m.c.delete[v.id]) {
						mod.send('C_DEL_ITEM', 2, { gameId: mod.game.me.gameId, slot: v.slot - 40, amount: v.amount });
					}
					else if (!_m.z && _m.c.slot.some((e, i) => e.id === v.id && e.slot !== v.slot ? (_m.i = i, true) : false)) {
						_m.z = _m.e.shift();

						(function move(p1, p2, p3, p4) {
							setTimeout(() => {
								if (--p1) {
									mod.send('C_MOVE_INVEN_POS', 1, { source: mod.game.me.gameId, from: _m.c.slot[p3].slot, to: p2 });

									move(p1, p2, p3, p4);
								}
								else {
									mod.send('C_MOVE_INVEN_POS', 1, { source: mod.game.me.gameId, from: p4, to: _m.c.slot[p3].slot });

									_m.u = !(_m.z = null);
								}
							}, p1 === 2 ? 50 : 100);
						})(2, _m.z, _m.i, v.slot);
					}
				}
			}
		});

		hook('S_SYSTEM_MESSAGE', 1, ({ message }) => {
			const m = mod.parseSystemMessage(message).id;

			switch (m) {
				case 'SMT_ITEM_DELETED':
					return false;
				case 'SMT_MEDIATE_SUCCESS_BUY':
					setTimeout(() => {
						mod.send('C_TRADE_BROKER_BOUGHT_ITEM_LIST', 1, {});
					}, 1000);
					break;
			}
			//~ SMT_EVENT_CANNOT_USE_NOT_ENOUGH_SPACE
			//~ SMT_ACHIEVEMENT_GET_ITEM
		});

		hook('S_SPAWN_DROPITEM', 6, ({ item, explode }) => {
			if (_m.c.delete[item]) return false;

			if (_m.c.notice[item] && explode) {
				mod.command.message(`<ChatLinkAction param="1#####${item}@${mod.game.me.playerId}@${mod.game.me.name}">&lt;${_m.c.notice[item]}&gt;</ChatLinkAction>}`.clr('FFD700') + ` dropped!.`);
			}
		});

		for (let i of ['S_SYSTEM_MESSAGE_LOOT_ITEM', 'S_INVEN_CHANGEDSLOT']) {
			mod.hook(i, 1, () => {
				clearTimeout(_m.t);

				_m.t = setTimeout(() => {
					_m.u = !_m.z;
				}, 500);
			});
		}

		hook('S_PLAYTIME_EVENT_REWARD_DATA', 1, ({ items }) => {
			for (let i in items) {
				if (items[i].redeemable) {
					mod.send('C_RECEIVE_PLAYTIME_EVENT_REWARD', 1, { row: items[i].row, column: items[i].column });
				}
			}
		});

		['C_TRADE_BROKER_DEAL_CONFIRM', 'C_TRADE_BROKER_BUY_IT_NOW'].forEach((e, i) => {
			hook(e, i + 1, ({ listing }) => {
				_m.p.push(listing);
			});
		});

//		hook('C_TRADE_BROKER_BUY_IT_NOW', 2, ({ listing }) => {
//			_m.p.push(listing);
//		});
//
//		hook('C_TRADE_BROKER_DEAL_CONFIRM', 1, ({ listing }) => {
//			_m.p.push(listing);
//		});

		hook('S_TRADE_BROKER_BOUGHT_ITEM_LIST', 1, ({ purchases }) => {
			purchases.forEach((item) => {
				if (_m.p.includes(item.purchase)) {
					mod.send('C_TRADE_BROKER_CALC_BOUGHT_ITEM', 1, { unk1: 524289, unk2: 8, listing: item.purchase });

					_m.p.splice(item.purchase, 1);
				}
			});
		});

//		hook('S_STORE_BASKET', 1, ({ success, type, id }) => {
//			if (!success) return;
//
//			if (++count >= 20 && _m.sRequestContract.id) {
//				mod.send('C_STORE_COMMIT', 1, { contract: _m.sRequestContract.id });
//			}
//		});

		hook('S_REQUEST_CONTRACT', 1, ({ senderId, type, id }) => {
			if (!mod.game.me.is(senderId) || type !== 89) return;

			_m.sRequestContract = { id: id };
		});

		hook('S_CANCEL_CONTRACT', 1, ({ senderId, type }) => {
			if (!mod.game.me.is(senderId) || type !== 89) return;

			delete _m.sRequestContract;
		});

		hook('S_RP_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, ({ success }) => {
			if (!success) return;

			if (++count >= 20 && _m.sRequestContract.id) {
				mod.send('C_RQ_COMMIT_DECOMPOSITION_CONTRACT', 1, { contract: _m.sRequestContract.id });
			}
		});

		hook('S_RP_COMMIT_DECOMPOSITION_CONTRACT', 1, () => {
			count = 0;
		});
	}

	function unload() {
		if (_m.h.length) {
			for (let i of _m.h) {
				mod.unhook(i);
			}
			_m.h.length = 0;
		}

		for (let i in _m) {
			if (['s', 'h', 'e', 'p', 'c', 'n'].includes(i)) continue;

			delete _m[i];
		}
		_m.u = true;
	}

	this.destructor = () => {
		mod.command.remove('item');
	};
};