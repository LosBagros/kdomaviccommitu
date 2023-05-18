// Function to render the commit chart
function renderCommitChart(commitsData) {
    const ctx = document.getElementById('chart').getContext('2d');
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: commitsData.dates,
        datasets: commitsData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: true,
            intersect: false
          },
          legend: {
            display: true,
            position: 'top'
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true
              },
              pinch: {
                enabled: true
              },
              mode: 'xy'
            },
            pan: {
              enabled: true,
              mode: 'xy'
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '# of Commits'
            }
          }
        }
      }
    });
  }
  
  // Function to render the user profile
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
  
  // Function to fetch commit data for a user
  async function fetchCommits(username) {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);
    const data = await response.json();
    const commitData = data.filter(event => event.type === 'PushEvent');
    const commitsByDate = groupCommitsByDate(commitData);
    return {
      dates: Object.keys(commitsByDate),
      datasets: [
        {
          label: username,
          data: Object.values(commitsByDate),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  }
  
  // Function to group commits by date
  function groupCommitsByDate(commitData) {
    const commitsByDate = {};
    commitData.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString();
      if (commitsByDate[date]) {
        commitsByDate[date]++;
      } else {
        commitsByDate[date] = 1;
      }
    });
    return commitsByDate;
  }
  
  // Function to fetch user profile data
  async function fetchProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    return data;
  }
  
  // Fetch commit data for both users
  Promise.all([fetchCommits('LosBagros'), fetchCommits('lagemaxl')])
    .then(data => {
      const commitsDataLosBagros = data[0];
      const commitsDataLagemaxl = data[1];
  
      const ctx = document.getElementById('chart').getContext('2d');
      renderCommitChart({
        dates: commitsDataLosBagros.dates,
        datasets: [
          commitsDataLosBagros.datasets[0],
          {
            label: 'lagemaxl',
            data: commitsDataLagemaxl.datasets[0].data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      });
  
      // Fetch and render user profile for both users
      Promise.all([fetchProfile('LosBagros'), fetchProfile('lagemaxl')])
        .then(profilesData => {
          renderProfile(profilesData[0], 'profile-LosBagros');
          renderProfile(profilesData[1], 'profile-lagemaxl');
        });
    });
  