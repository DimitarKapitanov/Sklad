import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import 'semantic-ui-css/semantic.min.css';
import { router } from './app/api/router/Routes';
import './app/layout/styles/styles.scss';
import { StoreContext, store } from './app/stores/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
)
