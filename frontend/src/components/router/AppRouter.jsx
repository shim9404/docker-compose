import HomePage from '../pages/HomePage'
import BoardPage from '../pages/BoardPage'
import { Route, Routes } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import MyPage from '../pages/mypage/MyPage';
import ErrorPage from '../pages/error/ErrorPage';
import AdminPage from '../pages/admin/AdminPage';
import { useSelector } from 'react-redux';


const AppRouter = () => {
  //const myRole = window.localStorage.getItem("role");
  const memberData = useSelector((state) => state.userInfoSlice);

  return (
    <Routes>
      {/* 누구나 접근 가능(로그인 이후 영역이므로 AuthProvider는 통과한 상태) */}
      <Route path='/home' element={<HomePage/>}/>
      {/* 게시판 */}
      <Route path='/board'
            element= {
              <PrivateRouter role={memberData.role} allowedRoles={['ROLE_USER', 'ROLE_MANAGER', 'ROLE_ADMIN']}>
                <BoardPage/>
              </PrivateRouter>
            }
      />
      {/* 관리자 페이지 */}
      <Route path='/admin'
            element= {
              <PrivateRouter role={memberData.role} allowedRoles={['ROLE_ADMIN']}>
                <AdminPage/>
              </PrivateRouter>
            }
      />
      {/* 마이페이지(대시보드) */}
      <Route path='/mypage'
            element= {
              <PrivateRouter role={memberData.role} allowedRoles={['ROLE_USER']}>
                <MyPage/>
              </PrivateRouter>
            }
      />
      {/* 권한이 없을때 보내는 페이지 */}
      <Route path='/error'
        element= {<ErrorPage/>}
      />
    </Routes>
  )
}

export default AppRouter
