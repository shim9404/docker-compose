import { useEffect, useState } from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
  const memberData = useSelector((state) => state.userInfoSlice);
  // const myRole = window.localStorage.getItem("role");

  const navigate = useNavigate();

  //로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  
  
  useEffect(()=>{
    const token = window.localStorage.getItem("accessToken");
    const name = window.localStorage.getItem("username");
    const email = window.localStorage.getItem("email");

    if(token){
      setIsLoggedIn(true);
      setUsername(name);
      setEmail(email);

    }
  },[])

  const onLogout = () => {
    setIsLoggedIn(false)
    window.localStorage.clear()
    navigate("/");
  }
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/home" className="nav-link">Home</Link>
              {['ROLE_USER', 'ROLE_MANAGER' ,'ROLE_ADMIN'].includes(memberData.role) && (
                <>
                  <Link to="/notice" className="nav-link">공지사항</Link>
                  <Link to="/board" className="nav-link">게시판</Link>
                </>
              )}
              {isLoggedIn && memberData.role==="ROLE_USER" && (<Link to="/mypage" className="nav-link">마이페이지</Link>)}
              {isLoggedIn && memberData.role==="ROLE_ADMIN" && (<Link to="/admin" className="nav-link">관리자페이지</Link>)}
              {!isLoggedIn && <Link to="/login" className="nav-link">로그인</Link>}
            </Nav>
            {isLoggedIn && <a>{email}</a>}
            &nbsp;
            {isLoggedIn && <Button className="btn btn-danger" onClick={onLogout}>로그아웃</Button>}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header