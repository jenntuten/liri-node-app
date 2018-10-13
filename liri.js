require("dotenv").config();
let fs = require('fs');
let request = require('request');
//set up Spotify API and require keys.js which reads the Spotify id/secret from the .env file
let keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//to convert date/time for concerts from Bands in Town API
let moment = require('moment');
//user input: "concert-this", "spotify-this-song", "movie-this," or "do-what-it-says"
let input = process.argv[2];
//display user input options if not provided
if (input === undefined) {
    console.log("Please enter a command: concert-this, spotify-this-song, movie-this, or do-what-it-says");
}
//node liri.js concert-this <artist/band name here>
let concertThis = function () {
    let artist = process.argv[3];
    if (artist === undefined) {
        //default artist to search for if none provided by user
        let artist = "chvrches";
        let bandsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        request(bandsURL, function (error, response, body) {
            if (error) {
                return 
                console.log('error: ', error);
                console.log('statusCode:', response && response.statusCode);
              }
            let bandsData = JSON.parse(body);
            for (let m = 0; m < bandsData.length; m++) {
                venue = bandsData[m].venue.name;
                city = bandsData[m].venue.city;
                region = bandsData[m].venue.region;
                date = bandsData[m].datetime;
                //convert date from YYYY-MM-DDTHH:mm
                let concertDate = moment(date).format('YYYY-MM-DD');
                //check if a region (usually the state) is included
                if (region.length < 1) {
                    console.log("Venue: " + venue + "\nLocation: " + city + "\nDate: " + concertDate + "\n-----------");
                }
                else {
                    console.log("Venue: " + venue + "\nLocation: " + city + ", " + region + "\nDate: " + concertDate + "\n-----------");
                }
            }
        });
    }
    else {
        let bandsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        request(bandsURL, function (error, response, body) {
            if (error) {
                return 
                console.log('error: ', error);
                console.log('statusCode:', response && response.statusCode);
              }
            let bandsData = JSON.parse(body);
            for (let m = 0; m < bandsData.length; m++) {
                venue = bandsData[m].venue.name;
                city = bandsData[m].venue.city;
                region = bandsData[m].venue.region;
                date = bandsData[m].datetime;
                //convert date from YYYY-MM-DDTHH:mm
                let concertDate = moment(date).format('YYYY-MM-DD');
                //check if a region (usually the state) is included
                if (region.length < 1) {
                    console.log("Venue: " + venue + "\nLocation: " + city + "\nDate: " + concertDate + "\n-----------");
                }
                else {
                    console.log("Venue: " + venue + "\nLocation: " + city + ", " + region + "\nDate: " + concertDate + "\n-----------");
                }
            }
        });
    }
}
//node liri.js spotify-this-song '<song name here>'
let spotifyThisSong = function () {
    let songName = process.argv[3];
    if (songName === undefined) {
        //use "The Sign" by Ace of Base if only 'node spotify-this-song' is entered
        spotify.search({ type: 'track', query: 'the sign ace of base' }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            let music = data.tracks.items;
            for (let j = 0; j < music.length; j++) {
                preview = music[j].preview_url;
                recordingArtist = music[j].artists[0].name;
                songTitle = music[j].name;
                albumTitle = music[j].album.name;
                //filter out previews without a corresponding URL
                if (preview === null) {
                    console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nAlbum Title: " + albumTitle + "\n----------");
                }
                else {
                    console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nPreview: " + preview + "\nAlbum Title: " + albumTitle + "\n----------");
                }
            }
        });
    }
    else {
        spotify.search({ type: 'track', query: songName }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            let music = data.tracks.items;
            for (let j = 0; j < music.length; j++) {
                preview = music[j].preview_url;
                recordingArtist = music[j].artists[0].name;
                songTitle = music[j].name;
                albumTitle = music[j].album.name;
                //filter out previews without a corresponding URL
                if (preview === null) {
                    console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nAlbum Title: " + albumTitle + "\n----------");
                }
                else {
                    console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nPreview: " + preview + "\nAlbum Title: " + albumTitle + "\n----------");
                }
            }
        });
    }

}
//node liri.js movie-this '<movie name here>'
let movieThis = function () {
    let movieName = process.argv[3]
    //console.log(movieName);
    let movieURL = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    //console.log(movieURL);
    request(movieURL, function (error, response, body) {
        if (error) {
            return 
            console.log('error: ', error);
            console.log('statusCode:', response && response.statusCode);
          }
        let movieData = JSON.parse(body);
        console.log("Title: " + movieData.Title);
        console.log("Year: " + movieData.Year)
        console.log("IMDB Rating: " + movieData.imdbRating);
        console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
        console.log("Country: " + movieData.Country);
        console.log("Language: " + movieData.Language);
        console.log("Plot: " + movieData.Plot);
        console.log("Actors: " + movieData.Actors);

    });
    if (movieName === undefined) {
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/. \nIt's on Netflix!")
    }
}
//node liri.js do-what-it-says
let doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        let commands = data.split(',');
        console.log(commands)
        if (commands[0] === "concert-this") {
            let newArtist = commands[1];
            console.log('newArtist',newArtist)
            let bandsURL = "https://rest.bandsintown.com/artists/" + newArtist + "/events?app_id=codingbootcamp";
            request(bandsURL, function (error, response, body) {
                if (error) {
                    return 
                    console.log('error: ', error);
                    console.log('statusCode:', response && response.statusCode);
                  }
                let bandsData = JSON.parse(body);
                for (let m = 0; m < bandsData.length; m++) {
                    venue = bandsData[m].venue.name;
                    city = bandsData[m].venue.city;
                    region = bandsData[m].venue.region;
                    date = bandsData[m].datetime;
                    //convert date from YYYY-MM-DDTHH:mm
                    let concertDate = moment(date).format('YYYY-MM-DD');
                    //check if a region (usually the state) is included
                    if (region.length < 1) {
                        console.log("Venue: " + venue + "\nLocation: " + city + "\nDate: " + concertDate + "\n-----------");
                    }
                    else {
                        console.log("Venue: " + venue + "\nLocation: " + city + ", " + region + "\nDate: " + concertDate + "\n-----------");
                    }
                }
            });
        }
        if (commands[0] === "movie-this") {
            let newMovieName = commands[1];
            let movieURL = "https://www.omdbapi.com/?t=" + newMovieName + "&plot=short&apikey=trilogy";
            //console.log(movieURL);
            request(movieURL, function (error, response, body) {
                if (error) {
                    return 
                    console.log('error: ', error);
                    console.log('statusCode:', response && response.statusCode);
                  }
                let movieData = JSON.parse(body);
                console.log("Title: " + movieData.Title);
                console.log("Year: " + movieData.Year)
                console.log("IMDB Rating: " + movieData.imdbRating);
                console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
                console.log("Country: " + movieData.Country);
                console.log("Language: " + movieData.Language);
                console.log("Plot: " + movieData.Plot);
                console.log("Actors: " + movieData.Actors);
            });
        }
        if (commands[0] === "spotify-this-song") {
            let newSongName = commands[1];
            spotify.search({ type: 'track', query: newSongName }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                let music = data.tracks.items;
                for (let j = 0; j < music.length; j++) {
                    preview = music[j].preview_url;
                    recordingArtist = music[j].artists[0].name;
                    songTitle = music[j].name;
                    albumTitle = music[j].album.name;
                    //filter out previews without a corresponding URL
                    if (preview === null) {
                        console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nAlbum Title: " + albumTitle + "\n----------");
                    }
                    else {
                        console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nPreview: " + preview + "\nAlbum Title: " + albumTitle + "\n----------");
                    }
                }
            });
        }
    })
}
//run appropriate function based on user's command
if (input === "concert-this") {
    concertThis();
}
if (input === "movie-this") {
    movieThis();
}
if (input === "spotify-this-song") {
    spotifyThisSong();
}
if (input === "do-what-it-says") {
    doWhatItSays();
}
