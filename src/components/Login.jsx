import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>
          <div>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
              <GoogleLogin
                onSuccess={(tokenResponse) => {
                  console.log(tokenResponse.credential);
                  const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenResponse.credential}`;
                  fetch(url).then((response) => response.json())
                    .then((response) => {
                      const obj = {};
                      obj.name = response.name;
                      obj.googleId = response.sub;
                      obj.imageUrl = response.picture;
                      localStorage.setItem('user', JSON.stringify(obj));
                      const { name, googleId, imageUrl } = obj;
                      const doc = {
                        userName: name,
                        _id: googleId,
                        _type: 'user',
                        image: imageUrl,
                      };
                      client.createIfNotExists(doc).then(() => {
                        navigate('/', { replace: true });
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
              />;
            </GoogleOAuthProvider>;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
