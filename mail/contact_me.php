<?php
// Configure CONTACT_MAIL_TO and CONTACT_MAIL_FROM in the server environment.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond($status, $success, $code, $message) {
    http_response_code($status);
    echo json_encode(array('success' => $success, 'code' => $code, 'message' => $message));
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'method_not_allowed', 'Please submit using POST.');
}
if (!isset($_POST['website']) || !is_string($_POST['website'])) {
    respond(422, false, 'validation_error', 'Please use the contact form.');
}
if (trim($_POST['website']) !== '') {
    respond(422, false, 'spam_rejected', 'Your submission could not be accepted.');
}
$limits = array('name' => 100, 'email' => 254, 'phone' => 40, 'message' => 5000);
$fields = array();
foreach ($limits as $field => $limit) {
    if (!isset($_POST[$field]) || !is_string($_POST[$field])) {
        respond(422, false, 'validation_error', 'Please provide valid contact details and a message.');
    }
    if (strlen($_POST[$field]) > $limit * 4) {
        respond(422, false, 'validation_error', 'A contact field is too long.');
    }
    $value = preg_replace('/^\s+|\s+$/u', '', $_POST[$field]);
    if ($value === null) {
        respond(422, false, 'validation_error', 'Please use valid text in all fields.');
    }
    // Count UTF-16 units to match HTML maxlength, without requiring mbstring.
    $characters = preg_match_all('/./us', $value, $matches);
    $supplementary = preg_match_all('/[\x{10000}-\x{10FFFF}]/u', $value);
    if ($value === '' || $characters === false || $supplementary === false || $characters + $supplementary > $limit) {
        respond(422, false, 'validation_error', 'A required field is empty, invalid, or too long.');
    }
    if ($field !== 'message' && preg_match('/[\x00-\x1F\x7F]/', $value)) {
        respond(422, false, 'validation_error', 'Contact details must not contain control characters or line breaks.');
    }
    if ($field === 'message' && preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
        respond(422, false, 'validation_error', 'Your message contains unsupported control characters.');
    }
    $fields[$field] = $value;
}
if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'validation_error', 'Please enter a valid email address.');
}
$to = getenv('CONTACT_MAIL_TO');
$from = getenv('CONTACT_MAIL_FROM');
foreach (array($to, $from) as $address) {
    if (!is_string($address) || preg_match('/[\r\n]/', $address) || !filter_var($address, FILTER_VALIDATE_EMAIL)) {
        respond(503, false, 'mail_unavailable', 'The contact service is currently unavailable. Please try again later.');
    }
}
$subject = 'Portfolio contact message';
$body = "Name: " . $fields['name'] . "\nEmail: " . $fields['email'] .
    "\nPhone: " . $fields['phone'] . "\n\nMessage:\n" . $fields['message'];
$headers = "From: " . $from . "\r\nReply-To: " . $fields['email'] .
    "\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8";
try {
    $sent = function_exists('mail') && @mail($to, $subject, $body, $headers);
} catch (Throwable $error) {
    $sent = false;
}
if (!$sent) {
    respond(503, false, 'mail_unavailable', 'Your message could not be sent. Please try again later.');
}
respond(200, true, 'message_accepted', 'Your message has been accepted for sending.');
