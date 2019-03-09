'use strict';

const request = require('request');
const getTitle = require('get-title-at-url');
const validUrl = require('valid-url');
let weatherMessage;


let client = require('coffea')({
    host: 'irc.elisa.fi',
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

client.on('message', function (event) {
    if (validUrl.isUri(event.message)){
        console.log('Looks like an URI');
        getTitle(event.message, function(title){
            event.reply("Title: " + title);
          });
    } else {
        return;
    }
});

client.on('command', function (event) {
    switch (event.cmd) {
        case 'jaa':
            event.reply('jaa mitä meinasit?');
            break;

        // dice roller.
        case 'roll':
            if (event.args.length < 1) {
                event.reply('not enough arguments: please specify number of dices and their sides (syntax: !roll 1 6)')
                break;
            }
            let roll = dice(event.args[0], event.args[1])
            event.reply('You rolled ' + event.args[0] + "D" + event.args[1] + " and the result is: " + roll.toString() + '!');
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



// gives out a random number defined by amount of dices and their sides.
function dice(dices, sides)
  {
    this.sides = sides;
    this.dices = dices;
    return  dices * (Math.floor(Math.random() * (this.sides) +1));
  }
