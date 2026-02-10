import styles from './noticeList.module.css'
import { Button, Form, Modal } from 'react-bootstrap'

const NoticeDetail = () => {

  return (
    <>
      <Header />
      <div className={`container ${styles.noticeListWrap}`}>
        <div className='page-header'>
          <h2>공지사항 <Megaphone size={28} strokeWidth={1.8} className="align
middle me-1 text-danger" aria-hidden /> <small>상세보기</small></h2>
          <hr />
        </div>
        <Card style={{ width: '58rem' }}>
          <Card.Body className="py-2">
            {notice.createDate != null && (
              <small className="text-muted">{formatDateTime(notice.createDate)}
              </small>
            )}
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>제목 : {notice.title}</ListGroupItem>
            <ListGroupItem>작성자 : {notice.writer}</ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Form.Group className="mb-0">
              <Form.Control
                as="textarea"
                readOnly
                value={notice.content ?? ''}
                rows={10}
                className="bg-light"
                style={{ resize: 'vertical', minHeight: '200px' }}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        <hr />
        <div className={`detail-link ${styles.buttonFooter}`}>
          <Button variant="success" onClick={handleShow}>
            수정
          </Button>
          &nbsp;
          <Button variant="danger" onClick={noticeDelete}>
            삭제
          </Button>
          &nbsp;
          <Button variant="warning" onClick={noticeList}>
            목록
          </Button>
          {/* 
<Link to="/board" variant="primary" className='nav-link'>공지목록</Link> */}
        </div>
      </div>
      <Footer />
      {/* ================ [[ 공지등록 모달 시작 ]] =================*/}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>공지수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="f_board">
            <Form.Group className="mb-3" controlId="boardTitle">
              <Form.Label>제목</Form.Label>
              <Form.Control type="text" name="title" value={notice.title}
                onChange={handleChangeForm} placeholder="Enter 제목" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="boardWriter">
              <Form.Label>작성자</Form.Label>
              <Form.Control type="text" name="writer" value={notice.writer}
                onChange={handleChangeForm} placeholder="Enter 작성자" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="boardContent">
              <Form.Label>내용</Form.Label>
              <textarea className="form-control" name='content' value=
                {notice.content} onChange={handleChangeForm} rows="3"></textarea>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={noticeUpdate}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}
export default NoticeDetail
