import "../styles/globals.css";
import store from "../redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { loadUser } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthLoader>
        <Component {...pageProps} />
      </AuthLoader>
    </Provider>
  );
}

function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(loadUser()).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return children;
}

export default App;
