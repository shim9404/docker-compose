import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const JoinPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });


  // 사용자가 입력한 4가지 정보 초기화 하기
  const handleChange = (event) => {
    const {id, value} = event.target;
    setFormData({
      ...formData,
      [id] : value
    })
    console.log(id);
    console.log(value)
  } // end of handleChange

  const handleSignup = async() => {
    if (formData.username == null || formData.email == null || formData.password == null || formData.role == null) {
      console.log("데이터 불충분")
      return;
    }

    // insert
    try {
      const response = await axios.post(`${import.meta.env.VITE_SPRING_IP}auth/signup`,  formData);
      console.log(response);
      navigate("/")
    } catch (e) {
      console.error("회원가입 실패 ",e);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login")
  }

  return (
    <>
      <div className="row my-5 justify-content-center">
        <div className="col-8 col-md-6 col-lg-4">
          <h3 className="text-center mb-5">회원가입</h3>
          <form className="frm">
          <div className="input-group my-2">
            <div className="input-group-text">이 름</div>
            <input 
                className="form-control" 
                id='username'
                name="username" 
                type="text"
                placeholder="이름을 입력해주세요"
                value={formData.username}
                onChange={handleChange}
            />
          </div>
          <div className="input-group my-2">
              <div className="input-group-text">이 메 일</div>
              <input 
                  className="form-control" 
                  id='email'
                  name="email" 
                  type='text'
                  value={formData.email}
                  onChange={handleChange}
              />
          </div>
          <div className="input-group my-2">
              <div className="input-group-text">비밀번호</div>
              <input
                  className="form-control"
                  id='password'
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
              />
          </div>
          <div className="input-group my-2">
              <div className="input-group-text">권 한</div>
              <select 
                  className="form-select" 
                  id='role'
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
              >
                  <option value="ROLE_USER">ROLE_USER</option>
                  <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              </select>
          </div>
          <div className="my-3">
              <button className="btn btn-success w-100" type="button" onClick={handleSignup}>회원가입</button>
          </div>
          <div className="text-end mt-3">
            <button className="btn btn-link" onClick={handleLogin}>
              로그인
            </button>
          </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default JoinPage
