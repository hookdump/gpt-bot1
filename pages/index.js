import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { ChatGPTAPI } from 'chatgpt';

const Home = () => {
  const [tweetUrl, setTweetUrl] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // initialize ChatGPT with the provided token
  const api = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN,
  });

  // fetch the tweet content from the provided URL
  const fetchTweet = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data.text;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  // generate a response for the given tweet using ChatGPT
  const generateResponse = async (tweet) => {
    try {
      // ensure that the API is authenticated
      await api.ensureAuth();

      // send the tweet to ChatGPT and return the response
      const response = await api.sendMessage(tweet);
      return response;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // fetch the tweet content and generate a response
    setIsLoading(true);
    const tweet = await fetchTweet(tweetUrl);
    const response = await generateResponse(tweet);
    setResponse(response);
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Tweet GPT Bot</title>
        {/* include Tailwind CSS styles */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"
        />
        {/* include Element UI styles */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css"
        />
      </Head>
      <div className="w-full max-w-xs mx-auto mt-12">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="url"
            >
              Tweet URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="url"
              type="text"
              placeholder="Enter a tweet URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Generate witty response
            </button>
          </div>
        </form>
        {response && (
          <div className="mt-8">
            <p>{response}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
