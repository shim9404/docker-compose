package com.example.demo.controller;

import com.example.demo.dto.NoticeRequest;
import com.example.demo.dto.NoticeResponse;
import com.example.demo.dto.NoticeSearchConditon;
import com.example.demo.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/notice")
public class NoticeController {
    private final NoticeService noticeService;

    @GetMapping("/list")
    public ResponseEntity<List<NoticeResponse>> list(@ModelAttribute NoticeSearchConditon noticeSearchConditon){
        List<NoticeResponse> response = noticeService.search(noticeSearchConditon);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping("/{no}")
    public ResponseEntity<NoticeResponse> getOne(@PathVariable Long no){
        NoticeResponse response = noticeService.findById(no);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<NoticeResponse> create(@Valid @RequestBody NoticeRequest noticeRequest){
        NoticeResponse response = noticeService.save(noticeRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{no}")
    public ResponseEntity<NoticeResponse> update(@PathVariable Long no, @Valid @RequestBody NoticeRequest noticeRequest){
        NoticeResponse response = noticeService.update(no, noticeRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<NoticeResponse> delete(@PathVariable Long no){
        noticeService.delete(no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

}
