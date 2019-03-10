'use strict';

const request = require('request');
const articleTitle = require('article-title');

let client = require('coffea')({
    host: 'open.ircnet.net',
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

        // dice roller.
        case 'roll':
            if (event.args.length < 1 || !isInt(event.args[0]) || !isInt(event.args[1])) {
                event.reply('Try again. You need to give amount of dices and number of their sides.(Syntax: !roll 1 6)');
                break;
            }  
            let roll = rollDice(event.args[0], event.args[1]);
            event.reply('You rolled ' + event.args[0] + "D" + event.args[1] + " and the result is: " + roll.toString() + '!');
            if (roll == 666)
                event.reply('SAATANA!');
            if (roll == 420)
                event.reply('https://www.youtube.com/watch?v=hIw7oeZKpZc');
            break;
            
        // weather request
        case 'sää':
        // You need to make an account and get API key from https://openweathermap.org/appid to make this work.
            if (event.args.length < 1) {
                event.reply("unohdit määritellä paikkakunnan. (syntaksi: !sää kivesjärvi)");
                break;
            } 
            let apiKey = 'a44d12f21b5115f1d861ff50b4eea477'
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${event.args[0]}&units=metric&appid=${apiKey}`

            request(url, function (err, response, body) {
                if(err){
                    event.reply('Virhe.')
                }
                else {
                
                    let weather = JSON.parse(body)
                    if (weather.main == undefined){
                        event.reply('Paikkakuntaa ei löytynyt.')
                    } else 
                        event.reply(`Lämpötila kohteessa ${weather.name} on ${weather.main.temp} celsiusastetta. Ilmankosteus on ${weather.main.humidity}%. Tuulen nopeus on ${weather.wind.speed}m/s.`);
                }
            });
            
            break;
        
    }
    console.log(event.channel.name, event.user.nick, event.message);
});

// the bot reads messages send on channel, runs functions according to them.
client.on('message', function (event) {
    if (event.message.includes("ilmatar"))
        event.reply("häh?");
    else if (checkForUrl(event.message)) {
        console.log(event.message);

    request(event.message, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
        event.reply('Title: ' + articleTitle(body));
        });

    }


});

function checkForUrl(str) {
    let pattern = new RegExp('^((ft|htt)ps?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?'+ // port
  '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
  '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

// gives out a random number defined by amount of dices and their sides.
function rollDice(dices, sides)
  {
    return dices * (Math.floor(Math.random() * (sides) +1));
  }

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}
