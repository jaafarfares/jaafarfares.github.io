<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST["name"]) ? $_POST["name"] : "";
    $email = isset($_POST["email"]) ? $_POST["email"] : "";
    $subject = isset($_POST["subject"]) ? $_POST["subject"] : "";
    $message = isset($_POST["message"]) ? $_POST["message"] : "";

    if (!empty($name) && !empty($email) && !empty($subject) && !empty($message)) {
        $to = "jaafarferes@gmail.com";
        $headers = "From: $email";

        if (mail($to, $subject, $message, $headers)) {
            echo "success";
        } else {
            echo "error_sending";
        }
    } else {
        echo "error_empty_fields";
    }
} else {
    echo "error_invalid_request";
}
?>
