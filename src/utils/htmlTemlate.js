export const resetPasswordTemplate = (userName, link) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #FF5722;
      padding: 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 30px;
      text-align: center;
    }
    .body h2 {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .body p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }
    .btn {
      display: inline-block;
      padding: 12px 25px;
      font-size: 16px;
      color: white;
      background-color: #FF5722;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .btn:hover {
      background-color: #e64a19;
    }
    .footer {
      background-color: #f4f4f7;
      padding: 20px;
      font-size: 12px;
      text-align: center;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Affilio</h1>
    </div>
    <div class="body">
      <h2>Hello ${userName}!</h2>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>
      <a href="${link}" class="btn">Reset Password</a>
      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Affilio. All rights reserved. By egrif.online</p>
    </div>
  </div>
</body>
</html>
`;


export const withdrawalRequestTemplate = (userName, amount) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Withdrawal Request</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg,#22c55e,#15803d);
      padding: 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 30px;
      text-align: center;
    }
    .body h2 {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .body p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .amount-box {
      background-color: #f0fdf4;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 16px;
    }
    .footer {
      background-color: #f4f4f7;
      padding: 20px;
      font-size: 12px;
      text-align: center;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>Affilio</h1>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>Hello ${userName}! 👋</h2>

      <p>Your withdrawal request has been successfully submitted.</p>

      <div class="amount-box">
        <strong>Requested Amount:</strong> Rs.${amount}
      </div>

      <p>
        ⏳ Your payment will be processed within 
        <strong>3 to 5 business days</strong> and sent to your account.
      </p>

      <p>If you have any questions, feel free to contact support.</p>

      <p>Thanks for using Affilio 💚</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Affilio. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
`;


export const adminWithdrawalRequestReseveTemplate = (userName, email, amount, methodType, accountHolderName, accountNumber) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Withdrawal Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg,#ef4444,#b91c1c);
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .body {
      padding: 25px;
      color: #333;
    }
    .info-box {
      background: #f9fafb;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      font-size: 14px;
    }
    .footer {
      background: #f4f4f7;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background: #22c55e;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- Header -->
    <div class="header">
      <h2>🚨 Affilio New Withdrawal Request</h2>
    </div>

    <!-- Body -->
    <div class="body">
      <p>Hello Admin,</p>

      <p>A new withdrawal request has been submitted. Here are the details:</p>

      <div class="info-box">
        <p><strong>User Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Payment Method:</strong> ${methodType || "N/A"}</p>
        <p><strong>Account Holder Name:</strong> ${accountHolderName || "N/A"}</p>
        <p><strong>Account Number:</strong> ${accountNumber || "N/A"}</p>
      </div>

      <p>Please review and take action as soon as possible.</p>

      <!-- Optional button -->
      <a href="https://your-admin-panel.com" class="btn">Open Admin Panel</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Affilio Admin Notification</p>
    </div>

  </div>

</body>
</html>
`;


export const withdrawalRejectedTemplate = (userName, amount, reason) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Withdrawal Rejected</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 3px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg,#ef4444,#b91c1c);
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 30px;
      text-align: center;
      color: #333;
    }
    .body h2 {
      margin-bottom: 20px;
    }
    .amount-box {
      background: #fef2f2;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 16px;
    }
    .error {
      font-size: 18px;
      color: #dc2626;
      font-weight: bold;
      margin: 15px 0;
    }
    .reason-box {
      background: #fff7ed;
      padding: 12px;
      border-radius: 6px;
      margin-top: 15px;
      font-size: 14px;
      color: #92400e;
    }
    .footer {
      background: #f4f4f7;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>Affilio</h1>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>Hello ${userName},</h2>

      <p class="error">❌ Your withdrawal request has been rejected</p>

      <div class="amount-box">
        <strong>Requested Amount:</strong> Rs.${amount}
      </div>

      <p>
        Unfortunately, we were unable to process your withdrawal request at this time.
      </p>

      ${reason ? `
      <div class="reason-box">
        <strong>Reason:</strong> ${reason}
      </div>
      ` : ``}

      <p style="margin-top:20px;">
        Please review the details and try again. If you believe this was a mistake, contact support.
      </p>

      <p>
        Your balance has been safely returned to your account 💰
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Affilio. All rights reserved.</p>
    </div>

  </div>

</body>
</html>
`;



export const withdrawalApprovedTemplate = (userName, amount) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Withdrawal Approved</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 3px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg,#22c55e,#15803d);
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 30px;
      text-align: center;
      color: #333;
    }
    .body h2 {
      margin-bottom: 20px;
    }
    .amount-box {
      background: #ecfdf5;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 16px;
    }
    .success {
      font-size: 18px;
      color: #16a34a;
      font-weight: bold;
      margin: 15px 0;
    }
    .footer {
      background: #f4f4f7;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>Affilio</h1>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>Hello ${userName}! 🎉</h2>

      <p class="success">✅ Your withdrawal has been successfully processed!</p>

      <div class="amount-box">
        <strong>Amount Sent:</strong> Rs.${amount}
      </div>

      <p>
        💸 Your payment has been successfully sent to your account.  
        Please check your account balance.
      </p>

      <p>
        Thank you for using our platform 💚
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Affilio. All rights reserved.</p>
    </div>

  </div>

</body>
</html>
`;