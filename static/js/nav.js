function logout() {
    fetch('api/logout', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
            if (data['success']) {
                location.reload()
            }
        });

    return false;
}
