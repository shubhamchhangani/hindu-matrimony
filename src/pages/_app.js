import "../styles/globals.css";
import store from "../redux/store";
import { Provider, useDispatch } from "react-redux";
import { loadUser } from "../redux/slices/authSlice";
import { useEffect } from "react";

function App({ Component, pageProps }) {
  return <Provider store={store}>
    <LoadUserWrapper>
    <Component {...pageProps} />
    </LoadUserWrapper>
  
</Provider>;
}

// A wrapper component to load the user session
function LoadUserWrapper({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return children;
}

export default App;