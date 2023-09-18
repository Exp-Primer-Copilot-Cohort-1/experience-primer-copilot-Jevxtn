function skillsMember() {
    var skills = document.querySelectorAll('.skills');
    skills.forEach(function (skill) {
        var percentage = skill.getAttribute('data-percentage');
        var progressBar = skill.querySelector('.progress-bar');
        progressBar.style.width = percentage + '%';
    });
}