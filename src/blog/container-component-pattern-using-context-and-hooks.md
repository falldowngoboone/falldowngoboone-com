---
title: React Presentational and Container Components Using Context and Hooks
blurb: An updated version of a useful pattern with new APIs
date: 2019-09-15
updated: 2020-09-08
currentmood: caffeinated
tags:
  - react
  - javascript
  - patterns
---

**Updated:** I've updated the code to export a named function, not an anonymous arrow function.

When I first started using React, I learned about [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) from Dan Abramov. This pattern prescribed splitting UI into smart (container) components that encapsulated state and logic, and dumb (presentational) components that simply presented data in a styled manner. In general, the containers were class components that managed state and lifecycle methods, whereas presentational components were stateless function components.

---

```jsx
// List.js

// presentational component
export default function List({ items = [] }) {
  return (
    <ul class="styled-list">
      {Boolean(items.length) &&
        items.map((item) => <li class="styled-item" {...item} />)}
    </ul>
  );
}

// MovieContainer.js

// container component
export default class MovieContainer extends React.Component {
  state = {
    movies: [],
  };

  async componentDidMount() {
    const movies = await movieService.fetch();
    this.setState({ movies });
  }

  render() {
    return typeof this.props.children === 'function'
      ? this.props.children(this.state)
      : React.Children.map(this.props.children, { movies: this.state.movies });
  }
}

// MovieList.js

// put it together (children as function FTW!)
export default function MovieList() {
  return (
    <MovieContainer>{({ movies }) => <List items={movies} />}</MovieContainer>
  );
}
```

This pattern both decouples views from logic and creates logic that is easily shared. If you need to represent albums as a list, replace `<MovieContainer />` with `<AlbumContainer />`. If you need to represent movies as a grid, replace `<List />` with a `<Grid />` component. This pattern is flexible and effective, but it was not without its problems.

First of all, this pattern makes use of class components, which, at least in my experience, bring with them all sorts of developer pain (React specifically; I'm not above using classes when appropriate). Second of all, lifecycle methods tend to break up related logic, so the more complex your components become, any changes introduced significantly increase the chance of bugs.

To address these problems (and [more](https://reactjs.org/docs/hooks-intro.html#motivation)), the React team introduced the Hooks API. Using Hooks, you can easily encapsulate complex logic without the use of class components. One result was the ability to have stateful function components.

Now that we can move logic into custom hooks, we no longer need container components that control state for us. We can handle calls to these hooks inside the presentational components themselves.

I pair the Context API with Hooks, particularly the `useContext` hook, to recreate the Presentational and Container Component pattern without any classes whatsoever:

```jsx
// List.js

export default function List({ items = [] }) {
  /* no changes */
}

// MovieProvider.js

export const MovieContext = React.createContext();

export function useMovies() {
  const context = React.useContext(MovieContext);
  if (!context) {
    throw new Error('Use inside context provider!');
  }
  return context;
}

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  React.useEffect(() => {
    // you can't pass async functions to Hooks
    movieService.fetch().then(setMovies);
  }, [setMovies]);
  return (
    <MovieContext.Provider value={movies}>{children}</MovieContext.Provider>
  );
}

// MovieList.js

export function MovieList() {
  const movies = useMovies();
  return <List items={movies} />;
}

// You need to wrap the component with the context
// provider somewhere. Here we've exported a "connected"
// version already wrapped. Don't do this if you need
// to consume a single provider in multiple components.
export default function ConnectedMovieList() {
  return (
    <MovieProvider>
      <MovieList />
    </MovieProvider>
  );
}
```

Note that the presentational `<List />` component remains unchanged, but now we are grabbing the `movies` state from a custom hook and applying it directly to `<List />` without the need for a child function. This ends up being so much more readable and, in my opinion, easier to follow compared to the original. The "Container" component becomes a combination of a context provider and hook.

It doesn't take much to imagine getting more types of state out of the `useMovies` hook, like a loading state or an error message in the case of service failure. When your state management becomes more complex, you can look at using the `useReducer` Hook in lieu of `useState`. In that case, it's recommended you pass the resulting `dispatch` method down in a separate context:

```jsx
// List.js

export default function List({ items = [] }) {
  /* no changes */
}

// MovieProvider.js

// now we have two contexts
export const MovieStateContext = React.createContext();
export const MovieDispatchContext = React.createContext();

export function useMovieState() {
  const state = React.useContext(MovieStateContext);
  if (!context) {
    throw new Error('Use inside context provider!');
  }
  return state;
}

export function useMovieDispatch() {
  const dispatch = React.useContext(MovieDispatchContext);
  if (!context) {
    throw new Error('Use inside context provider!');
  }
  return dispatch;
}

function MovieReducer(state, action) {
  /* reducer logic in here */
}

const initialState = {
  isLoading: false,
  error: '',
  movies: [],
};

export function MovieProvider({ children }) {
  const [movieState, dispatch] = React.useReducer(movieReducer, initialState);
  React.useEffect(() => fetchMovies(dispatch), [dispatch]);
  return (
    <MovieStateContext.Provider value={movieState}>
      <MovieDispatchContext.Provider value={dispatch}>
        {children}
      </MovieDispatchContext.Provider>
    </MovieStateContext.Provider>
  );
}

// completely ripped off from Kent C. Dodds and Dan Abramov;
// now you can async await all the things!
export async function fetchMovies(dispatch) {
  dispatch({ type: 'pending' });
  try {
    const movies = await movieService.fetch();
    dispatch({ type: 'success', payload: movies });
  } catch (error) {
    dispatch({ type: 'error', payload: error.message });
  }
}

// MovieList.js

export function MovieList() {
  const { isLoading, error, movies } = useMovies();
  return isLoading ? (
    <LoadingAnimation />
  ) : error ? (
    <Message type="error">{error}</Message>
  ) : (
    <List items={movies} />
  );
}

export default function ConnectedMovieList() {
  /* same as above */
}
```

This is pretty much how I structure my components now. The advantage of this pattern is that I can wrap components with providers that override state for use in Storybook or tests. I can also easily keep my styled presentational components separate from my logic.

Of course, now you have the overhead of understanding how closures can affect your values in Hooks. Also, Hooks have a strict set of guidelines you have to adhere to (only call Hooks inside a component or other Hook, don't call conditionally, don't call in loops, etc.). But if you can accept that, you can enjoy fewer bugs and more sharable logic.
