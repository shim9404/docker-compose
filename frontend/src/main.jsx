import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import JoinPage from './components/pages/JoinPage.jsx'
import AuthProvider from './AuthProvider.jsx'
import LoginView from './components/auth/LoginView.jsx'
import GoogleRedirect from './components/auth/GoogleRedirect.jsx'
import KakaoRedirect from './components/auth/KakaoRedirect.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
    {/* 전체 앱에서 redux store사용 가능하도록 provider감싸줌 */}
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/joinForm" element={<JoinPage />} />
          <Route path="/oauth/google/redirect" element={<GoogleRedirect />} />
          <Route path="/oauth/kakao/redirect" element={<KakaoRedirect />} />
          <Route path="/*" element={
            <AuthProvider>
              <App />
            </AuthProvider>
          }/>
        </Routes>
      </Provider>
    </BrowserRouter>
  </>
)