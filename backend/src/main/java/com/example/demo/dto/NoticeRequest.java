package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NoticeRequest {
    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 100)
    private String title;

    @NotBlank(message = "작성자는 필수입니다.")
    @Size(max = 50)
    private String writer;

    @NotBlank(message = "내용을 입력해주세요.")
    @Size(max = 200)
    private String content;
}
