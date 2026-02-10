package com.example.demo.service;


import com.example.demo.dto.NoticeRequest;
import com.example.demo.dto.NoticeResponse;
import com.example.demo.dto.NoticeSearchConditon;
import com.example.demo.model.Notice;
import com.example.demo.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    @Transactional(readOnly = true)
    public List<NoticeResponse> search(NoticeSearchConditon noticeSearchConditon) {
        String gubun = noticeSearchConditon.getGubun();
        String keyword = noticeSearchConditon.getKeyword();

        List<Notice> notices;
        Sort orderByNoDesc = Sort.by(Sort.Direction.DESC, "no");
        log.info("gubun:: "+gubun);
        if ("title".equals(gubun)){
            notices = noticeRepository.findByTitleContainingOrderByNoDesc(keyword);
            log.info(notices);
        }else if("writer".equals(gubun)){
            notices = noticeRepository.findByWriterContainingOrderByNoDesc(keyword);
        }else if("content".equals(gubun)){
            notices = noticeRepository.findByContentContainingOrderByNoDesc(keyword);
        }else {
            log.info("전체조회");
            notices = noticeRepository.findAll(orderByNoDesc);
        }

        List<NoticeResponse> list = new ArrayList<>();
        for (Notice saved : notices) {
            list.add(
                    NoticeResponse.builder()
                            .no(saved.getNo())
                            .content(saved.getContent())
                            .title(saved.getTitle())
                            .writer(saved.getWriter())
                            .createDate(saved.getCreateDate())
                            .build()
            );
        }

        return list;
    }// end of search

    public NoticeResponse save(NoticeRequest noticeRequest) {
        Notice notice = new Notice();

        notice.setContent(noticeRequest.getContent());
        notice.setTitle(noticeRequest.getTitle());
        notice.setWriter(noticeRequest.getWriter());

        Notice saved = noticeRepository.save(notice);

        return NoticeResponse.builder()
                .no(saved.getNo())
                .content(saved.getContent())
                .title(saved.getTitle())
                .writer(saved.getWriter())
                .createDate(saved.getCreateDate())
                .build();
    } // end of save

    @Transactional
    public NoticeResponse update(Long no, NoticeRequest noticeRequest) {

        Notice notice = noticeRepository.findById(no).orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다. no="+no));

        notice.setContent(noticeRequest.getContent());
        notice.setTitle(noticeRequest.getTitle());
        notice.setWriter(noticeRequest.getWriter());

        Notice saved = noticeRepository.save(notice);

        return NoticeResponse.builder()
                .no(saved.getNo())
                .content(saved.getContent())
                .title(saved.getTitle())
                .writer(saved.getWriter())
                .createDate(saved.getCreateDate())
                .build();
    }

    public void delete(Long no) {
        if (!noticeRepository.existsById(no)){
            throw new IllegalArgumentException("공지사항을 찾을 수 없습니다. no="+no);
        }
        noticeRepository.deleteById(no);
    }

    @Transactional(readOnly = true)
    public NoticeResponse findById(Long no) {
        Notice saved = noticeRepository.findById(no)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다. no="+no));

        return NoticeResponse.builder()
                .no(saved.getNo())
                .content(saved.getContent())
                .title(saved.getTitle())
                .writer(saved.getWriter())
                .createDate(saved.getCreateDate())
                .build();
    }
}