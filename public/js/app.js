$(document).ready(function() {
    // Load majors dynamically
    $.ajax({
        url: '/get-majors',
        method: 'GET',
        success: function(majors) {
            majors.forEach(function(major) {
                $('#major-select').append(new Option(major.name, major.id));
            });
        }
    });

    // Load courses dynamically when a major is selected
    $('#major-select').change(function() {
        var majorId = $(this).val();
        $.ajax({
            url: '/get-courses/' + majorId,
            method: 'GET',
            success: function(courses) {
                $('#concentration-select').empty();
                courses.forEach(function(course) {
                    $('#concentration-select').append(new Option(course.name, course.id));
                });
            }
        });
    });
});
