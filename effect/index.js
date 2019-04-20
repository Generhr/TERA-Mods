String.prototype.clr = function(c) {
	return `<font color='#${c}'>${this}</font>`;
};

const path = require('path'),
	fs = require('fs');

module.exports = function Lancer(mod) {
	const _m = {
	};

	try {
		_m.c = require('./config.json');
	}
	catch (event) {
		_m.c = {
			effects: {}
		};
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), () => {
			mod.log(`Generated a new config.json.`);
		});
	}

	mod.game.on('enter_game', () => {
		if (!_m.c.effects[mod.game.me.name]) {
			_m.c.effects[mod.game.me.name] = {};
		}
		setTimeout(() => {
			effect(3);
		}, 2500);
	});

	mod.command.add(['effect'], (a1, a2) => {
		switch (a1 ? a1.toLowerCase() : a1) {
			case 'reset':
			case 'r':
				for (let i in _m.c.effects[mod.game.me.name]) {
					effect(2, i, _m.c.effects[mod.game.me.name][i]);
				}
				return mod.command.message(`All effects have been removed.`);
			default:
				if (a1) {
					if (isNaN(a1)) {
						return mod.command.message(`${a1} is an invalid parameter.`.clr('FF0202'));
					}

					a1 = parseInt(a1);
					a2 = a2 ? parseInt(a2) : 1;
					if (_m.c.effects[mod.game.me.name]) {
						if (_m.c.effects[mod.game.me.name][a1] === a2) {
							effect(2, a1, a2);

							return mod.command.message(`Removed effect id ${a1}.`);
						}
					}
					effect(1, a1, a2);

					mod.command.message(`Applied effect id ${a1 + a2 > 1 ? ' with ' + a2 + ' stacks' : ''}.`);
				}
				else {
					mod.command.message(`No parameter given.`.clr('FF0202'));
				}
		}
	});

	function effect(p1, p2 = 0, p3 = 0) {
		switch (p1) {
			case 1:
				mod.send('S_ABNORMALITY_END', 1, { target: mod.game.me.gameId, id: p2 });
				mod.send('S_ABNORMALITY_BEGIN', 3, { target: mod.game.me.gameId, source: mod.game.me.gameId, id: p2, duration: 864000000, unk: 0, stacks: p3, unk2: 0, unk3: 0 });

				Object.assign(_m.c.effects[mod.game.me.name], { [p2]: p3 });
				break;
			case 2:
				mod.send('S_ABNORMALITY_BEGIN', 3, { target: mod.game.me.gameId, source: mod.game.me.gameId, id: p2, duration: 864000000, unk: 0, stacks: p3, unk2: 0, unk3: 0 });
				mod.send('S_ABNORMALITY_END', 1, { target: mod.game.me.gameId, id: p2 });

				delete _m.c.effects[mod.game.me.name][p2];
				break;
			case 3:
				for (let i in _m.c.effects[mod.game.me.name]) {
					mod.send('S_ABNORMALITY_END', 1, { target: mod.game.me.gameId, id: i });
					mod.send('S_ABNORMALITY_BEGIN', 3, { target: mod.game.me.gameId, source: mod.game.me.gameId, id: i, duration: 864000000, unk: 0, stacks: _m.c.effects[mod.game.me.name][i], unk2: 0, unk3: 0 });
				}
				return;
		}
		clearTimeout(_m.t);

		_m.t = setTimeout(() => {
			fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(_m.c, undefined, '\t'), () => {
				mod.log(`Saved changes to config.json.`);
			});
		}, 5000);
	}

	mod.hook('S_LOAD_TOPO', 3, () => {
		setTimeout(() => {
			effect(3);
		}, 2500);
	});

//	mod.hook('S_ADMIN_HOLD_CHARACTER', 2, ({ hold }) => {
//		if (!hold) {
//			_m.t = setTimeout(() => {
//				effect(3);
//			}, 3500);
//		}
//	});

	mod.hook('C_REVIVE_NOW', 2, () => {
		setTimeout(() => {
			effect(3);
		}, 2500);
	});

	this.destructor = () => {
		mod.command.remove(['effect']);
	};
};