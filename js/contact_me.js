'use strict';

(() => {
    const form = document.getElementById('contactForm');
    const button = document.getElementById('sendMessageButton');
    const buttonLabel = document.getElementById('send-button-label');
    const status = document.getElementById('success');
    const fields = [...form.querySelectorAll('[required]')];
    let pending = false;

    function feedback(message, state) {
        status.textContent = message;
        status.dataset.state = state;
    }

    // Keep native validation as the no-JavaScript fallback.
    form.noValidate = true;
    fields.forEach(field => {
        field.addEventListener('input', () => {
            field.setCustomValidity('');
            field.removeAttribute('aria-invalid');
        });
    });

    function validate() {
        let firstInvalid;
        fields.forEach(field => {
            field.setCustomValidity('');
            const value = field.value.trim();
            if (!value) field.setCustomValidity('Please complete this field.');
            else if (value.length > field.maxLength) field.setCustomValidity('Please shorten this field.');
            const valid = field.checkValidity();
            if (valid) field.removeAttribute('aria-invalid');
            else {
                field.setAttribute('aria-invalid', 'true');
                if (!firstInvalid) firstInvalid = field;
            }
        });
        if (firstInvalid) {
            feedback('Please check the required fields and enter a valid email address.', 'error');
            firstInvalid.focus();
            firstInvalid.reportValidity();
            return false;
        }
        return true;
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (pending || !validate()) return;
        pending = true;
        button.disabled = true;
        buttonLabel.textContent = 'Sending…';
        form.setAttribute('aria-busy', 'true');
        feedback('Sending your message…', 'pending');
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new URLSearchParams(new FormData(form)),
                signal: controller.signal,
                headers: { Accept: 'application/json' },
                credentials: 'same-origin'
            });
            if (!response.ok) {
                feedback(response.status === 422
                    ? 'Your submission was rejected. Please check your contact details and field lengths. Your message has been kept.'
                    : 'The contact service is unavailable. Your message has been kept; please try again later.', 'error');
                return;
            }
            let result;
            try {
                result = await response.json();
            } catch {
                feedback('The server returned an invalid response. Your message has been kept; please try again later.', 'error');
                return;
            }
            if (result && result.success === true && result.code === 'message_accepted') {
                feedback('Your message has been accepted for sending.', 'success');
                form.reset();
                fields.forEach(field => {
                    field.setCustomValidity('');
                    field.removeAttribute('aria-invalid');
                });
            } else {
                feedback('The server did not confirm your submission. Your message has been kept; please try again.', 'error');
            }
        } catch {
            feedback('The connection failed or timed out, so delivery could not be confirmed. Your message has been kept. Please check before retrying.', 'error');
        } finally {
            window.clearTimeout(timeout);
            pending = false;
            button.disabled = false;
            buttonLabel.textContent = 'Send Message';
            form.setAttribute('aria-busy', 'false');
        }
    });
})();
