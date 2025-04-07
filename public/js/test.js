document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("test-output");

  const test = (description, fn) => {
    try {
      fn();
      const item = document.createElement("li");
      item.textContent = `✅ ${description}`;
      item.style.color = "green";
      resultsContainer.appendChild(item);
    } catch (error) {
      const item = document.createElement("li");
      item.textContent = `❌ ${description}: ${error.message}`;
      item.style.color = "red";
      resultsContainer.appendChild(item);
    }
  };

  // Wait a short time after page load to let courses populate
  setTimeout(() => {
    // TEST: Did the JSON load and generate courses?
    test("JSON data was loaded into core-classes", () => {
      const coreBox = document.getElementById("core-classes");
      const courses = coreBox.querySelectorAll(".course");
      if (courses.length === 0) throw new Error("No core courses found.");
    });

    // TEST: Are courses draggable?
    test("Courses are draggable", () => {
      const course = document.querySelector(".course");
      if (!course || course.getAttribute("draggable") !== "true") {
        throw new Error("Course not draggable.");
      }
    });

    // TEST: All categories have at least one course
    test("All course category boxes are populated", () => {
      const boxes = ["core-classes", "math-classes", "concentration-required", "concentration-electives"];
      boxes.forEach(id => {
        const box = document.getElementById(id);
        const courses = box.querySelectorAll(".course");
        if (courses.length === 0) {
          throw new Error(`No courses in ${id}`);
        }
      });
    });
  }, 1000); // Wait 1 second for JSON to load and render
});
