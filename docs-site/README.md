# Humanoid Robotics Book - Spec-Driven Hackathon 1

This repository contains the Humanoid Robotics Book project with comprehensive Urdu translation functionality. This is a Docusaurus-based documentation site that provides educational content about humanoid robotics with multilingual support.

## Features

- Complete documentation on humanoid robotics concepts
- English and Urdu language support
- Right-to-left (RTL) layout for Urdu content
- Enhanced translation functionality with real Urdu technical terminology
- Removed non-functional elements for improved user experience

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Project Structure

- `docs/` - English documentation files
- `i18n/ur/` - Urdu translations and locale-specific content
- `src/` - Source code for custom components
- `static/` - Static assets like images

## Urdu Translation

The project includes comprehensive Urdu translations for all documentation chapters, with special attention to technical robotics terminology. Chapter 2 has been enhanced with additional Urdu content as requested.

## Deployment

Using GitHub Pages:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
