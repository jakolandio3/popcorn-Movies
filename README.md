# Popcorn-Movies

Popcorn-Movies is a React application for browsing and searching movies, built with modern web technologies.
The project demonstrates the use of React components, state management, and API integration. Users can explore popular movies, search for specific titles, and manage their personal movie collections. The application features a responsive design, star rating system, and detailed movie information fetched from a movie database API. It showcases practical implementation of React hooks, custom components, and local storage for state persistence.

![Popcorn-Movies](/public//Screenshot%202024-11-28%20191302.png)

[Visit Live Demo](https://popcorn-movies-nine.vercel.app/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Authors](#authors)
- [Feedback](#feedback)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/popcorn-movie-project.git
```

2. Navigate to the project directory:

```bash
cd popcorn-movie-project
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory and add your database credentials:

```bash
  REACT_APP_KEY=your-api-key
  REACT_APP_DATABASE=your-database-url
```

## Usage

1. Start the development server:

```bash
npm start
```

2. Open your browser and go to `http://localhost:3000` to view the application.

## Technologies Used

- **React**: A JavaScript library for building user interfaces, allowing for the creation of reusable UI components.
- **JavaScript**: The programming language used to build the logic and functionality of the application.
- **CSS**: Used for styling the application, ensuring a responsive and visually appealing design.
- **HTML**: The standard markup language for creating the structure of the web pages.
- **Movie Database API (e.g., TMDb)**: An external API used to fetch movie data, including details like titles, descriptions, and ratings.

## Features

- **Browse Popular Movies**: Explore a list of trending and popular movies fetched from the Movie Database API.
- **Search for Movies by Title**: Use the search functionality to find movies by their title, making it easy to locate specific films.
- **View Detailed Information**: Click on a movie to see detailed information, including the synopsis, release date, rating, and more.
- **Rating System**: Rate your movies with a star system and keep track of your favorites.
- **Personal Collections**: Keep track of all your movies including ratings, total time watched and details.
- **Responsive Design**: Enjoy a seamless experience on any device, as the application is designed to be fully responsive and mobile-friendly.

## Project Structure

```markdown
popcorn-movie-project/
├── public/
│ ├── index.html # The main HTML file for the application
│ └── favicon.ico # The favicon for the application
├── src/
│ ├── App.js # The root component of the application
│ ├── index.css # Global CSS styles
│ ├── index.js # Entry point of the React application
│ ├── StarRating.js # Component for the star rating system
│ ├── UseKey.js # Custom hook for handling key events
│ ├── UseLocalStorage.js # Custom hook for interacting with local storage
│ ├── UseMovies.js # Custom hook for fetching and managing movie data
├── .env # Environment variables file
├── .gitignore # Git ignore file
├── package.json # Project metadata and dependencies
└── README.md # Project documentation
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `REACT_APP_KEY`: The Database API key.
- `REACT_APP_DATABASE`: The Database API URL.

## Scripts

- `npm run start:` Start the development server.
- `npm run build`: Build the project for production.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Authors

- @jakolandio3

## Feedback

If you have any feedback, please reach out to me at [jakobdouglas.dev@gmail.com](mailto:jakobdouglas.dev@gmail.com)
