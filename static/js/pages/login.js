function login() {
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    fetch('api/login', { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.json())
        .then(data => {
            if (!data['success']) {
                document.getElementById('errorOutput').innerHTML = 'Uwierzytelnienie nie powiodło się.';
                return;
            }

            window.location.replace('/');
        })
        .catch(error => console.log('Błąd przy logowaniu'));

    return false;
}
