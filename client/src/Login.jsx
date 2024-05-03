import React from "react"
import { Container } from "react-bootstrap"

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=bc1d545197174457b7e560a9ff50fd5f&response_type=code&redirect_uri=http://localhost:5173/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
  return (
    <>
    <div className="bg-black text-white text-center">
      <h1 className="pt-2">Spotify Clone</h1>
   
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className=" btn rounded-md border-white text-white btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
    </div>
    </>
  )
}
