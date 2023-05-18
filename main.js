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

async function fetchProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    return data;
}

Promise.all([fetchProfile('LosBagros'), fetchProfile('lagemaxl')])
    .then(data => {
        renderProfile(data[0], 'profile-LosBagros');
        renderProfile(data[1], 'profile-lagemaxl');
    });
