require("dotenv").config();
let fs = require('fs');
let request = require('request');
//readFile/writeFile;
let keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//to convert date/time for concerts
let moment = require('moment');
//user input: "concert-this", "spotify-this-song", "movie-this," or "do-what-it-says"
let input = process.argv[2];

if (input === undefined) {
    console.log("Please enter a command: concert-this, spotify-this-song, movie-this, or do-what-it-says");
}

//node liri.js concert-this <artist/band name here>
if (input === "concert-this") {
    let artist = process.argv[3]
    //console.log(artist);
    let bandsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    //console.log(bandsURL);

    request(bandsURL, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.

        let bandsData = JSON.parse(body);
        //console.log(bandsData);

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

    if (artist === undefined) {

    }
}

//node liri.js spotify-this-song '<song name here>'

if (input === "spotify-this-song") {

    let songName = process.argv[3];
  
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
                console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nAlbum Title: " + albumTitle);
            }
            else {
                console.log("Artist: " + recordingArtist + "\nSong Title: " + songTitle + "\nPreview: " + preview + "\nAlbum Title: " + albumTitle);
            }
        }
    });
    if (songName === undefined) {

    }
}
//node liri.js movie-this '<movie name here>'
if (input === "movie-this") {
    let movieName = process.argv[3]
    //console.log(movieName);
    let movieURL = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    //console.log(movieURL);
    request(movieURL, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        let movieData = JSON.parse(body);
        //console.log(movieData)
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

/*else {
    console.log('please enter a command')
}*/