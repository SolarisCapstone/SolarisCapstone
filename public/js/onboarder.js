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

        const data = {
            major: $('#major-select').val(),
            concentration: $('#concentration-select').val(),
            semester: $('#start-semester').val(),
            year: $('input[name="year"]').val(),
            credit_hours: $('#credit-hours').val(),
            transfer_credits: $('#transfer-credits').val(),
            summer_classes: $('#summer-classes').val(),
            summer_credits: $('#summer-credits').val()
        };

        $.ajax({
            url: '/api/onboarding',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                alert('Preferences saved successfully!');
            },
            error: function (err) {
                console.error(err);
                alert('Failed to save preferences.');
            }
        });
    });
});
