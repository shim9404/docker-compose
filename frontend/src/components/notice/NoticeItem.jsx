import { Link } from "react-router-dom";



const NoticeItem = (props) => {

  const no = props.notice.no;
  const title = props.notice.title;
  const writer = props.notice.writer;

  return (
    <>
      <tr>
        <td>{no}</td>
        <td>
          {/* 
<Route path="/notice/:n_no" exact={true} element=
{<NoticeDetail />}/> */}
          <Link to={`/notice/${no}?page=${props.page}`} className='btn btn dark'>{title}</Link>
        </td>
        <td>{writer}</td>
      </tr>
    </>
  )
}

export default NoticeItem
