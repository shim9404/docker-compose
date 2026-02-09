import React, { useState } from 'react'
import { DividerDiv, DividerHr, DividerSpan, GoogleButton, KakaoButton, LoginForm, MyH1, MyInput, MyLabel, MyP, PwEye, SubmitButton } from '../styles/FormStyles'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMemberInfo } from '../../redux/userInfoSlice'

const LoginView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tempUser, setTempUser] = useState({
        email: '',
        password:''
    })
    const changeUser = (e) => {
        const id = e.currentTarget.id 
        const value = e.target.value 
        setTempUser({...tempUser, [id]: value})
    }
    //동일한 input type=text를 이메일인 경우에는 입력값을 노출하고 비번일 때는 히든 처리해야 함.
    const [passwordType, setPasswordType] = useState({
        type: 'password', 
        visible: false
    })

    //사용자 안내 메세지
    const [loginError, setLoginError] = useState('');
    //이메일 로그인
    const loginE = async() => {
        setLoginError('');
        try{
            const response = await axios.post(`${import.meta.env.VITE_SPRING_IP}auth/signin`, tempUser);
            console.log(response);
            window.localStorage.setItem("id", response.data.id);
            window.localStorage.setItem("role", response.data.role);
            window.localStorage.setItem("accessToken", response.data.accessToken);
            window.localStorage.setItem("refreshToken", response.data.refreshToken);
            window.localStorage.setItem("email", response.data.email);
            window.localStorage.setItem("username", response.data.username);

            dispatch(setMemberInfo({
                id: response.data.id,
                email: response.data.email,
                username: response.data.username,
                role: response.data.role
            }))

            navigate("/home");
        } catch (error) {
            console.log(error.response);
            console.log(error.response.data);
            const message = error.response.data.message;
            if (message == "비밀번호가 맞지 않습니다.") {
                setLoginError('비밀번호가 맞지 않습니다. 다시 입력해 주세요.')
                setTempUser((prev) => ({...prev, password: ''}));
            } else {
                setLoginError(message || '로그인에 실패했습니다. 다시 시도해 주세요.')
            }   

            // if (message == "이메일이 존재하지 않습니다."){

            // }

            console.error("로그인 실패: "+error);
        }
    }  

    const loginG = async() => {
        console.log('구글 로그인');
        const googleUrl = "https://accounts.google.com/o/oauth2/auth"
        const googleClientId =`${import.meta.env.VITE_GOOGLE_CLIENTID}`
        const googleRedirectUrl = "http://localhost:5173/oauth/google/redirect"
        const googleScope = "openid profile email"
        try {
            const auth_uri = `${googleUrl}?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&response_type=code&scope=${googleScope}`
            console.log(auth_uri);
            window.location.href = auth_uri
        } catch (error) {
            console.error("구글 로그인 실패!!!", error);
        }

    }
    const loginK = async () => {
        console.log('카카오로그인');
        const kakaoUrl = "https://kauth.kakao.com/oauth/authorize";
        const kakaoClientId = `${import.meta.env.VITE_KAKAO_CLIENTID}`;
        const kakaoRedirectUrl = "http://localhost:5173/oauth/kakao/redirect";
        
        try {
            const auth_uri = `${kakaoUrl}?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code`;
            console.log(auth_uri);
            // 브라우저가 없어도 요청 가능
            window.location.href = auth_uri;
        } catch (error) {
            console.error("카카오 인증 코드 가져오기 실패", error);
        }
    };
    const passwordView =(e) => {
        const id = e.currentTarget.id 
        if(id === "password"){
            if(!passwordType.visible){
                //<input type=text />
                setPasswordType({...passwordType, type:'text', visible: true})
            }else{
                //<input type=password />
                setPasswordType({...passwordType, type:'password', visible: false})
            }
        }
    }
    const [submitBtn, setSubmitBtn] = useState({
        disabled: true, 
        bgColor: 'rgb(175, 210, 244)',
        hover: false
    })    
    const toggleHover =() => {
        if(submitBtn.hover){
            setSubmitBtn({...submitBtn, hover:false, bgColor:'rgb(105,175,245)'})
        }else{
            setSubmitBtn({...submitBtn, hover:true, bgColor:'rgb(58,129,200)'})
        }
    }    
  
  return (
    <>
        <LoginForm>
        <MyH1>로그인</MyH1>
        <MyLabel htmlFor="email"> 이메일     
            <MyInput type="email" id="email" name="email" placeholder="이메일를 입력해주세요." 
            onChange={(e)=>changeUser(e)}/>   
        </MyLabel>
        <MyLabel htmlFor="password"> 비밀번호
            <MyInput type={passwordType.type} autoComplete="off" id="password" name="password" placeholder="비밀번호를 입력해주세요."
            onChange={(e)=>changeUser(e)}/>
            <div id="pw" onClick={(e)=> {passwordView(e)}} style={{color: `${passwordType.visible?"gray":"lightgray"}`}}>
            <PwEye className="fa fa-eye fa-lg"></PwEye>
            </div>
        </MyLabel>
        
        {loginError && (
            <MyP style={{color: "red"}}>{loginError}</MyP>
        )}

        <SubmitButton type="button" style={{backgroundColor:submitBtn.bgColor}}  
            onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={loginE}>
            로그인
        </SubmitButton>
        <DividerDiv>
            <DividerHr />
            <DividerSpan>또는</DividerSpan>
        </DividerDiv>
        <GoogleButton type="button" onClick={loginG}>
            <i className= "fab fa-google-plus-g" style={{color: "red", fontSize: "18px"}}></i>&nbsp;&nbsp;Google 로그인
        </GoogleButton>
        <KakaoButton type="button" onClick={loginK}>
            <span style={{color: "red", fontSize: "18px"}}></span>&nbsp;&nbsp;Kakao 로그인
        </KakaoButton>
        <MyP style={{marginTop:"10px"}}>신규 사용자이신가요?&nbsp;<Link to="/joinForm" className="text-decoration-none" style={{color: "blue"}}>계정 만들기</Link></MyP>
        <MyP>이메일를 잊으셨나요?&nbsp;<Link to="/login/findEmail" className="text-decoration-none" style={{color: "blue"}}>이메일 찾기</Link></MyP>
        <MyP>비밀번호를 잊으셨나요?&nbsp;<Link to="/login/resetPwd" className="text-decoration-none" style={{color: "blue"}}>비밀번호 변경</Link></MyP>
        </LoginForm>      
    </>
  )
}

export default LoginView