function renderCommitChart(commitsData) {
    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['LosBagros', 'lagemaxl'],
            datasets: [{
                label: '# of Commits',
                data: [commitsData[0], commitsData[1]],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {beginAtZero: true}
            }
        }
    });
}

function renderProfile(user, targetElementId) {
    const container = document.getElementById(targetElementId);
    container.classList.add('profile');
    container.innerHTML = `
        <h2>${user.login}</h2>
        <img src="${user.avatar_url}" width="100" />
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
        <p><strong>Public repos:</strong> ${user.public_repos}</p>
    `;
}

async function fetchCommits(username) {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);
    const data = await response.json();
    return data.filter(event => event.type === 'PushEvent').length;
}

// Funkce pro získání profilu uživatele z API GitHubu
async function fetchProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    return data;
}

Promise.all([fetchCommits('LosBagros'), fetchCommits('lagemaxl')])
    .then(commitsData => {
        renderCommitChart(commitsData);
    });

Promise.all([fetchProfile('LosBagros'), fetchProfile('lagemaxl')])
    .then(profilesData => {
        renderProfile(profilesData[0], 'profile-LosBagros');
        renderProfile(profilesData[1], 'profile-lagemaxl');
    });
