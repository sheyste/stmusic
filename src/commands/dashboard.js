const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embed = require('../embeds/embeds');
const { label } = require('../utils/constants');
const { settings } = require('../utils/player/settings');


module.exports = {
    name: 'dashboard',
    aliases: ['d', 'main'],
    description: 'Move the embed message to control music playing to the bottom',
    usage: 'dashboard',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | No music currently playing.`, allowedMentions: { repliedUser: false } });


        try {
            await queue.dashboard.delete();
        } catch (error) {
            console.log('Dashboard delete error:', error);
        }

        let playing = queue.node.isPaused();

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setLabel(playing ? label.play : label.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setLabel(label.skip).setStyle(ButtonStyle.Secondary);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setLabel(label.loop).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setLabel(label.stop).setStyle(ButtonStyle.Danger);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setLabel(label.suuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, loopButton, stopButton, shuffleButton);

        const cur = queue.currentTrack;
        queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_play("Playing", cur.title, cur.url, cur.duration, cur.thumbnail, settings(queue))], components: [row] });
        return await message.react('👍');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | No music currently playing.`, allowedMentions: { repliedUser: false } });


        try {
            await queue.dashboard.delete();
        } catch (error) {
            console.log('Dashboard delete error:', error);
        }

        let playing = queue.node.isPaused();

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setLabel(playing ? label.play : label.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setLabel(label.skip).setStyle(ButtonStyle.Secondary);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setLabel(label.loop).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setLabel(label.stop).setStyle(ButtonStyle.Danger);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setLabel(label.suuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, loopButton, stopButton, shuffleButton);

        const cur = queue.currentTrack;
        queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_play("Playing", cur.title, cur.url, cur.duration, cur.thumbnail, settings(queue))], components: [row] });
        return await interaction.reply("✅ | Dashboard updated.");
    },
};