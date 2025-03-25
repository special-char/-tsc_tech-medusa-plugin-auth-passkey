const otpEmailTemplate = (otp: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        text-align: center;
        padding: 20px;
      }
      .container {
        max-width: 400px;
        margin: 0 auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin: 20px 0;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Your One-Time Password (OTP)</h2>
      <p>Please use the following OTP to proceed:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for a limited time only.</p>
      <p class="footer">If you did not request this, please ignore this email.</p>
    </div>
  </body>
  </html>
`;

export default otpEmailTemplate;
