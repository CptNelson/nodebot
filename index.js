let client = require('coffea')({
    host: 'open.ircnet.org',
    port: 6667, // default value: 6667
    ssl: false, // set to true if you want to use ssl
    ssl_allow_invalid: false, // set to true if the server has a custom ssl certificate
    prefix: '!', // used to parse commands and emit on('command') events, default: !
    channels: ['#noitapiiri'], // autojoin channels, default: []
    nick: 'ilmatar', // default value: 'coffea' with random number
    username: 'ilmatar', // default value: username = nick
    realname: 'ilmatar', // default value: realname = nick
    throttling: 666 // default value: 250ms, 1 message every 250ms, disable by setting to false
});

client.on('command', function (event) {
    switch (event.cmd) {
        case 'jaa':
            event.reply('jaa mitä meinasit?');
            break;
        case 'roll':
            if (event.args.length < 1) {
                event.reply('not enough arguments: please specify number of dices and their sides (syntax: !roll 1 6)')
                break;
            }
            let roll = dice(event.args[0], event.args[1])
            event.reply('You rolled ' + event.args[0] + "D" + event.args[1] + " and the result is: " + roll.toString() + '!');
    }
    console.log(event.channel.name, event.user.nick, event.message);
});



//Function dice(nameCount) gives out a random nummber between 1 and amount of names[]
function dice(dices, sides)
  {
    this.sides = sides;
    this.dices = dices;
    return  dices * (Math.floor(Math.random() * (this.sides) +1));
  }
