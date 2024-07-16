import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("https://spotifyclone-back.onrender.com/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <>
      <div className=" bg-black text-white">
        <div>
          <div className="text-center pb-5 pt-2">
            <h1 className="font-extrabold text-9xl">Spotify Clone</h1>
            <p>A Clone made by using Spotify API.</p>
            </div>
        </div>
        <Container
          className="d-flex flex-column py-2 px-2 "
          style={{ height: "100vh" }}
        >
          <Form.Control
            className="p-2"
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex-grow-1 my-2 mx-2" style={{ overflowY: "auto" }}>
            {searchResults.map((track) => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}
            {searchResults.length === 0 && (
              <div className="text-center" style={{ whiteSpace: "pre" }}>
                {lyrics}
              </div>
            )}
          </div>
          <div>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
          </div>
        </Container>
      </div>
    </>
  );
}
