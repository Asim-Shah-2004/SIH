import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { Event } from '../models/index.js';

const createEmailTemplate = (user, event, qrCodeDataUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration Confirmation</title>
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: 'Arial', sans-serif;
      color: #2d3748;
      background-color: #f7fafc;
      padding: 20px;
    }
    
    .header {
      background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    
    .header h1 {
      margin: 0;
      font-size: 28px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    
    .event-card {
      background-color: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .event-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .event-type {
      display: inline-block;
      background-color: #ebf8ff;
      color: #4299e1;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 14px;
      margin-bottom: 15px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #edf2f7;
    }
    
    .detail-label {
      font-weight: bold;
      color: #4a5568;
      min-width: 120px;
    }
    
    .detail-value {
      color: #2d3748;
      text-align: right;
      flex: 1;
    }
    
    .speakers-section {
      margin: 25px 0;
    }
    
    .speaker-card {
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: #f8fafc;
      border-radius: 8px;
      margin: 10px 0;
    }
    
    .speaker-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 15px;
      object-fit: cover;
    }
    
    .speaker-info {
      flex: 1;
    }
    
    .speaker-name {
      font-weight: bold;
      margin: 0;
    }
    
    .speaker-role {
      color: #718096;
      font-size: 14px;
      margin: 5px 0;
    }
    
    .qr-section {
      text-align: center;
      background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
      padding: 30px;
      border-radius: 8px;
      margin: 25px 0;
      border: 2px dashed #e2e8f0;
    }
    
    .qr-code {
      width: 200px;
      height: 200px;
      margin: 20px auto;
    }
    
    .qr-title {
      color: #2d3748;
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    .qr-subtitle {
      color: #718096;
      font-size: 14px;
    }
    
    .sponsors-section {
      margin: 25px 0;
      text-align: center;
    }
    
    .sponsor-logos {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 15px;
    }
    
    .capacity-info {
      background-color: #f7fafc;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
    }
    
    .footer {
      text-align: center;
      padding: 20px;
      color: #718096;
      font-size: 12px;
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
    }
    
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      text-align: center;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Registration Confirmed! 🎉</h1>
    </div>
    
    <div class="content">
      <p>Dear ${user.fullName},</p>
      <p>Your registration for the following event has been confirmed:</p>
      
      <div class="event-card">
        <img src="${event.image}" alt="${event.title}" class="event-image">
        <span class="event-type">${event.type}</span>
        
        <div class="detail-row">
          <span class="detail-label">Event Name:</span>
          <span class="detail-value">${event.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${event.date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">${event.time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${event.location}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Price:</span>
          <span class="detail-value">$${event.price.toFixed(2)}</span>
        </div>
      </div>

      <div class="speakers-section">
        <h3>Featured Speakers</h3>
        ${event.speakers.map(speaker => `
          <div class="speaker-card">
            <img src="${speaker.image}" alt="${speaker.name}" class="speaker-image">
            <div class="speaker-info">
              <p class="speaker-name">${speaker.name}</p>
              <p class="speaker-role">${speaker.role}</p>
              <p class="speaker-company">${speaker.company}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="qr-section">
        <h3 class="qr-title">Your Event Ticket</h3>
        <p class="qr-subtitle">Present this QR code at check-in</p>
        <img src="${qrCodeDataUrl}" alt="Event QR Code" class="qr-code">
      </div>

      ${event.agenda ? `
        <div class="event-card">
          <h3>Event Agenda</h3>
          <p>${event.agenda}</p>
        </div>
      ` : ''}

      ${event.sponsors && event.sponsors.length > 0 ? `
        <div class="sponsors-section">
          <h3>Event Sponsors</h3>
          <div class="sponsor-logos">
            ${event.sponsors.map(sponsor => `
              <img src="${sponsor}" alt="Sponsor logo" style="height: 40px; width: auto;">
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="capacity-info">
        <p>Event Capacity: ${event.registeredCount} / ${event.maxCapacity || 'Unlimited'}</p>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/events/${event._id}" class="button">
          View Event Details
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>If you have any questions, please contact our support team.</p>
      ${event.maxCapacity ? `<p>This event has limited capacity. Early arrival is recommended.</p>` : ''}
    </div>
  </div>
</body>
</html>
`;

export default createEmailTemplate;