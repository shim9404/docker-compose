import { Form, Megaphone } from 'lucide-react';
import styles from './noticeList.module.css'
import { useEffect, useState } from 'react';
import { noticeListDB } from '../../service/noticeApi';
import { Button, Modal } from 'react-bootstrap';
import NoticeItem from './NoticeItem';


const NoticeList = () => {

  // 다시 그려야하는지 여부에 따라 state로 지정
  const [gubun, setGubun] = useState();         // title, content, writer
  const [keyword, setKeyword] = useState();
  const [notice, setNotice] = useState({
    title: '',
    writer: '',
    content: ''
  });

  const [show, setShow] = useState(false);

  const [notices, setNotices] = useState([]);

  const handleGubun = (e) => {
    setGubun(e.target.value);
  }

  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  }


  useEffect(() => {
    const asyncDB = async () => {
      const res = await noticeListDB({ gubun, keyword });
      setNotices(res.data);
      return res;
    }

    asyncDB();

  }, [])

  const noticeSearch = async () => {
    const res = await noticeListDB({ gubun, keyword });
    setNotice(res.data);
    return res;
  }

  const noticeList = () => {

  }

  const noticeAdd = () => {
    setShow(false);
  }

  const handleShow = (e) => {
    const username = window.localStorage.getItem('username');
    setNotice((prev) => ({ ...prev, writer: username }));
    setShow(true);
  }

  const handleClose = () => {

  }

  const handleChangeForm = () => {

  }

  return (
    <>
      <div className={`container ${styles.noticeListWrap}`}>
        <div className='page-header'>
          <h2>
            공지사항 <Megaphone size={28} strokeWidth={1.8} className="align middle me-1 text-danger" aria-hidden />{' '}
            <small>글목록</small>
          </h2>
          <hr />
        </div>
        <div className="row">
          <div className="col-sm-3">
            <select className="form-select" id="gubun" value={gubun} onChange=
              {handleGubun}>
              <option value="">분류선택</option>
              <option value="title">제목</option>
              <option value="writer">작성자</option>
              <option value="content">내용</option>
            </select>
          </div>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              placeholder="검색어를 입력하세요"
              id="keyword"
              onChange={handleKeyword}
              value={keyword}
            />
          </div>
          <div className="col-sm-3">
            <button type="button" className="btn btn-danger" onClick={noticeSearch}>검색</button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <NoticeItem key={index} notice={notice} page={""} />
            ))}
          </tbody>
        </table>
        <hr />
        <div className={styles.listFooter}>
          <button className="btn btn-warning" onClick={noticeList}>전체조회
          </button>
          <button className="btn btn-success" onClick={handleShow}>글쓰기</button>
        </div>
      </div>
      {/* ================ [[ 공지등록 모달 시작 ]] =================*/}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>글등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="f_notice">
            <Form.Group className="mb-3" controlId="boardTitle">
              <Form.Label>제목</Form.Label>
              <Form.Control type="text" name="title" onChange={handleChangeForm}
                placeholder="Enter 제목" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="boardWriter">
              <Form.Label>작성자</Form.Label>
              <Form.Control
                type="text"
                name="writer"
                value={notice.writer}
                onChange={handleChangeForm}
                placeholder="Enter 작성자"
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="boardContent">
              <Form.Label>내용</Form.Label>
              <textarea className="form-control" name="content" onChange=
                {handleChangeForm} rows="3"></textarea>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>닫기</Button>
          <Button variant="primary" onClick={noticeAdd}>저장</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default NoticeList;
