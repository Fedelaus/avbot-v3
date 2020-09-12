require('../config/setup');
const services = require('../config/services');

const {
	ShardingManager,
} = require('discord.js');

const manager = new ShardingManager('./src/app/bot.js', {
	token: services.discord.token,
});


manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));
manager.spawn();