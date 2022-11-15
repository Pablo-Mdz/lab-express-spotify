require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => {
        console.log(data);
        spotifyApi.setAccessToken(data.body.access_token);
    })
    .catch((error) =>
        console.log("Something went wrong  retrieving the access token", error)
    );

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render("artist-search-results", { search: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('Album information', data.body.items);
            res.render('albums', { albumId: data.body.items })
        },
            function (err) {
                console.error(err);
            }
        );
}, function (err) {
    console.error(err);
});

app.get('/tracks/:tracksId/', (req, res, next) => {
    // console.log("working", req.params)
    //{limit: 5, offset: 1})
    // console.log(data.body);
    console.log("working")
    spotifyApi
        .getAlbumTracks(req.params.tracksId)
        .then((data) => {
            console.log('Tracks information', data.body.items);
            res.render('tracks', { tracks: data.body.items })
        }, function (err) {
            console.log('Something went wrong!', err);
        })
}, function (err) {
    console.error(err);
});
{/* <tracks />
<:tracksId>req.params.trackId</:tracksId> */}


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

