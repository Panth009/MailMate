package com.email.writer.Service;

import com.email.writer.DTO.EmailRequest;

public interface EmailGeneratorService 
{
	public String emailReplyGenerator(EmailRequest emailRequest);
}
