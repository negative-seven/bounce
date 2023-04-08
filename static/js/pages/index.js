function validateConfiguration() {
    if (!/^\d+$/.test(document.getElementById('massRatio').value)) {
        alert('Stosunek mas musi być liczbą całkowitą!');
        return false;
    }

    return true;
}

function runClicked() {
    if (!validateConfiguration()) {
        return;
    }

    simulation.reset();
}

function updateConfigurationButtons() {
    if (!document.getElementById('configurationsList')) {
        return;
    }

    let display;
    if (document.getElementById('configurationsList').selectedIndex == 0) {
        display = 'none';
    } else {
        display = 'inline';
    }
    document.getElementById('loadRemoveWraper').style.display = display;
}

function loadConfiguration() {
    if (document.getElementById('configurationsList').selectedIndex == 0) {
        return;
    }

    fetch('api/users/current/configurations/' + document.getElementById('configurationsList').value)
        .then(response => response.json())
        .then(data => {
            const configuration = data['configuration'];
            document.getElementById('massRatio').value = configuration['mass_ratio'];
            document.getElementById('leftBallColor').value = '#' + configuration['left_ball_color'];
            document.getElementById('rightBallColor').value = '#' + configuration['right_ball_color'];

            simulation.reset();
        });
}

function removeConfiguration() {
    if (document.getElementById('configurationsList').selectedIndex == 0) {
        return;
    }

    fetch('api/users/current/configurations/' + document.getElementById('configurationsList').value,
        { method: 'DELETE' }
    )
        .then(() => updateConfigurationsList());
}

function saveConfiguration() {
    if (!validateConfiguration()) {
        return;
    }

    const name = window.prompt('Nazwa:');

    if (name.length > 0) {
        let configuration = {
            'name': name,
            'mass_ratio': document.getElementById('massRatio').value,
            'left_ball_color': document.getElementById('leftBallColor').value.replace('#', ''),
            'right_ball_color': document.getElementById('rightBallColor').value.replace('#', ''),
        };

        fetch('api/users/current/configurations', {
            method: 'POST',
            body: JSON.stringify(configuration)
        })
            .then(() => updateConfigurationsList());
    }
}

function updateConfigurationsList() {
    fetch('api/users/current/configurations')
        .then(response => response.json())
        .then(data => {
            if (!data['success']) {
                return;
            }

            let configurationsList = document.getElementById('configurationsList');
            configurationsList.innerHTML = '';

            let emptyOption = document.createElement('option', { value: '' });
            emptyOption.innerHTML = 'Wybierz';
            configurationsList.appendChild(emptyOption);

            for (let entry of data['configurations']) {
                let option = document.createElement('option', { value: entry['name'] });
                option.innerHTML = entry['name'];
                configurationsList.appendChild(option);
            }

            updateConfigurationButtons();
        });
}

window.addEventListener(
    'load',
    () => {
        simulation = new Simulation(document.getElementById('simulationCanvas'));
        simulation.run(60);

        updateConfigurationsList();
        updateConfigurationButtons();
    }
);
