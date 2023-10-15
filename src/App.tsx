import { useRef, Suspense } from 'react'
import axios from 'axios'
import { theme } from './theme'
import LoadingModal from './components/LoadingModalRef'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import Loader from './components/Loader'
import Routes from './routes/routes'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { waringAlert } from './utils/SweetAlert'
import { useDispatch } from 'react-redux'
import { clearUser } from './stores/slice/user.slice'
import "dayjs/locale/th";

function App() {
  const loadingModalRef = useRef<{ setOpen: (open: boolean) => void } | null>(null)
  const userDispatch = useDispatch()
  
  axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3001/api"
  axios.interceptors.request.use(
    (config) => {
      if (loadingModalRef.current) {
        loadingModalRef.current.setOpen(true)
      }
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      if (loadingModalRef.current) {
        loadingModalRef.current.setOpen(false)
      }
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      if (loadingModalRef.current) {
        loadingModalRef.current.setOpen(false)
      }
      return response;
    },
    async function (error) {
      if (loadingModalRef.current) {
        loadingModalRef.current.setOpen(false)
      }
      if (error.response.status === 401) {
        waringAlert(error.response.data.message).then(() => {
          localStorage.removeItem("access-token");
          userDispatch(clearUser())
          window.location.href = '/'
        })
      } else if (error.response.status === 400) {
        waringAlert(error.response.data.message)
      }
    }
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='th'>
        <div className="app" style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
          <Suspense fallback={<Loader />}>
            <Routes />
          </Suspense>
          <LoadingModal ref={loadingModalRef} setOpen={() => { }} />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
