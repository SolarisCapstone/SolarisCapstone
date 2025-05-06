$(document).ready(function () {
    // Populate Majors Dropdown
    $.get('/api/majors', function (majors) {
        majors.forEach(function (major) {
            $('#major-select').append(`<option value="${major.id}">${major.name}</option>`);
        });
    });

    // Populate Concentrations Dropdown
    $.get('/api/concentrations', function (concentrations) {
        concentrations.forEach(function (concentration) {
            $('#concentration-select').append(`<option value="${concentration.id}">${concentration.name}</option>`);
        });
    });

    // Handle Form Submission
    $('#onboardingForm').on('submit', function (event) {
        event.preventDefault();

        const isAdvisor = $('#is-advisor').is(':checked');

        const data = {
            is_advisor: isAdvisor,
            major: isAdvisor ? null : $('#major-select').val(),
            concentration: isAdvisor ? null : $('#concentration-select').val(),
            semester: isAdvisor ? null : $('#start-semester').val(),
            year: isAdvisor ? null : $('input[name="year"]').val(),
            credit_hours: isAdvisor ? null : $('#credit-hours').val(),
            transfer_credits: isAdvisor ? null : $('#transfer-credits').val(),
            summer_classes: isAdvisor ? null : $('#summer-classes').val(),
            summer_credits: isAdvisor ? null : $('#summer-credits').val()
        };

        $.ajax({
            url: '/api/onboarding',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                const redirectTo = isAdvisor ? '/advisor_dashboard.html' : '/dashboard.html';
                window.location.href = redirectTo;
            },
            error: function (err) {
                console.error(err);
                alert('Failed to save preferences.');
            }
        });
    });
});
