package com.cafeManagement.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/19/2024
 */
@Slf4j
@Service
public class EmailUtils {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text, List<String> list) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("deathop17@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        if (list != null && !list.isEmpty()) message.setCc(getCcArray(list));
        emailSender.send(message);

    }

    private String[] getCcArray(List<String> ccList) {
        String[] cc = new String[ccList.size()];
        for (int i = 0; i < ccList.size(); i++) {
            cc[i] = ccList.get(i);
        }
        return cc;
    }

    public void forgotMail(String to, String subject, String password) throws MessagingException {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("deathop17@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlMsg = "<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b> " +
                    to + " <br><b>Password: </b> " + password + "<br><a href=\"http://localhost:4203/\">" +
                    "Click here to login</a></p>";
            message.setContent(htmlMsg, "text/html");
            emailSender.send(message);
        } catch (MailSendException e) {
            log.error("Failed to send email. Please check your SMTP server settings.", e);
            log.error("Exception message: " + e.getMessage());
            if (e.getFailedMessages() != null) {
                e.getFailedMessages().forEach((k, v) -> log.error("Failed message: " + v.getMessage()));
            }
            throw new MessagingException("Failed to send email", e);
        } catch (Exception e) {
            log.error("An unexpected error occurred while sending email", e);
            log.error("Exception class: " + e.getClass().getName());
            log.error("Exception message: " + e.getMessage());
            throw new MessagingException("Unexpected error", e);
        }
    }
}
