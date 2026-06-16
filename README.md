# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Unit Assignment: Flixster

Submitted by: **[Your Name]**

Estimated time spent: **[#]** hours spent in total

Deployed Application (optional): [Flixster Deployed Site](ADD_LINK_HERE)

### Application Features

#### REQUIRED FEATURES

- [x] **Display Movies**
  - [x] Users can view a list of current movies from The Movie Database API in a grid view.
    - [x] Movie tiles are reasonably sized (4-5 per row on desktop, responsive on mobile)
  - [x] For each movie displayed, users can see the movie's:
    - [x] Title
    - [x] Poster image
    - [x] Vote average
  - [x] Users can load more current movies by clicking a button which adds more movies to the grid without reloading the entire page. 
- [x] **Search Functionality**
  - [x] Users can use a search bar to search for movies by title.
  - [x] The search bar includes:
    - [x] Text input field
    - [x] Submit/Search button
    - [x] Clear button
  - [x] Movies with a title containing the search query are displayed in a grid view when the user either:
    - [x] Presses the Enter key
    - [x] Clicks the Submit/Search button
  - [x] Users can click the Clear button. When clicked:
    - [x] All text in the text input field is deleted
    - [x] The search results are cleared and all current movies are displayed
- [x] **Design Features**
  - [x] Website implements all of the following accessibility features:
    - [x] Semantic HTML (`<header>`, `<main>`, `<footer>`, `<button>`)
    - [x] [Color contrast](https://webaim.org/resources/contrastchecker/) (all combinations exceed 4.5:1 ratio)
    - [x] Alt text for images (all posters and backdrops have descriptive alt text)
  - [x] Website implements responsive web design.
    - [x] Uses CSS Grid with auto-fill and minmax for responsive layout
    - [x] Movie tiles and images shrink/grow in response to window size
  - [x] Users can click on a movie tile to view more details about a movie in a pop-up modal.
    - [x] The pop-up window is centered in the screen and does not occupy the entire screen.
    - [x] The pop-up window has a shadow to show that it is a pop-up and appears floating on the screen.
    - [x] The backdrop of the pop-up appears darker (75% opacity black overlay)
    - [x] The pop-up displays additional details about the movie including:
      - [x] Runtime in minutes (formatted as "Xh Ym")
      - [x] Backdrop poster
      - [x] Release date (formatted as "Month Day, Year")
      - [x] Genres (displayed as styled tags)
      - [x] An overview
  - [x] Users can use a drop-down menu to sort movies.
    - [x] Drop-down allows movies to be sorted by:
      - [x] Title (alphabetic, A-Z)
      - [x] Release date (chronologically, most recent to oldest)
      - [x] Vote average (descending, highest to lowest)
    - [x] When a sort option is clicked, movies display in a grid according to selected criterion.
  - [x] Website displays:
    - [x] Header section
    - [x] Search bar
    - [x] Sort control
    - [x] Movie grid
    - [x] Footer section
- [x] **Planning Documentation**
  - [x] Repository includes a `planning.md` file with:
    - [x] A **Component Architecture** section listing 8 components with responsibilities, rendering details, and props
    - [x] An **API Contracts** section documenting 4 API endpoints (TMDb Now Playing, Search, Details, and OpenRouter AI)
    - [x] A **State Architecture** section listing 9 state variables with complete details
    - [x] A **Data Flow** section explaining how data flows from API to components
- [x] **AI Watch Recommendation**
  - [x] When a movie's detail modal is opened, an AI-generated watch recommendation is displayed alongside the movie details.
  - [x] A loading state is shown while the AI response is being generated
  - [x] A graceful fallback message is shown if the AI call fails
  - [x] `planning.md` includes an **AI Feature Spec** with comprehensive documentation and decisions log

#### STRETCH FEATURES

- [ ] **Deployment**
  - [ ] Website is deployed via Render.
  - [ ] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: For ease of grading, please use the deployed version of your website when creating your walkthrough. 
- [x] **Embedded Movie Trailers**
  - [x] Within the pop-up modal displaying a movie's details, the movie trailer is viewable.
    - [x] Official YouTube trailer is embedded in the modal
    - [x] Fetches trailer from TMDb Videos API endpoint
    - [x] Prioritizes official trailers over unofficial ones
    - [x] Responsive 16:9 aspect ratio container
    - [x] Users can play, pause, and fullscreen the trailer
    - [x] Falls back gracefully if no trailer is available
- [x] **Favorite Button**
  - [x] For each movie displayed, users can favorite the movie.
  - [x] There is a heart icon (🤍/❤️) on each movie's tile to show whether or not the movie has been favorited.
  - [x] If the movie is not favorited:
    - [x] Clicking on the heart icon marks the movie as favorited
    - [x] The heart changes from white (🤍) to red (❤️) and the button background changes color
  - [x] If the movie is already favorited:
    - [x] Clicking on the heart icon marks the movie as *not* favorited.
    - [x] The heart changes from red (❤️) back to white (🤍)
  - [x] Action buttons appear on hover (desktop) or are always visible (mobile)
- [x] **Watched Checkbox**
  - [x] For each movie displayed, users can mark the movie as watched.
  - [x] There is an eye icon (👀/👁️) on each movie's tile to show whether or not the movie has been watched.
  - [x] If the movie has not been watched:
    - [x] Clicking on the eye icon marks the movie as watched
    - [x] The icon changes from double eyes (👀) to single eye (👁️) and the button background changes color
  - [x] If the movie is already watched:
    - [x] Clicking on the eye icon marks the movie as *not* watched.
    - [x] The icon changes from single eye (👁️) back to double eyes (👀)
  - [x] Action buttons appear on hover (desktop) or are always visible (mobile)
  - [x] Note: Favorite and watched status reset on page reload (not persisted)
- [ ] **Sidebar**
  - [ ] The website includes a side navigation bar.
  - [ ] The sidebar has three pages:
    - [ ] Home
    - [ ] Favorites
    - [ ] Watched
  - [ ] The Home page displays all current movies in a grid view, the search bar, and the sort movies drop-down.
  - [ ] The Favorites page displays all favorited movies in a grid view.
  - [ ] The Watched page displays all watched movies in a grid view.

### Walkthrough Video

`TODO://` Paste the **shareable link** to your animated app walkthrough below (replace `ADD_LOOM_LINK_HERE`). GitHub markdown won't render an embedded Loom player, so a plain link is what graders will use. Make sure the link is public and playable before submitting. Ensure your walkthrough showcases the presence and/or functionality of all features you implemented above (check them off as you film!). Pay attention to any **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS** checkboxes listed above to ensure graders see the full functionality of your website. (🚫 Remove this paragraph after adding your walkthrough link.)

**Walkthrough video:** [Flixster Walkthrough](ADD_LOOM_LINK_HERE)

### Reflection

* Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

Add your response here

* If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.
  
Add your response here

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

Add your response here

### Open-source libraries used

- Add any links to open-source libraries used in your project.

### Shout out

Give a shout out to somebody from your cohort that especially helped you during your project. This can be a fellow peer, instructor, TA, mentor, etc.