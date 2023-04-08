function register() {
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    if (!data.username || !data.password) {
        return false;
    }

    fetch('api/register', { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.json())
        .then(data => {
            if (!data['success']) {
                console.log('registrations failed');
                return;
            }

            window.location.replace('login');
        })
        .catch(error => console.log('registration error'));

    return false;
}
