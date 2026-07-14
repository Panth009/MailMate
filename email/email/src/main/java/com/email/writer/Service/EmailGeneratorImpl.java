package com.email.writer.Service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.writer.DTO.EmailRequest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;


@Service
public class EmailGeneratorImpl implements EmailGeneratorService
{
//	public EmailGeneratorImpl(WebClient.Builder webClientBuilder) 
//	{
//		this.webClient = webClientBuilder.build();
//	}
	
	@Value("${gemini.api.url}")
	private String geminiAPIUrl;
	
	@Value("${gemini.api.key}")
	private String geminiAPIKey;
	
	private final WebClient webClient = WebClient.create();

	
	
	@Override
	public String emailReplyGenerator(EmailRequest emailRequest) 
	{
		
		
		// Step-1 Build A Prompt
	
		String prompt = buildPrompt(emailRequest);
		
		// Step-2 Craft A Request / Format The Request
		
		Map<String, Object> requestBody = Map.of(
				"contents", new Object[] {
						 Map.of("parts", new Object[] {
								 Map.of("text", prompt)
						 })
				});
		
		// Step-3 Do The Request And Get Response
		
		String response = webClient.post()
		        .uri(geminiAPIUrl + geminiAPIKey)
		        .header("Content-Type", "application/json")
		        .bodyValue(requestBody)   // <-- Add this
		        .retrieve()
		        .bodyToMono(String.class)
		        .block();
		
		// Step-4 Send The Response By Fetching It. 
		return extractActualResponse(response);
	}

	private String buildPrompt(EmailRequest emailRequest) 
	{
		String tone;
		if(emailRequest.getTone() == null) 
		{
			tone = "professonal";
		}
		else 
		{
			tone = emailRequest.getTone();
		}
		
		StringBuilder prompt = new StringBuilder();
		
		prompt.append("You received the following email. Write ONLY the recipient's reply in a ")
	      .append(tone)
	      .append(" tone. Do not rewrite or paraphrase the original email. Do not include a subject line.\n\n")
	      .append(emailRequest.getEmailContent());		
		return prompt.toString();
	}
	
	private String extractActualResponse(String response) 
	{
		try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
	}


	
}
