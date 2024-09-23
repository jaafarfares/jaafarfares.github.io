<?php
// Allow CORS if needed (uncomment the next line if facing cross-origin issues)
// header("Access-Control-Allow-Origin: *");

// Only handle POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input fields
    $name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
    $subject = filter_var($_POST["subject"], FILTER_SANITIZE_STRING);
    $message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);

    // Check if email is valid
    if ($email === false) {
        echo "Invalid email format.";
        exit;
    } 

    // Set recipient and headers
    $to = "jaafarferes@gmail.com";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Attempt to send email
    if (mail($to, $subject, $message, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    // If not a POST request, show error
    http_response_code(405); // Set correct HTTP status code
    echo "Error: 405 Method Not Allowed";
}
?>
