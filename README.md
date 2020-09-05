# Travel App

## Overview

This app takes in a user's travel destination and departure/return dates in order to return trip information, weather at destination, and a photo of the destination.  To do this, it uses three APIS: Geonames, to obtain location (latitide/longitude); Weatherbit, to obtain weather information; and Pixabay, to obtain pictures.

Information relayed back to the user includes:
  - departure date
  - return date
  - days until departure
  - trip duration
  - country
  - temperature at destination
  - general forecast at destination
  - chance of precipitation
  - high temperature
  - low temperature

## Running the App

### Run in Production Mode

  - `npm install`, `npm run build` and `npm start` to begin
  - open localhost:3000 in web browser

### Run in Development Mode

  - `npm install`, `npm run dev` and `npm start` to begin
  - page will automatically open

## Extending the Project

Added functionality:
  - add end date and display length of trip
  - pull in an image for the country from Pixabay API when the entered location brings up no results
  - incorporate icons into forecast

## Testing

Testing is set up with Jest, run `npm test` to run the current tests

## Deployment

Site is deployed on Heroku at: https://travel-mate-2020.herokuapp.com/ but is currently down as it is undergoing changes