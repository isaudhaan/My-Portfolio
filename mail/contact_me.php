// Check for empty fields
// if (
// empty($_POST['name']) ||
// empty($_POST['email']) ||
// empty($_POST['phone']) ||
// empty($_POST['message']) ||
// !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)
// ) {
// echo "No arguments Provided!";
// return false;
// }

// $name = strip_tags(htmlspecialchars($_POST['name']));
// $email_address = strip_tags(htmlspecialchars($_POST['email']));
// $phone = strip_tags(htmlspecialchars($_POST['phone']));
// $message = strip_tags(htmlspecialchars($_POST['message']));

// // Create the email and send the message
// $to = 'yourname@yourdomain.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
// $email_subject = "Website Contact Form: $name";
// $email_body = "You have received a new message from your website contact form.\n\n" . "Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
// $headers = "From: noreply@yourdomain.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
// $headers .= "Reply-To: $email_address";
// mail($to, $email_subject, $email_body, $headers);
// return true;

// MAIL_MAILER=smtp
// MAIL_HOST=sandbox.smtp.mailtrap.io
// MAIL_PORT=2525
// MAIL_USERNAME=3da746cfa8f88c
// MAIL_PASSWORD=****854c
// MAIL_ENCRYPTION=null
// MAIL_FROM_ADDRESS=noreply@yourapp.com
// MAIL_FROM_NAME="Digital Forms"

<?php
if (
    empty($_POST['name']) ||
    empty($_POST['email']) ||
    empty($_POST['phone']) ||
    empty($_POST['message']) ||
    !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)
) {
    echo "Invalid input!";
    return false;
}

$name = htmlspecialchars(strip_tags($_POST['name']));
$email_address = htmlspecialchars(strip_tags($_POST['email']));
$phone = htmlspecialchars(strip_tags($_POST['phone']));
$message = htmlspecialchars(strip_tags($_POST['message']));

// Set your destination email
$to = 'support@yourwebsite.com';
$email_subject = "Website Contact Form: $name";
$email_body = "You have received a new message from your website contact form.\n\n" .
    "Details:\n" .
    "Name: $name\n" .
    "Email: $email_address\n" .
    "Phone: $phone\n" .
    "Message:\n$message";

$headers = "From: noreply@yourwebsite.com\r\n";
$headers .= "Reply-To: $email_address\r\n";

// Send mail
if (mail($to, $email_subject, $email_body, $headers)) {
    echo "Message sent successfully!";
    return true;
} else {
    echo "Failed to send message.";
    return false;
}
?>