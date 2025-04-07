function normalizeConcentration(data) {
    const sections = [];
  
    if (data.sections) sections.push(...data.sections);
    if (data.coreCourses) sections.push({ label: "Core", courses: data.coreCourses });
    if (data.mathStatsCourses) sections.push({ label: "Math", courses: data.mathStatsCourses });
  
    return sections;
  }
  
  // Utility to display test result
  function logResult(message, passed) {
    const output = document.getElementById('testResults');
    const result = document.createElement('div');
    result.textContent = passed ? `✅ ${message}` : `❌ ${message}`;
    result.style.color = passed ? 'lightgreen' : 'red';
    result.style.fontWeight = 'bold';
    output.appendChild(result);
  }
  
  // Test 1: Empty input
  function testEmptyInput() {
    const result = normalizeConcentration({});
    const passed = Array.isArray(result) && result.length === 0;
    logResult("testEmptyInput - should return empty array", passed);
  }
  
  // Test 2: Input with coreCourses
  function testCoreCourseInput() {
    const result = normalizeConcentration({
      coreCourses: [{ code: "ITSC1212", title: "Intro to CS I" }]
    });
  
    const passed =
      result.length === 1 &&
      result[0].label === "Core" &&
      result[0].courses[0].code === "ITSC1212";
  
    logResult("testCoreCourseInput - should return core section with course", passed);
  }
  
  // Run tests when DOM is ready
  window.addEventListener("DOMContentLoaded", () => {
    testEmptyInput();
    testCoreCourseInput();
  });
  