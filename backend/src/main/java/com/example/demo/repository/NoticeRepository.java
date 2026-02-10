package com.example.demo.repository;

import com.example.demo.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    

    List<Notice> findByContentContainingOrderByNoDesc(String keyword);

    List<Notice> findByWriterContainingOrderByNoDesc(String keyword);

    List<Notice> findByTitleContainingOrderByNoDesc(String keyword);
}
