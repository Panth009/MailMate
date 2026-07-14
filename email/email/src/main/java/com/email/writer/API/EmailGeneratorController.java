package com.email.writer.API;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.email.writer.DTO.EmailRequest;
import com.email.writer.Service.EmailGeneratorImpl;

@Controller
@RequestMapping("/api/email")
@CrossOrigin
public class EmailGeneratorController
{
	@Autowired
	EmailGeneratorImpl emailGeneratorImpl;
	
	@PostMapping("/generate")
	public ResponseEntity<String> EmailGenerator(@RequestBody EmailRequest emailRequest)
	{
		return ResponseEntity.ok(emailGeneratorImpl.emailReplyGenerator(emailRequest));
//		return new ResponseEntity<String>(email,HttpStatus.OK);
	}
}
