function sendEmail(event) {
    event.preventDefault();

    let params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        subject: document.getElementById('subject').value
    };

    emailjs.send('service_ahqmb4w', 'template_o0f5qcf', params)
    .then(function(response) {
        console.log('Success!', response);
        alert('Email has been sent successfully!');
        document.getElementById('contact-form').reset();
    }, function(error) {
        console.error('Failed to send email:', error);
        alert('Failed to send the email. Please try again.');
    });

}
